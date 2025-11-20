import React, { useEffect, useState } from "react";
import API from "../api";
import ProductForm from "./ProductForm";
import { Link } from "react-router-dom";
import { Table, Button, Space, Card, Modal } from "antd";
import "./ProductList.css";

export default function ProductsList() {
  const [products, setProducts] = useState([]);
  const [editing, setEditing] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const fetchProducts = async () => {
    const { data } = await API.get("/products");
    setProducts(data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const deleteProduct = async id => {
    if (!window.confirm("Delete?")) return;
    await API.delete(`/products/${id}`);
    fetchProducts();
  };

  const openAddModal = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const openEditModal = record => {
    setEditing(record);
    setModalOpen(true);
  };

  const closeModal = () => {
    setEditing(null);
    setModalOpen(false);
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "SKU",
      dataIndex: "sku",
      key: "sku",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: price => `₹${price}`,
    },
    {
      title: "Stock",
      dataIndex: "stock",
      key: "stock",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            style={{ backgroundColor: "#22c65e", borderColor: "#22c65e" }}
            onClick={() => openEditModal(record)}
          >
            Edit
          </Button>

          <Button danger onClick={() => deleteProduct(record._id)}>
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: "30px" }}>
      <Card style={{ marginBottom: "20px" }}>
        <div className="card-header">
          <h2 style={{ margin: 0 }}>Products</h2>
          <div style={{ display: "flex", gap: "10px" }}>
            <Button
              type="primary"
              style={{ backgroundColor: "#22c65e", borderColor: "#22c65e" }}
              onClick={openAddModal}
            >
              Add Product
            </Button>

            <Link to="/admin/sales">
              <Button
                type="primary"
                style={{ backgroundColor: "#22c65e", borderColor: "#22c65e" }}
              >
                View Sales
              </Button>
            </Link>
          </div>
        </div>
      </Card>

      <Card>
        <Table
          dataSource={products}
          columns={columns}
          rowKey="_id"
          pagination={{ pageSize: 5 }}
          scroll={{ x: "max-content" }}
        />
      </Card>

      {/* ------------ ADD / EDIT PRODUCT MODAL -------------- */}
      <Modal
        title={editing ? "Edit Product" : "Add Product"}
        open={modalOpen}
        onCancel={closeModal}
        footer={null}
        destroyOnClose
      >
        <ProductForm
          editing={editing}
          onSaved={() => {
            fetchProducts();
            closeModal();
          }}
          clear={closeModal}
        />
      </Modal>
    </div>
  );
}
