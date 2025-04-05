import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Spin, Alert } from "antd";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:3000/users")
      .then((response) => {
        // Lọc chỉ những người dùng có role là 'user'
        const filteredUsers = response.data.filter(
          (user) => user.role === "user"
        );
        setUsers(filteredUsers);
        setLoading(false);
      })
      .catch((error) => {
        setError("Không thể tải dữ liệu người dùng");
        setLoading(false);
      });
  }, []);

  if (loading) return <Spin tip="Đang tải..." size="large" />;
  if (error) return <Alert message={error} type="error" />;

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
        pagination={false}
      />
    </div>
  );
};

export default UserList;
