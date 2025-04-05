import React from "react";
import { Button, Space, Table, Select } from "antd";
import { Link } from "react-router-dom";
import { useList } from "../../../hooks";

const { Option } = Select;

const OrderList = () => {
  const { data, isLoading } = useList({ resource: "orders" });
  const [filterStatus, setFilterStatus] = React.useState("");

  // Sắp xếp đơn hàng theo orderDate
  const sortedData = data
    ? [...data].sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate))
    : [];

  // Lọc dữ liệu theo trạng thái đã chọn
  const filteredData = filterStatus
    ? sortedData.filter((order) => order.status === filterStatus)
    : sortedData;

  const columns = [
    {
      title: "Mã đơn hàng",
      dataIndex: "id",
      key: "id",
      render: (id) => <Link to={`${id}`}># {id}</Link>,
    },
    {
      title: "Người đặt hàng",
      dataIndex: ["userInfo", "fullName"],
      key: "userInfo.fullName",
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
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Actions",
      render: (order) => (
        <Space>
          <Button type="primary">
            <Link to={`${order.id}`}>Chi tiết</Link>
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <h1>Danh sách đơn hàng</h1>

      <div style={{ marginBottom: 16 }}>
        <Select
          placeholder="Chọn trạng thái"
          value={filterStatus}
          onChange={setFilterStatus}
          style={{ width: 200 }}
        >
          <Option value="">Tất cả</Option>
          <Option value="Đã giao thành công">Đã giao thành công</Option>
          <Option value="Đã hủy">Đã hủy</Option>
          <Option value="Chờ xác nhận">Chờ xác nhận</Option>
        </Select>
      </div>

      <Table
        dataSource={filteredData}
        columns={columns}
        loading={isLoading}
        rowKey="id"
      />
    </div>
  );
};

export default OrderList;
