import { Menu } from "antd";
import Link from "antd/es/typography/Link";
import { useEffect, useState } from "react";

const items1 = [
  { key: "1", label: "Dashboard", path: "/admin" },
  { key: "2", label: "Product Management", path: "/admin/products" },
  { key: "3", label: "Orders", path: "/admin/orders" },
].map((item) => ({
  ...item,
}));

const HeaderMenu = () => {
  const [adminName, setAdminName] = useState("");

  useEffect(() => {
    // Lấy thông tin người dùng từ localStorage
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    
    // Kiểm tra và lưu tên admin vào state
    if (user?.role === "admin") {
      setAdminName(user?.fullName || "Admin");
    }
  }, []);

  return (
    <Menu
      theme="dark"
      mode="horizontal"
      defaultSelectedKeys={["1"]}
      style={{ flex: 1, minWidth: 0 }}
    >
      {items1.map((item) => (
        <Menu.Item key={item.key}>
          <Link>{item.label}</Link>
        </Menu.Item>
      ))}

      {adminName && (
        <Menu.Item key="adminName" style={{ float: "right" }}>
          <span>Welcome, {adminName}</span>
        </Menu.Item>
      )}
    </Menu>
  );
};

export default HeaderMenu;
