import { useEffect, useState } from "react";
import axios from "axios";
import {
  List,
  Card,
  Tag,
  Button,
  message,
  Row,
  Spin,
  Modal,
  Input,
} from "antd";

interface CartItem {
  id: number|string;
  userId: number|string;
  productId: number;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

interface Order {
  id: number;
  orderDate: string;
  status: string;
  paymentMethod: string;
  totalPrice: number;
  cancelReason?: string;
  canceledBy?: string;
  cancelDate?: string;
  cartItems: CartItem[];
}

const OrderHistory = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [cancelModalVisible, setCancelModalVisible] = useState<boolean>(false);
  const [cancelReason, setCancelReason] = useState<string>("");
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!user?.id || !token) {
      message.error("Vui lòng đăng nhập để xem lịch sử đơn hàng.");
      return;
    }

    const fetchOrders = () => {
      axios
        .get(`https://json-server-online-8kf1.onrender.com/orders`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          const userOrders = response.data.filter((order: Order) =>
            order.cartItems.some((item) => item.userId === user.id)
          );
          const ordersSorted = userOrders.reverse();
          setOrders(ordersSorted);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Lỗi khi lấy đơn hàng:", error);
          message.error("Không thể lấy đơn hàng. Vui lòng thử lại.");
          setLoading(false);
        });
    };

    fetchOrders();
    const interval = setInterval(fetchOrders, 5000);
    return () => clearInterval(interval);
  }, [user?.id, token]);

  const showCancelModal = (orderId: number) => {
    setSelectedOrderId(orderId);
    setCancelReason("");
    setCancelModalVisible(true);
  };

  const handleCancelOrder = async () => {
    if (!cancelReason.trim()) {
      message.warning("Vui lòng nhập lý do hủy đơn.");
      return;
    }

    const order = orders.find((o) => o.id === selectedOrderId);
    if (!order) return;

    try {
      // Cập nhật tồn kho
      for (const item of order.cartItems) {
        const productRes = await axios.get(`https://json-server-online-8kf1.onrender.com/products/${item.productId}`);
        const productData = productRes.data;
        const updatedStock = productData.stock + item.quantity;

        await axios.patch(`https://json-server-online-8kf1.onrender.com/products/${item.productId}`, {
          stock: updatedStock,
        });
      }

      // Cập nhật đơn hàng
      const updatedOrder: Order = {
        ...order,
        status: "Đã hủy",
        cancelReason,
        canceledBy: user.fullName,
        cancelDate: new Date().toISOString(),
      };

      await axios.put(
        `https://json-server-online-8kf1.onrender.com/orders/${selectedOrderId}`,
        updatedOrder,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const updatedOrders = orders.map((o) =>
        o.id === selectedOrderId ? updatedOrder : o
      );
      setOrders(updatedOrders);
      setCancelModalVisible(false);
      message.success("Đã hủy đơn hàng thành công!");
    } catch (error) {
      console.error("Lỗi khi hủy đơn hàng:", error);
      message.error("Không thể hủy đơn hàng.");
    }
  };

  if (loading) {
    return (
      <div className="text-center">
        <Spin size="large" />
      </div>
    );
  }

  if (orders.length === 0) {
    return <p className="text-center">Bạn chưa có đơn hàng nào.</p>;
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-3xl font-semibold text-center mb-8">Lịch sử đơn hàng</h1>

      <List
        itemLayout="vertical"
        size="large"
        dataSource={orders}
        renderItem={(order: Order) => (
          <List.Item key={order.id}>
            <Card
              title={`Đơn hàng #${order.id}`}
              className="mb-6"
              extra={<span>Ngày đặt: {new Date(order.orderDate).toLocaleString()}</span>}
            >
              <div className="text-gray-700 mb-4">
                <p><strong>Phương thức thanh toán:</strong> {order.paymentMethod}</p>
                <p><strong>Tổng tiền:</strong> {order.totalPrice?.toLocaleString()} đ</p>
                <p>
                  <strong>Trạng thái:</strong>{" "}
                  <Tag color={
                    order.status === "Đã giao thành công" ? "green" :
                    order.status === "Đã hủy" ? "red" :
                    order.status === "Chờ xác nhận" ? "orange" : "blue"
                  }>
                    {order.status}
                  </Tag>
                </p>

                {order.status === "Đã hủy" && (
                  <>
                    <p><strong>Lý do hủy:</strong> {order.cancelReason}</p>
                    <p><strong>Người hủy:</strong> {order.canceledBy}</p>
                    <p><strong>Ngày hủy:</strong> {new Date(order.cancelDate!).toLocaleString()}</p>
                  </>
                )}
              </div>

              <h3 className="text-lg font-semibold">Sản phẩm:</h3>
              <div className="grid grid-cols-2 gap-4 mt-2">
                {order.cartItems?.map(
                  (product) =>
                    product.userId === user.id && (
                      <div key={product.id} className="flex space-x-4">
                        <img src={product.imageUrl} alt={product.name} className="w-16 h-16 object-cover rounded" />
                        <div>
                          <p className="font-semibold">{product.name}</p>
                          <p>{product.quantity} x {product.price?.toLocaleString()} đ</p>
                        </div>
                      </div>
                    )
                )}
              </div>

              {["Chờ xác nhận", "Đã xác nhận"].includes(order.status) && (
                <Row justify="end" className="mt-4">
                  <Button danger onClick={() => showCancelModal(order.id)}>
                    Hủy đơn hàng
                  </Button>
                </Row>
              )}
            </Card>
          </List.Item>
        )}
      />

      <Modal
        title="Xác nhận hủy đơn"
        open={cancelModalVisible}
        onCancel={() => setCancelModalVisible(false)}
        onOk={handleCancelOrder}
        okText="Xác nhận hủy"
        cancelText="Hủy"
      >
        <p>Vui lòng nhập lý do hủy đơn hàng:</p>
        <Input.TextArea
          rows={4}
          value={cancelReason}
          onChange={(e) => setCancelReason(e.target.value)}
          placeholder="Nhập lý do..."
        />
      </Modal>
    </div>
  );
};

export default OrderHistory;