import React, { useEffect } from "react";
import { Form, Input, InputNumber, Button, Space } from "antd";
import API from "../api";

export default function ProductForm({ editing, onSaved, clear }) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (editing) {
      form.setFieldsValue({
        name: editing.name,
        sku: editing.sku,
        price: editing.price,
        stock: editing.stock,
      });
    } else {
      form.resetFields();
    }
  }, [editing]);

  const submit = async values => {
    const payload = {
      name: values.name,
      sku: values.sku,
      price: Number(values.price),
      stock: Number(values.stock),
    };

    if (editing) {
      await API.put(`/products/${editing._id}`, payload);
    } else {
      await API.post("/products", payload);
    }

    onSaved();
    if (clear) clear();
  };

  return (
    <Form form={form} layout="vertical" onFinish={submit}>
      <Form.Item
        label="Product Name"
        name="name"
        rules={[{ required: true, message: "Please enter product name" }]}
      >
        <Input placeholder="Enter product name" />
      </Form.Item>

      <Form.Item
        label="SKU"
        name="sku"
        rules={[{ required: true, message: "Please enter SKU" }]}
      >
        <Input placeholder="Enter SKU" />
      </Form.Item>

      <Form.Item
        label="Price (₹)"
        name="price"
        rules={[{ required: true, message: "Enter price" }]}
      >
        <InputNumber
          min={1}
          style={{ width: "100%" }}
          placeholder="Enter price"
        />
      </Form.Item>

      <Form.Item
        label="Stock"
        name="stock"
        rules={[{ required: true, message: "Enter stock" }]}
      >
        <InputNumber
          min={0}
          style={{ width: "100%" }}
          placeholder="Enter stock"
        />
      </Form.Item>

      <Form.Item>
        <Space>
          <Button
            type="primary"
            htmlType="submit"
            style={{ backgroundColor: "#22c65e", borderColor: "#22c65e" }}
          >
            {editing ? "Update" : "Create"}
          </Button>

          {editing && <Button onClick={clear}>Cancel</Button>}
        </Space>
      </Form.Item>
    </Form>
  );
}
