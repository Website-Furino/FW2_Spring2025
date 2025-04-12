import { useState, useEffect } from "react";
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
  Select,
} from "antd";
import { CreditCardOutlined, IdcardOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;
const { Option } = Select;

const CheckoutPage = () => {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [userInfo, setUserInfo] = useState({
    email: "",
    fullName: "",
    phone: "",
    address: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [provinces, setProvinces] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);
  const [wards, setWards] = useState<any[]>([]);
  const [selectedProvince, setSelectedProvince] = useState<any>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<any>(null);
  const [selectedWard, setSelectedWard] = useState<any>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    if (user && user.email) {
      setUserInfo({
        email: user.email,
        fullName: user.fullName,
        phone: user.phone,
        address: user.address,
      });

      axios
        .get(`https://json-server-online-8kf1.onrender.com/carts?userID=${user.id}`)
        .then((response) => {
          setCartItems(response.data);
        })
        .catch((error) => {
          console.error("Error fetching cart items:", error);
        });
    } else {
      message.error("Không tìm thấy thông tin người dùng!");
      navigate("/login");
    }

    axios.get("https://provinces.open-api.vn/api/?depth=1").then((res) => {
      setProvinces(res.data);
    });
  }, [navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserInfo((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleProvinceChange = (code: string) => {
    const province = provinces.find((p: any) => p.code === code);
    setSelectedProvince(province);
    setSelectedDistrict(null);
    setSelectedWard(null);
    axios
      .get(`https://provinces.open-api.vn/api/p/${code}?depth=2`)
      .then((res) => setDistricts(res.data.districts));
  };

  const handleDistrictChange = (code: string) => {
    const district = districts.find((d: any) => d.code === code);
    setSelectedDistrict(district);
    setSelectedWard(null);
    axios
      .get(`https://provinces.open-api.vn/api/d/${code}?depth=2`)
      .then((res) => setWards(res.data.wards));
  };

  const handleWardChange = (code: string) => {
    const ward = wards.find((w: any) => w.code === code);
    setSelectedWard(ward);

    setUserInfo((prev) => ({
      ...prev,
      address: `${ward.name}, ${selectedDistrict.name}, ${selectedProvince.name}`,
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

    const orderDate = new Date().toISOString();

    const orderData = {
      userInfo,
      cartItems,
      totalPrice: cartItems.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      ),
      paymentMethod,
      orderDate,
      status: "Chờ xác nhận",
    };

    axios
      .post("https://json-server-online-8kf1.onrender.com/orders", orderData)
      .then(() => {
        message.success("Đặt hàng thành công!");

        cartItems.forEach((item) => {
          axios
            .delete(`https://json-server-online-8kf1.onrender.com/carts/${item.id}`)
            .then(() => {
              setCartItems((prev) =>
                prev.filter((cartItem) => cartItem.id !== item.id)
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
      style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}
    >
      <Title level={3} className="text-center mb-30" style={{ textAlign: "center", marginBottom: "30px" }}>
        Thông tin thanh toán
      </Title>

      <Row gutter={[24, 24]}>
        <Col xs={24} sm={24} md={24} lg={12}>
          <Card
            title="Thông tin người dùng"
            bordered={false}
            style={{ boxShadow: "0 4px 16px rgba(0, 0, 0, 0.1)", marginBottom: "20px" }}
          >
            <Form layout="vertical" hideRequiredMark>
              <Form.Item label="Họ và tên">
                <Input
                  name="fullName"
                  value={userInfo.fullName}
                  onChange={handleInputChange}
                  placeholder="Nhập họ và tên"
                />
              </Form.Item>

              <Form.Item label="Số điện thoại">
                <Input
                  name="phone"
                  value={userInfo.phone}
                  onChange={handleInputChange}
                  placeholder="Nhập số điện thoại"
                />
              </Form.Item>

              <Form.Item label="Email">
                <Input
                  name="email"
                  value={userInfo.email}
                  onChange={handleInputChange}
                  placeholder="Nhập email"
                />
              </Form.Item>

              <Form.Item label="Tỉnh / Thành phố">
                <Select
                  showSearch
                  placeholder="Chọn tỉnh/thành phố"
                  onChange={handleProvinceChange}
                  value={selectedProvince?.code}
                >
                  {provinces.map((p) => (
                    <Option key={p.code} value={p.code}>
                      {p.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item label="Quận / Huyện">
                <Select
                  showSearch
                  placeholder="Chọn quận/huyện"
                  onChange={handleDistrictChange}
                  value={selectedDistrict?.code}
                  disabled={!selectedProvince}
                >
                  {districts.map((d) => (
                    <Option key={d.code} value={d.code}>
                      {d.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item label="Phường / Xã">
                <Select
                  showSearch
                  placeholder="Chọn phường/xã"
                  onChange={handleWardChange}
                  value={selectedWard?.code}
                  disabled={!selectedDistrict}
                >
                  {wards.map((w) => (
                    <Option key={w.code} value={w.code}>
                      {w.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item label="Địa chỉ chi tiết">
                <Input
                  name="address"
                  value={userInfo.address}
                  onChange={handleInputChange}
                  placeholder="Ví dụ: Số 1, đường A, phường B..."
                />
              </Form.Item>
            </Form>
          </Card>
        </Col>

        <Col xs={24} sm={24} md={24} lg={12}>
          <Card
            title="Giỏ hàng"
            bordered={false}
            style={{ boxShadow: "0 4px 16px rgba(0, 0, 0, 0.1)" }}
          >
            <div style={{ maxHeight: "300px", overflowY: "auto" }}>
              {cartItems.length > 0 ? (
                cartItems.map((item) => (
                  <div key={item.id} style={{ marginBottom: "10px" }}>
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

            <Row>
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

            <Form.Item label="Phương thức thanh toán">
              <Radio.Group
                value={paymentMethod}
                onChange={handlePaymentMethodChange}
                style={{ display: "flex", flexDirection: "column", gap: "10px" }}
              >
                <Radio value="COD">
                  <IdcardOutlined /> Thanh toán khi nhận hàng (COD)
                </Radio>
                <Radio value="VNPAY">
                  <CreditCardOutlined /> Thanh toán qua VNPAY
                </Radio>
              </Radio.Group>
            </Form.Item>

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