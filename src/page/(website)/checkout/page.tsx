import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Input,
  Form,
  Button,
  Row,
  Col,
  Card,
  Typography,
  Space,
  message,
  Radio,
  Divider,
} from "antd";
import { CreditCardOutlined, IdcardOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

const CheckoutPage = () => {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [userInfo, setUserInfo] = useState({
    email: "",
    fullName: "",
    phone: "",
    address: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("COD");
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:3000/carts")
      .then((response) => {
        setCartItems(response.data);
      })
      .catch((error) => {
        console.error("Error fetching cart items:", error);
      });
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserInfo((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handlePaymentMethodChange = (e: any) => {
    setPaymentMethod(e.target.value);
  };

  const handlePlaceOrder = () => {
    if (
      !userInfo.fullName ||
      !userInfo.phone ||
      !userInfo.email ||
      !userInfo.address
    ) {
      message.error("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    // Lấy ngày hiện tại để làm ngày đặt hàng
    const orderDate = new Date().toISOString();

    const orderData = {
      userInfo,
      cartItems,
      totalPrice: cartItems.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      ),
      paymentMethod,
      orderDate, // Thêm ngày đặt hàng vào orderData
      status: "pending", // Trạng thái mặc định là "pending"
    };

    axios
      .post("http://localhost:3000/orders", orderData)
      .then((response) => {
        console.log(response);

        message.success("Đặt hàng thành công!");

        // Xóa các sản phẩm trong giỏ hàng theo id
        cartItems.forEach((item) => {
          axios
            .delete(`http://localhost:3000/carts/${item.id}`) // API xóa sản phẩm theo ID
            .then(() => {
              // Cập nhật lại giỏ hàng sau khi xóa thành công
              setCartItems((prevCartItems) =>
                prevCartItems.filter((cartItem) => cartItem.id !== item.id)
              );
            })
            .catch((error) => {
              console.error(`Lỗi khi xóa sản phẩm ${item.id}:`, error);
              message.error(`Có lỗi xảy ra khi xóa sản phẩm ${item.name}`);
            });
        });

        navigate("/shop/checkout/thankyou");
      })
      .catch((error) => {
        console.error("Lỗi khi đặt hàng:", error);
        message.error("Có lỗi xảy ra khi đặt hàng!");
      });
  };

  return (
    <div
      className="checkout-container"
      style={{ maxWidth: "1200px", margin: "0 auto", paddingTop: "50px" }}
    >
      <Title level={3} className="text-center mb-30">
        Thông tin thanh toán
      </Title>

      <Row gutter={24}>
        {/* Box 1: Form thông tin người dùng */}
        <Col span={12}>
          <Card
            title="Thông tin người dùng"
            bordered={false}
            className="card-custom"
            style={{ boxShadow: "0 4px 16px rgba(0, 0, 0, 0.1)" }}
          >
            <Form layout="vertical" hideRequiredMark>
              <Form.Item label="Họ và tên">
                <Input
                  name="fullName"
                  value={userInfo.fullName}
                  onChange={handleInputChange}
                  placeholder="Nhập họ và tên"
                  style={{ borderRadius: "8px" }}
                />
              </Form.Item>

              <Form.Item label="Số điện thoại">
                <Input
                  name="phone"
                  value={userInfo.phone}
                  onChange={handleInputChange}
                  placeholder="Nhập số điện thoại"
                  style={{ borderRadius: "8px" }}
                />
              </Form.Item>

              <Form.Item label="Email">
                <Input
                  name="email"
                  value={userInfo.email}
                  onChange={handleInputChange}
                  placeholder="Nhập email"
                  style={{ borderRadius: "8px" }}
                />
              </Form.Item>

              <Form.Item label="Địa chỉ">
                <Input
                  name="address"
                  value={userInfo.address}
                  onChange={handleInputChange}
                  placeholder="Nhập địa chỉ"
                  style={{ borderRadius: "8px" }}
                />
              </Form.Item>
            </Form>
          </Card>
        </Col>

        {/* Box 2: Hiển thị giỏ hàng và thanh toán */}
        <Col span={12}>
          <Card
            title="Giỏ hàng"
            bordered={false}
            className="card-custom"
            style={{ boxShadow: "0 4px 16px rgba(0, 0, 0, 0.1)" }}
          >
            <div className="cart-items">
              {cartItems.length > 0 ? (
                cartItems.map((item) => (
                  <div key={item.id} className="cart-item">
                    <Row gutter={16}>
                      <Col span={16}>
                        <Text>{item.name}</Text>
                      </Col>
                      <Col span={8} style={{ textAlign: "right" }}>
                        <Text>
                          {item.quantity} x {item.price.toLocaleString()}đ
                        </Text>
                      </Col>
                    </Row>
                  </div>
                ))
              ) : (
                <Text type="secondary">Giỏ hàng trống</Text>
              )}
            </div>

            <Divider />

            <Row gutter={16}>
              <Col span={12}>
                <Text strong>Tổng cộng:</Text>
              </Col>
              <Col span={12} style={{ textAlign: "right" }}>
                <Text strong style={{ fontSize: "18px" }}>
                  {cartItems
                    .reduce((acc, item) => acc + item.price * item.quantity, 0)
                    .toLocaleString()}
                  đ
                </Text>
              </Col>
            </Row>

            <Divider />

            {/* Phương thức thanh toán */}
            <Form.Item label="Chọn phương thức thanh toán">
              <Radio.Group
                value={paymentMethod}
                onChange={handlePaymentMethodChange}
                style={{ width: "100%" }}
              >
                <Radio value="COD" style={{ padding: "8px" }}>
                  <IdcardOutlined /> Thanh toán khi nhận hàng (COD)
                </Radio>
                <Radio value="VNPAY" style={{ padding: "8px" }}>
                  <CreditCardOutlined /> Thanh toán qua VNPAY
                </Radio>
              </Radio.Group>
            </Form.Item>

            {/* Button đặt hàng */}
            <Space style={{ width: "100%", marginTop: "20px" }}>
              <Button
                type="primary"
                size="large"
                block
                onClick={handlePlaceOrder}
              >
                Đặt hàng
              </Button>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default CheckoutPage;
