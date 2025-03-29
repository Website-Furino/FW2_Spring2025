import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Spin, Alert } from "antd";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Lấy dữ liệu người dùng từ API sử dụng Axios
  useEffect(() => {
    axios
      .get("http://localhost:3000/users") // URL của json-server API
      .then((response) => {
        setUsers(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setError("Không thể tải dữ liệu người dùng");
        setLoading(false);
      });
  }, []);

  if (loading) return <Spin tip="Đang tải..." size="large" />; // Hiển thị loading spinner nếu đang tải
  if (error) return <Alert message={error} type="error" />; // Hiển thị thông báo lỗi nếu có

  // Định nghĩa các cột của bảng
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Tên",
      dataIndex: "fullName",
      key: "fullName",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Chức Vụ",
      dataIndex: "role",
      key: "role",
    },
  ];

  return (
    <div style={{ padding: "24px" }}>
      <h2>Danh Sách Người Dùng</h2>
      <Table
        dataSource={users}
        columns={columns}
        rowKey="id"
        pagination={false} // Nếu muốn phân trang có thể thêm vào
      />
    </div>
  );
};

export default UserList;
