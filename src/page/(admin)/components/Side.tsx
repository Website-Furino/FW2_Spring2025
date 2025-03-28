import React from "react";
import { Menu } from "antd";
import {
  DashboardOutlined,
  AppstoreAddOutlined,
  ShoppingCartOutlined,
  FolderOutlined,
  UserOutlined,
} from "@ant-design/icons"; // Add icons for Dashboard and Product Management
import { Link } from "react-router-dom"; // Use Link for navigation

const items2 = [
  {
    key: "dashboard",
    icon: <DashboardOutlined />,
    label: <Link to="/admin">Dashboard</Link>,
  },

  {
    key: "product-management",
    icon: <AppstoreAddOutlined />,
    label: "Product Management",
    children: [
      {
        key: "products",
        label: <Link to="/admin/products">List Products</Link>,
      },
      {
        key: "product_add",
        label: <Link to="/admin/products/add">Add Product</Link>,
      },
    ],
  },
  {
    key: "catergories",
    icon: <FolderOutlined />,
    label: "Categories Management",
    children: [
      {
        key: "categories",
        label: <Link to="/admin/categories">List Categories</Link>,
      },
      {
        key: "category_add",
        label: <Link to="/admin/categories/add">Add Category</Link>,
      },
    ],
  },
  {
    key: "orders",
    icon: <ShoppingCartOutlined />,
    label: <Link to="/admin/orders">Orders</Link>,
  },
  {
    key: "users",
    icon: <UserOutlined />,
    label: <Link to="/admin/users">Users</Link>,
  },
];

const SideMenu = () => {
  return (
    <Menu
      mode="inline"
      defaultSelectedKeys={["dashboard"]} // Set default selection to Dashboard
      defaultOpenKeys={["product-management"]} // Set default open to Product Management
      style={{ height: "100%", borderRight: 0 }}
      items={items2}
    />
  );
};

export default SideMenu;
