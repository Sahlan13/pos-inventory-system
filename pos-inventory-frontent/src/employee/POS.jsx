import React, { useState } from "react";
import {
  Row,
  Col,
  Input,
  Button,
  Table,
  Form,
  InputNumber,
  message,
  Card,
} from "antd";
import API from "../api";
import { ToastContainer, toast } from "react-toastify";
import "./POS.css";

export default function POS() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);

  const search = async () => {
    setLoading(true);
    try {
      const { data } = await API.get(
        "/pos/search?q=" + encodeURIComponent(query)
      );
      setResults(data);
    } catch (err) {
      message.error(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = product => {
    const existing = cart.find(c => c.productId === product._id);
    if (existing) {
      if (existing.qty + 1 > product.stock) {
        message.error("Exceeds stock");
        return;
      }
      setCart(
        cart.map(c =>
          c.productId === product._id ? { ...c, qty: c.qty + 1 } : c
        )
      );
    } else {
      if (product.stock < 1) {
        message.error("Out of stock");
        return;
      }
      setCart([
        ...cart,
        {
          productId: product._id,
          name: product.name,
          price: product.price,
          qty: 1,
          stock: product.stock,
        },
      ]);
    }
  };

  const changeQty = (productId, qty) => {
    setCart(cart.map(c => (c.productId === productId ? { ...c, qty } : c)));
  };

  const confirmSale = async () => {
    try {
      const payload = {
        items: cart.map(c => ({ productId: c.productId, qty: c.qty })),
      };
      const { data } = await API.post("/pos/sale", payload);
      message.success("Sale saved: " + data.sale._id);
      toast("Sale completed successfully");

      setCart([]);
      setResults([]);
      setQuery("");
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
      message.error(err.response?.data?.message || err.message);
    }
  };

  const resultColumns = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Price", dataIndex: "price", key: "price", render: v => `₹${v}` },
    { title: "Stock", dataIndex: "stock", key: "stock" },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Button onClick={() => addToCart(record)}>Add</Button>
      ),
    },
  ];

  const cartColumns = [
    { title: "Product", dataIndex: "name", key: "name" },
    {
      title: "Qty",
      key: "qty",
      render: (_, record) => (
        <InputNumber
          min={1}
          max={record.stock}
          value={record.qty}
          onChange={value => changeQty(record.productId, value)}
        />
      ),
    },
    { title: "Price", dataIndex: "price", key: "price", render: v => `₹${v}` },
    {
      title: "Sub",
      key: "sub",
      render: (_, record) => `₹${record.qty * record.price}`,
    },
  ];

  const total = cart.reduce((sum, i) => sum + i.qty * i.price, 0);

  return (
    <div className="pos-container">
      <ToastContainer />
      <Card className="pos-card" title={<h2>POS</h2>}>
        <Row gutter={[16, 16]}>
          {/* Left: Search + Results */}
          <Col xs={24} sm={24} md={16}>
            <Form
              layout="inline"
              style={{ marginBottom: 16, flexWrap: "wrap" }}
            >
              <Form.Item style={{ flex: "1 1 200px" }}>
                <Input
                  placeholder="Search by name or SKU"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                />
              </Form.Item>
              <Form.Item>
                <Button type="primary" onClick={search} loading={loading}>
                  Search
                </Button>
              </Form.Item>
            </Form>
            <Table
              dataSource={results}
              columns={resultColumns}
              rowKey="_id"
              pagination={{ pageSize: 5 }}
              scroll={{ x: "max-content" }}
            />
          </Col>

          {/* Right: Cart */}
          <Col xs={24} sm={24} md={8}>
            <h3>Cart</h3>
            <Table
              dataSource={cart}
              columns={cartColumns}
              rowKey="productId"
              pagination={false}
              size="small"
              scroll={{ x: "max-content" }}
              footer={() => <div>Total: ₹{total}</div>}
            />
            <Button
              type="primary"
              onClick={confirmSale}
              disabled={cart.length === 0}
              style={{ marginTop: 8, width: "100%" }}
            >
              Confirm Sale
            </Button>
          </Col>
        </Row>
      </Card>
    </div>
  );
}
