import React, { useEffect, useState } from "react";
import axios from "axios";
import { List, Card, Skeleton } from "antd";
import {
  MoneyCollectOutlined,
  ShoppingCartOutlined,
  CalendarOutlined,
} from "@ant-design/icons";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const userEmail = localStorage.getItem("userEmail"); // Lấy email người dùng từ localStorage

  console.log(orders);
  useEffect(() => {
    if (userEmail) {
      axios
        .get(`http://localhost:3000/orders?userEmail=${userEmail}`)
        .then((response) => {
          setOrders(response.data);
          console.log(response.data);

          setLoading(false); // Đặt loading thành false sau khi nhận được dữ liệu
        })
        .catch((error) => {
          console.error("Lỗi khi lấy đơn hàng của người dùng:", error);
          setLoading(false); // Đặt loading thành false khi có lỗi
        });
    }
  }, [userEmail]);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-semibold text-center mb-6">
        Lịch sử đơn hàng
      </h1>

      <List
        loading={loading}
        itemLayout="vertical"
        size="large"
        dataSource={orders}
        renderItem={(order) => (
          <List.Item key={order.id}>
            <Card
              className="mb-4"
              title={`Đơn hàng #${order.id}`}
              extra={
                <span className="text-sm text-gray-500">
                  Ngày đặt: {order.orderDate}
                </span>
              }
              actions={[
                <MoneyCollectOutlined key="money" />,
                <ShoppingCartOutlined key="cart" />,
                <CalendarOutlined key="calendar" />,
              ]}
            >
              <div>
                <p>
                  <strong>Phương thức thanh toán:</strong> {order.paymentMethod}
                </p>
                <p>
                  <strong>Tổng tiền:</strong> {order.totalPrice} đ
                </p>
              </div>
              <h3 className="mt-4 text-lg font-medium">Sản phẩm:</h3>
              <ul className="list-disc pl-6"></ul>
            </Card>
          </List.Item>
        )}
      />
    </div>
  );
};

export default OrderHistory;
