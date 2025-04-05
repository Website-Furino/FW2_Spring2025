import React, { useState } from "react";
import { Button, Form, Input, message, Row, Col, Card } from "antd";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

type Register = {
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
  phone: string;
  address: string;
  role: string;
};

function Register() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values: Register) => {
    if (values.password !== values.confirmPassword) {
      message.error("Passwords do not match!");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:3000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: values.email,
          password: values.password,
          fullName: values.fullName,
          phone: values.phone,
          address: values.address,
          role: "user",
        }),
      });

      if (!response.ok) {
        throw new Error("Đăng ký thất bại!");
      }

      const data = await response.json();
      message.success("Đăng ký thành công")
      navigate("/login");
    } catch (error) {
      message.error(error?.message || "Đăng ký thất bại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", marginTop: 50 }}>
      <Card style={{ width: 600, padding: 20 }}>
        <h2 style={{ textAlign: "center", marginBottom: 20 }}>Register</h2>
        <Form onFinish={onFinish} layout="vertical">
          <Row gutter={16}>
            {/* Left Column */}
            <Col span={12}>
              <Form.Item
                label="Full Name"
                name="fullName"
                rules={[
                  { required: true, message: "Please input your full name!" },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: "Please input your email!" },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Phone"
                name="phone"
                rules={[
                  {
                    required: true,
                    message: "Please input your phone number!",
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>

            {/* Right Column */}
            <Col span={12}>
              <Form.Item
                label="Address"
                name="address"
                rules={[
                  { required: true, message: "Please input your address!" },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Password"
                name="password"
                rules={[
                  { required: true, message: "Please input your password!" },
                ]}
              >
                <Input.Password />
              </Form.Item>

              <Form.Item
                label="Confirm Password"
                name="confirmPassword"
                dependencies={["password"]}
                rules={[
                  { required: true, message: "Please confirm your password!" },
                ]}
              >
                <Input.Password />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={loading}
              style={{
                backgroundColor: "#1890ff",
                borderColor: "#1890ff",
              }}
            >
              Register
            </Button>
          </Form.Item>
        </Form>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginTop: 20,
          }}
        >
          <span style={{ marginRight: 10 }}>Đã có tài khoản?</span>
          <Link to="/login">
            <Button type="link" style={{ padding: 0 }}>
              Đăng nhập ngay
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}

export default Register;
