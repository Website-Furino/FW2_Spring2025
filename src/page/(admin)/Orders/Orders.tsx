import { Button, Space, Table, Popconfirm } from "antd";
import { Link } from "react-router-dom";
import { useDelete, useList } from "../../../hooks"; // Hook của bạn

const OrderList = () => {
  const { data, isLoading } = useList({ resource: "orders" }); // Lấy danh sách đơn hàng
  const { mutate } = useDelete({ resource: "orders" }); // Xóa đơn hàng

  const columns = [
    {
      title: "#",
      dataIndex: "id",
      key: "id",
      render: (_, __, index) => index + 1, // Số thứ tự
    },
    {
      title: "Mã đơn hàng",
      dataIndex: "id",
      key: "id",
      render: (id) => <Link to={`/order/${id}`}># {id}</Link>, // Liên kết đến chi tiết đơn hàng
    },
    {
      title: "Ngày đặt",
      dataIndex: "orderDate",
      key: "orderDate",
    },
    {
      title: "Phương thức thanh toán",
      dataIndex: "paymentMethod",
      key: "paymentMethod",
    },
    {
      title: "Tổng tiền",
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (totalPrice) => totalPrice + " đ", // Định dạng tiền tệ
    },
    {
      title: "Actions",
      render: (order) => (
        <Space>
          <Button type="primary">
            <Link to={`${order.id}`}>Chi tiết</Link>
          </Button>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa đơn hàng này?"
            onConfirm={() => mutate(order.id)}
            okText="Có"
            cancelText="Không"
          >
            <Button danger>Xóa</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <h1>Danh sách đơn hàng</h1>
      <Table
        dataSource={data}
        columns={columns}
        loading={isLoading}
        rowKey="id" // Sử dụng id làm khóa cho mỗi dòng
      />
    </div>
  );
};

export default OrderList;
