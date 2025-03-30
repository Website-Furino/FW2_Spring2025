import React, { useState, useEffect } from "react";
import axios from "axios";
import { message, Card, Row, Col, Typography, Divider, List } from "antd";
import { useParams } from "react-router-dom"; // Để lấy thông tin từ URL params

const { Title, Text } = Typography;

const OrderDetail = () => {
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams(); 
  useEffect(() => {
    if (id) {
      axios
        .get(`http://localhost:3000/orders/${id}`)
        .then((response) => {
          setOrderDetails(response.data); // Lưu thông tin đơn hàng vào state
          setLoading(false);
        })
        .catch((error) => {
          console.error("Lỗi khi lấy thông tin đơn hàng:", error);
          message.error("Không thể lấy thông tin đơn hàng.");
          setLoading(false);
        });
    } else {
      message.error("Không tìm thấy ID đơn hàng!");
      setLoading(false);
    }
  }, [id]);

  if (loading) {
    return <div>Loading...</div>; // Hiển thị khi đang tải dữ liệu
  }

  if (!orderDetails) {
    return <div>Không có thông tin đơn hàng.</div>; // Hiển thị nếu không có dữ liệu đơn hàng
  }

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", paddingTop: "50px" }}>
      <Title level={3} className="text-center mb-30">
        Chi tiết đơn hàng #{id}
      </Title>

      <Card title="Thông tin đơn hàng" bordered={false}>
        <Row gutter={24}>
          <Col span={12}>
            <Text strong>Họ và tên: </Text>
            <Text>{orderDetails.userInfo.fullName}</Text>
          </Col>
          <Col span={12}>
            <Text strong>Email: </Text>
            <Text>{orderDetails.userInfo.email}</Text>
          </Col>
          <Col span={12}>
            <Text strong>Số điện thoại: </Text>
            <Text>{orderDetails.userInfo.phone}</Text>
          </Col>
          <Col span={12}>
            <Text strong>Địa chỉ: </Text>
            <Text>{orderDetails.userInfo.address}</Text>
          </Col>
          <Col span={12}>
            <Text strong>Phương thức thanh toán: </Text>
            <Text>{orderDetails.paymentMethod}</Text>
          </Col>
          <Col span={12}>
            <Text strong>Trạng thái: </Text>
            <Text>{orderDetails.status}</Text>
          </Col>
          <Col span={12}>
            <Text strong>Ngày đặt hàng: </Text>
            <Text>{new Date(orderDetails.orderDate).toLocaleDateString()}</Text>
          </Col>
        </Row>

        <Divider />

        <Title level={4}>Sản phẩm trong đơn hàng</Title>
        <List
          itemLayout="horizontal"
          dataSource={orderDetails.cartItems}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                title={item.name}
                description={`Số lượng: ${item.quantity} | Giá: ${item.price.toLocaleString()} đ`}
              />
            </List.Item>
          )}
        />

        <Divider />

        <Row gutter={16}>
          <Col span={12}>
            <Text strong>Tổng giá trị: </Text>
          </Col>
          <Col span={12} style={{ textAlign: "right" }}>
            <Text strong style={{ fontSize: "18px" }}>
              {orderDetails.cartItems
                .reduce((acc, item) => acc + item.price * item.quantity, 0)
                .toLocaleString()}
              đ
            </Text>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default OrderDetail;
