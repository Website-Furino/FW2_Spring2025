import { Button, Form, Input, Card } from "antd";
import { useAuth } from "../../../../hooks";
import { Link } from "react-router-dom";

const Login = () => {
  const { mutate } = useAuth({ resource: "login" });
  const onFinish = (values: any) => {
    mutate(values);
  };
  return (
    <div style={{ display: "flex", justifyContent: "center", marginTop: 50, padding: "0 16px" }}>
      <Card style={{ width: "100%", maxWidth: 400, padding: "20px" }}>
        <h2 style={{ textAlign: "center", marginBottom: 20, fontSize: "clamp(1.5rem, 4vw, 2rem)" }}>Đăng nhập</h2>
        <Form onFinish={onFinish} layout="vertical">
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: "Vui lòng nhập email!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Đăng nhập
            </Button>
          </Form.Item>
        </Form>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            marginTop: 20,
            gap: 10,
          }}
        >
          <span>Chưa có tài khoản?</span>
          <Link to="/register">
            <Button type="link" style={{ padding: 0 }}>
              Đăng ký ngay
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default Login;