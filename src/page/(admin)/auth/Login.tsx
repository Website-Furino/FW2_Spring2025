import React, { useState } from "react";
import { Form, Input, Button, Checkbox, message, Spin } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LoginAdmin = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const handleLogin = (values: any) => {
    setLoading(true);
    axios
      .post("http://localhost:3000/login", values)
      .then((response) => {
        if (response.data.user?.role === "admin") {
          localStorage.setItem("user", JSON.stringify(response.data.user));
          navigate("/admin/dashboard");
          message.success("Đăng nhập thành công!");
        } else {
          message.error("Không có quyền truy cập admin!");
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Lỗi đăng nhập:", error);
        message.error("Tên đăng nhập hoặc mật khẩu không chính xác!");
        setLoading(false);
      });
  };

  return (
    <div style={{ maxWidth: "400px", margin: "0 auto", paddingTop: "100px" }}>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
        Đăng nhập Admin
      </h2>
      <Form
        form={form}
        name="login"
        onFinish={handleLogin}
        initialValues={{ remember: true }}
        layout="vertical"
      >
        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, message: "Vui lòng nhập email!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Mật khẩu"
          name="password"
          rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item name="remember" valuePropName="checked">
          <Checkbox>Nhớ mật khẩu</Checkbox>
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            block
            loading={loading}
            style={{ backgroundColor: "#1890ff", borderColor: "#1890ff" }}
          >
            {loading ? <Spin /> : "Đăng nhập"}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default LoginAdmin;
