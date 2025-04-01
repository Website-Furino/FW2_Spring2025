import React, { useEffect, useState } from "react";
import axios from "axios";
import { List, Card, Tag, Button, message, Row, Col, Select, Spin } from "antd";
import {
  MoneyCollectOutlined,
  ShoppingCartOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import { Option } from "antd/es/mentions";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFetched, setIsFetched] = useState(false); // Trạng thái kiểm tra dữ liệu đã được fetch chưa
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!user?.id || !token) {
      message.error("Vui lòng đăng nhập để xem lịch sử đơn hàng.");
      return;
    }

    if (isFetched) {
      return; // Tránh gọi API nếu dữ liệu đã được lấy
    }

    setLoading(true); // Khi bắt đầu gọi API, set loading thành true

    axios
      .get(`http://localhost:3000/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        // Lọc các đơn hàng thuộc về người dùng
        const userOrders = response.data.filter((order) =>
          order.cartItems.some((item) => item.userId === user.id)
        );

        const ordersSorted = userOrders.reverse();
        setOrders(ordersSorted);
        setIsFetched(true);
      })
      .catch((error) => {
        console.error("Lỗi khi lấy đơn hàng:", error);
        message.error("Không thể lấy đơn hàng. Vui lòng thử lại.");
      })
      .finally(() => {
        setLoading(false); // Sau khi API gọi xong, set loading thành false
      });
  }, [user, token, isFetched]); // Chỉ gọi lại effect khi `user` hoặc `token` thay đổi

  // Hàm cập nhật trạng thái đơn hàng
  const handleStatusChange = (orderId, newStatus) => {
    const updatedOrders = orders.map((order) => {
      if (order.id === orderId) {
        return { ...order, status: newStatus };
      }
      return order;
    });

    // Cập nhật trạng thái đơn hàng trên server
    axios
      .put(
        `http://localhost:3000/orders/${orderId}`,
        updatedOrders.find((order) => order.id === orderId),
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(() => {
        setOrders(updatedOrders);
        message.success("Cập nhật trạng thái đơn hàng thành công!");
      })
      .catch((error) => {
        console.error("Lỗi khi cập nhật trạng thái:", error);
        message.error("Không thể cập nhật trạng thái đơn hàng.");
      });
  };

  // Nếu đang tải, hiển thị loading spinner
  if (loading) {
    return (
      <div className="text-center">
        <Spin size="large" />
      </div>
    );
  }

  // Nếu không có đơn hàng, hiển thị thông báo
  if (orders.length === 0) {
    return <p className="text-center">Bạn chưa có đơn hàng nào.</p>;
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-3xl font-semibold text-center mb-8">
        Lịch sử đơn hàng
      </h1>
      <List
        itemLayout="vertical"
        size="large"
        dataSource={orders}
        renderItem={(order) => (
          <List.Item key={order.id}>
            <Card
              className="mb-6 shadow-lg rounded-lg border border-gray-200 hover:shadow-2xl transition duration-300"
              title={`Đơn hàng #${order.id}`}
              extra={
                <span className="text-sm text-gray-500">
                  Ngày đặt: {order.orderDate}
                </span>
              }
              actions={[
                <MoneyCollectOutlined
                  key="money"
                  style={{ color: "#4CAF50", fontSize: "20px" }}
                />,
                <ShoppingCartOutlined
                  key="cart"
                  style={{ color: "#FF9800", fontSize: "20px" }}
                />,
                <CalendarOutlined
                  key="calendar"
                  style={{ color: "#2196F3", fontSize: "20px" }}
                />,
              ]}
            >
              <div className="text-gray-700 mb-4">
                <p>
                  <strong>Phương thức thanh toán:</strong> {order.paymentMethod}
                </p>
                <p>
                  <strong>Tổng tiền:</strong>{" "}
                  {order.totalPrice ? order.totalPrice.toLocaleString() : 0} đ
                </p>
                <p>
                  <strong>Tình trạng đơn hàng:</strong>
                  <Tag
                    color={
                      order.status === "Đã giao thành công"
                        ? "green"
                        : order.status === "Đã hủy"
                        ? "red"
                        : order.status === "Chờ xác nhận"
                        ? "orange"
                        : "blue"
                    }
                    className="font-medium"
                  >
                    {order.status}
                  </Tag>
                </p>
              </div>

              <h3 className="mt-4 text-xl font-semibold text-gray-800">
                Sản phẩm:
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {order.cartItems?.map(
                  (product, index) =>
                    // Lọc các sản phẩm trong đơn hàng theo userId
                    product.userId === user.id && (
                      <div
                        key={index}
                        className="flex items-center space-x-4 mb-4"
                      >
                        <div className="w-16 h-16 flex-shrink-0">
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        </div>
                        <div className="flex-1">
                          <p className="text-lg font-semibold text-gray-800">
                            <strong>{product.name}</strong>
                          </p>
                          <p className="text-gray-600">
                            {product.quantity} x{" "}
                            {product.price ? product.price.toLocaleString() : 0}{" "}
                            đ
                          </p>
                        </div>
                      </div>
                    )
                )}
              </div>

              {/* Phần chọn trạng thái */}
              <Row gutter={16}>
                <Col span={12} style={{ textAlign: "right" }}>
                  <Select
                    value={order.status}
                    onChange={(newStatus) => {
                      // Chỉ cho phép thay đổi trạng thái nếu là "Chờ xác nhận" hoặc "Hủy"
                      if (
                        order.status === "Chờ xác nhận" ||
                        newStatus === "Đã hủy"
                      ) {
                        handleStatusChange(order.id, newStatus);
                      } else {
                        message.warning("Trạng thái này không thể thay đổi.");
                      }
                    }}
                    style={{ width: 200 }}
                    disabled={order.status !== "Chờ xác nhận"} // Chỉ cho phép thay đổi trạng thái khi trạng thái là "Chờ xác nhận"
                  >
                    {order.status === "Chờ xác nhận" && (
                      <Option value="Đã hủy">Hủy</Option>
                    )}
                  </Select>
                </Col>
              </Row>
            </Card>
          </List.Item>
        )}
      />
    </div>
  );
};

export default OrderHistory;
