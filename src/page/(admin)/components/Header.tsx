// HeaderMenu.js

import { Menu } from "antd";
import Link from "antd/es/typography/Link";

const items1 = [
  { key: "1", label: "Dashboard", path: "/admin" },
  { key: "2", label: "Product Management", path: "/admin/products" },
  { key: "3", label: "Orders", path: "/admin/orders" },
].map((item) => ({
  ...item,
}));

const HeaderMenu = () => {
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
    </Menu>
  );
};

export default HeaderMenu;
