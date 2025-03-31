import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  message,
  Card,
  Row,
  Col,
  Typography,
  Divider,
  List,
  Select,
} from "antd";
import { useParams } from "react-router-dom";

const { Title, Text } = Typography;
const { Option } = Select;

const OrderDetail = () => {
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");
  const { id } = useParams();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    if (id) {
      axios
        .get(`http://localhost:3000/orders/${id}`)
        .then((response) => {
          setOrderDetails(response.data); // Lưu thông tin đơn hàng vào state
          setStatus(response.data.status); // Lưu trạng thái hiện tại
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

  const handleStatusChange = (newStatus: string) => {
    // Giữ nguyên các thông tin đơn hàng khác và chỉ thay đổi trạng thái
    const updatedOrder = {
      ...orderDetails, // Giữ nguyên tất cả các thông tin hiện tại của đơn hàng
      status: newStatus, // Cập nhật trạng thái mới
    };

    axios
      .put(`http://localhost:3000/orders/${id}`, updatedOrder) // Gửi toàn bộ đơn hàng với trạng thái mới
      .then((response) => {
        setStatus(newStatus); // Cập nhật trạng thái mới trong state
        setOrderDetails(response.data); // Cập nhật lại thông tin đơn hàng sau khi cập nhật
        message.success("Cập nhật trạng thái đơn hàng thành công!");
      })
      .catch((error) => {
        console.error("Lỗi khi cập nhật trạng thái:", error);
        message.error("Không thể cập nhật trạng thái đơn hàng.");
      });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!orderDetails) {
    return <div>Không có thông tin đơn hàng.</div>;
  }

  // Cấu hình các trạng thái có thể thay đổi từ trạng thái hiện tại
  const getAvailableStatusOptions = (currentStatus: string) => {
    switch (currentStatus) {
      case "Chờ xác nhận":
        return ["Đã xác nhận", "Đã hủy"];
      case "Đã xác nhận":
        return ["Đang giao hàng"];
      case "Đang giao hàng":
        return ["Đã giao thành công"];
      case "Đã giao thành công":
        return []; // Không thể thay đổi trạng thái nữa
      case "Đã hủy":
        return []; // Không thể thay đổi trạng thái nữa
      default:
        return []; // Trạng thái mặc định hoặc không hợp lệ
    }
  };

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
                description={`Số lượng: ${
                  item.quantity
                } | Giá: ${item.price.toLocaleString()} đ`}
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

        <Divider />

        <Row gutter={16}>
          <Col span={12}>
            <Text strong>Chọn trạng thái: </Text>
          </Col>
          <Col span={12} style={{ textAlign: "right" }}>
            {/* Chỉ hiển thị dropdown nếu đơn hàng chưa giao hoặc chưa giao thành công */}
            <Select
              value={status}
              onChange={handleStatusChange}
              style={{ width: 200 }}
            >
              {getAvailableStatusOptions(orderDetails.status).map(
                (statusOption) => (
                  <Option key={statusOption} value={statusOption}>
                    {statusOption}
                  </Option>
                )
              )}
            </Select>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default OrderDetail;
