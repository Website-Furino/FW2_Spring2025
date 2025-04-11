import { useState, useEffect } from "react";
import axios from "axios";
import { Table, Spin, Alert } from "antd";
interface User {
  id: number;
  fullName: string;
  email: string;
  role: "admin" | "user";
}
const UserList = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axios
      .get<User[]>("http://localhost:3000/users")
      .then((response) => {
        const filteredUsers = response.data.filter(
          (user) => user.role === "user"
        );
        setUsers(filteredUsers);
        setLoading(false);
      })
      .catch(() => {
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
