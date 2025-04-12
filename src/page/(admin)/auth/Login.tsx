import { useState } from "react";
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
      .post("https://json-server-online-8kf1.onrender.com/login", values)
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
    <div
      style={{
        width: "90%",
        maxWidth: "400px",
        margin: "0 auto",
        paddingTop: "clamp(50px, 10vh, 100px)",
        padding: "20px"
      }}
    >
      <h2
        style={{
          textAlign: "center",
          marginBottom: "20px",
          fontSize: "clamp(1.5rem, 4vw, 2rem)"
        }}
      >
        Đăng nhập Admin
      </h2>
      <Form
        form={form}
        name="login"
        onFinish={handleLogin}
        initialValues={{ remember: true }}
        layout="vertical"
        style={{ width: "100%" }}
      >
        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, message: "Vui lòng nhập email!" }]}
        >
          <Input size="large" />
        </Form.Item>

        <Form.Item
          label="Mật khẩu"
          name="password"
          rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
        >
          <Input.Password size="large" />
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
            size="large"
            style={{
              backgroundColor: "#1890ff",
              borderColor: "#1890ff",
              height: "auto",
              padding: "8px 16px",
              fontSize: "16px"
            }}
          >
            {loading ? <Spin /> : "Đăng nhập"}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default LoginAdmin;