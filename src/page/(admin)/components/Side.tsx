import React from "react";
import { Menu, Button } from "antd";
import {
  DashboardOutlined,
  AppstoreAddOutlined,
  ShoppingCartOutlined,
  FolderOutlined,
  UserOutlined,
  PoweroffOutlined,
} from "@ant-design/icons"; // Add icons for Dashboard and Product Management
import { Link, useNavigate } from "react-router-dom"; // Use Link for navigation

const SideMenu = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Xóa thông tin người dùng trong localStorage
    localStorage.removeItem("user");

    // Chuyển hướng về trang đăng nhập
    navigate("/admin/login");
  };

  return (
    <Menu
      mode="inline"
      defaultSelectedKeys={["dashboard"]} 
      defaultOpenKeys={["product-management"]} 
      style={{ height: "100%", borderRight: 0 }}
    >
      {/* Dashboard */}
      <Menu.Item key="dashboard" icon={<DashboardOutlined />}>
        <Link to="/admin/dashboard">Dashboard</Link>
      </Menu.Item>

      {/* Product Management */}
      <Menu.SubMenu key="product-management" icon={<AppstoreAddOutlined />} title="Product Management">
        <Menu.Item key="products">
          <Link to="/admin/products">List Products</Link>
        </Menu.Item>
        <Menu.Item key="product_add">
          <Link to="/admin/products/add">Add Product</Link>
        </Menu.Item>
      </Menu.SubMenu>

      {/* Categories Management */}
      <Menu.SubMenu key="categories" icon={<FolderOutlined />} title="Categories Management">
        <Menu.Item key="categories">
          <Link to="/admin/categories">List Categories</Link>
        </Menu.Item>
        <Menu.Item key="category_add">
          <Link to="/admin/categories/add">Add Category</Link>
        </Menu.Item>
      </Menu.SubMenu>

      {/* Orders */}
      <Menu.Item key="orders" icon={<ShoppingCartOutlined />}>
        <Link to="/admin/orders">Orders</Link>
      </Menu.Item>

      {/* Users */}
      <Menu.Item key="users" icon={<UserOutlined />}>
        <Link to="/admin/users">Users</Link>
      </Menu.Item>

      {/* Logout */}
      <Menu.Item key="logout" icon={<PoweroffOutlined />} onClick={handleLogout}>
        <Button type="text" block>
          Logout
        </Button>
      </Menu.Item>
    </Menu>
  );
};

export default SideMenu;
