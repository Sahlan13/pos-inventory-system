import { useEffect, useState } from "react";
import API from "../api";
import { Link } from "react-router-dom";
import { Table, Button, Layout, Typography } from "antd";

const { Content } = Layout;
const { Title } = Typography;

export default function SalesList() {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSales = async () => {
    try {
      const { data } = await API.get("/sales");
      console.log("sale", data);
      // Flatten sale + item into one table row
      const rows = data.flatMap(sale =>
        sale.items.map(item => ({
          key: item._id,
          product: item.name,
          price: item.price,
          qty: item.qty,
          amount: item.qty * item.price,
          datetime: new Date(sale.createdAt).toLocaleString(),
        }))
      );

      setSales(rows);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to load sales");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSales();
  }, []);

  const columns = [
    {
      title: "Product",
      dataIndex: "product",
      key: "product",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: val => `₹ ${val}`,
      align: "center",
    },
    {
      title: "Quantity Sold",
      dataIndex: "qty",
      key: "qty",
      align: "center",
    },
    {
      title: "Total Amount",
      dataIndex: "amount",
      key: "amount",
      render: val => `₹ ${val}`,
      align: "center",
    },
    {
      title: "Date & Time",
      dataIndex: "datetime",
      key: "datetime",
    },
  ];

  return (
    <Content>
      {/* Top Bar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 20,
        }}
      >
        <Title level={3} style={{ margin: 0 }}>
          Sales Data
        </Title>

        <Link to="/admin/products">
          <Button
            type="primary"
            style={{ backgroundColor: "#22c65e", borderColor: "#22c65e" }}
          >
            View Products
          </Button>
        </Link>
      </div>

      {/* Table */}
      <Table
        columns={columns}
        dataSource={sales}
        loading={loading}
        bordered
        pagination={{ pageSize: 10 }}
        scroll={{ x: "max-content" }}
      />
    </Content>
  );
}
