import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  Card,
  Typography,
  Row,
  Col,
  Divider,
  Tag,
  Spin,
  Descriptions,
  message,
  Select,
  Modal,
  Input,
} from "antd";

const { Title, Text } = Typography;
const { Option } = Select;

const OrderDetail = () => {
  const { id } = useParams();
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const [isCancelModalVisible, setIsCancelModalVisible] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

  useEffect(() => {
    fetchOrderDetails();
  }, [id]);

  const fetchOrderDetails = () => {
    setLoading(true);
    axios
      .get(`http://localhost:3000/orders/${id}`)
      .then((response) => {
        setOrderDetails(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Lỗi khi lấy chi tiết đơn hàng:", error);
        message.error("Không thể lấy chi tiết đơn hàng!");
        setLoading(false);
      });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Chờ xác nhận":
        return "orange";
      case "Đang giao hàng":
        return "blue";
      case "Hoàn thành":
        return "green";
      case "Đã hủy":
        return "red";
      default:
        return "default";
    }
  };

  const getNextStatusOptions = () => {
    if (!orderDetails || !orderDetails.status) return [];
    switch (orderDetails.status) {
      case "Chờ xác nhận":
        return ["Đã xác nhận", "Đã hủy"];
      case "Đã xác nhận":
        return ["Đang giao hàng", "Đã hủy"];
      case "Đang giao hàng":
        return ["Đã giao thành công"];
      default:
        return [];
    }
  };

  const handleStatusSelect = (value: string) => {
    if (value === "Đã hủy") {
      setSelectedStatus(value);
      setIsCancelModalVisible(true);
    } else {
      handleStatusChange(value);
    }
  };

  const handleConfirmCancel = async () => {
    if (!cancelReason.trim()) {
      message.warning("Vui lòng nhập lý do hủy!");
      return;
    }

    await handleStatusChange("Đã hủy");
    setIsCancelModalVisible(false);
    setCancelReason("");
    setSelectedStatus(null);
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!orderDetails) return;
    setUpdating(true);
    const currentStatus = orderDetails.status;

    try {
      for (const item of orderDetails.cartItems) {
        const productRes = await axios.get(
          `http://localhost:3000/products/${item.productId}`
        );
        const product = productRes.data;
        let updatedStock = product.stock;

        if (newStatus === "Đã xác nhận" && currentStatus === "Chờ xác nhận") {
          updatedStock -= item.quantity;
          if (updatedStock < 0) {
            message.error(`Không đủ hàng cho sản phẩm: ${item.name}`);
            setUpdating(false);
            return;
          }
        }

        if (newStatus === "Đã hủy" && currentStatus === "Đã xác nhận") {
          updatedStock += item.quantity;
        }

        await axios.patch(`http://localhost:3000/products/${item.productId}`, {
          stock: updatedStock,
        });
      }

      await axios.patch(`http://localhost:3000/orders/${orderDetails.id}`, {
        status: newStatus,
        cancelReason: newStatus === "Đã hủy" ? cancelReason : undefined,
        canceledBy:
          newStatus === "Đã hủy" ? "Admin" : undefined,
        cancelDate: newStatus === "Đã hủy" ? new Date().toISOString() : undefined,
      });

      message.success("Cập nhật trạng thái thành công!");
      fetchOrderDetails();
    } catch (error) {
      console.error("Lỗi khi cập nhật đơn hàng:", error);
      message.error("Không thể cập nhật đơn hàng!");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: 50 }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!orderDetails) return null;

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", paddingTop: "40px" }}>
      <Title level={3}>Chi tiết đơn hàng</Title>

      <Card style={{ marginBottom: 24 }}>
        <Descriptions title="Thông tin khách hàng" bordered column={1}>
          <Descriptions.Item label="Họ và tên">
            {orderDetails.userInfo.fullName}
          </Descriptions.Item>
          <Descriptions.Item label="Số điện thoại">
            {orderDetails.userInfo.phone}
          </Descriptions.Item>
          <Descriptions.Item label="Email">
            {orderDetails.userInfo.email}
          </Descriptions.Item>
          <Descriptions.Item label="Địa chỉ">
            {orderDetails.userInfo.address}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Card title="Sản phẩm đã đặt" style={{ marginBottom: 24 }}>
        {orderDetails.cartItems.map((item: any) => (
          <Row key={item.id} gutter={16} style={{ marginBottom: 10 }}>
            <Col span={16}>
              <Text>{item.name}</Text>
            </Col>
            <Col span={4}>
              <Text>Số lượng: {item.quantity}</Text>
            </Col>
            <Col span={4} style={{ textAlign: "right" }}>
              <Text strong>
                {(item.price * item.quantity).toLocaleString()}đ
              </Text>
            </Col>
          </Row>
        ))}

        <Divider />
        <Row>
          <Col span={12}>
            <Text strong>Tổng cộng:</Text>
          </Col>
          <Col span={12} style={{ textAlign: "right" }}>
            <Text strong style={{ fontSize: 18 }}>
              {orderDetails.totalPrice.toLocaleString()}đ
            </Text>
          </Col>
        </Row>
      </Card>

      <Card title="Thông tin đơn hàng">
        <Row gutter={16}>
          <Col span={12}>
            <Text>Phương thức thanh toán:</Text>
            <br />
            <Text strong>{orderDetails.paymentMethod}</Text>
          </Col>
          <Col span={12}>
            <Text>Ngày đặt hàng:</Text>
            <br />
            <Text>{new Date(orderDetails.orderDate).toLocaleString()}</Text>
          </Col>
        </Row>

        <Divider />

        <Row gutter={16} align="middle">
          <Col span={12}>
            <Text>Trạng thái:</Text>
            <br />
            <Tag color={getStatusColor(orderDetails.status)}>
              {orderDetails.status}
            </Tag>
          </Col>
          <Col span={12}>
            {getNextStatusOptions().length > 0 && (
              <Select
                placeholder="Chọn trạng thái"
                style={{ width: "100%" }}
                onChange={handleStatusSelect}
                disabled={updating}
              >
                {getNextStatusOptions().map((status) => (
                  <Option key={status} value={status}>
                    {status}
                  </Option>
                ))}
              </Select>
            )}
          </Col>
        </Row>

        {orderDetails.status === "Đã hủy" && (
          <>
            <Divider />
            <Descriptions title="Thông tin hủy đơn" bordered column={1}>
              <Descriptions.Item label="Lý do hủy">
                {orderDetails.cancelReason || "Không có"}
              </Descriptions.Item>
              <Descriptions.Item label="Người hủy">
                {orderDetails.canceledBy || "Không xác định"}
              </Descriptions.Item>
              <Descriptions.Item label="Ngày hủy">
                {orderDetails.cancelDate
                  ? new Date(orderDetails.cancelDate).toLocaleString()
                  : "Không xác định"}
              </Descriptions.Item>
            </Descriptions>
          </>
        )}
      </Card>

      {/* Modal nhập lý do hủy */}
      <Modal
        title="Nhập lý do hủy đơn"
        open={isCancelModalVisible}
        onOk={handleConfirmCancel}
        onCancel={() => {
          setIsCancelModalVisible(false);
          setCancelReason("");
          setSelectedStatus(null);
        }}
        okText="Xác nhận hủy"
        cancelText="Đóng"
      >
        <Input.TextArea
          rows={4}
          value={cancelReason}
          onChange={(e) => setCancelReason(e.target.value)}
          placeholder="Nhập lý do bạn muốn hủy đơn hàng..."
        />
      </Modal>
    </div>
  );
};

export default OrderDetail;
