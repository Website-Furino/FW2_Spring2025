import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  UserOutlined,
  LogoutOutlined,
  HistoryOutlined,
  AppstoreAddOutlined,
} from "@ant-design/icons";
import { Dropdown, Menu, message } from "antd";

const Header = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}"); // Lấy thông tin người dùng từ localStorage
  const nav = useNavigate();

  // Hàm đăng xuất người dùng
  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    message.success("Đăng xuất thành công");
    nav("/login"); // Điều hướng về trang đăng nhập
  };

  // Kiểm tra nếu người dùng là admin
  const isAdmin = user.role === "admin"; // Kiểm tra role là admin

  // Menu cho người dùng đã đăng nhập
  const userMenu = (
    <Menu>
      <Menu.Item key="0" disabled>
        <span className="text-lg">{user.fullName}</span>
      </Menu.Item>
      <Menu.Item
        key="1"
        icon={<HistoryOutlined />}
        onClick={() => nav("/order-history")}
      >
        Lịch sử mua hàng
      </Menu.Item>
      <Menu.Item
        key="2"
        icon={<UserOutlined />}
        onClick={() => nav("/profile")}
      >
        Thông tin cá nhân
      </Menu.Item>
      {isAdmin && (
        <Menu.Item
          key="4"
          icon={<AppstoreAddOutlined />}
          onClick={() => nav("/admin")}
        >
          Quản lý Admin
        </Menu.Item>
      )}
      <Menu.Item key="3" icon={<LogoutOutlined />} onClick={handleLogout}>
        Đăng xuất
      </Menu.Item>
    </Menu>
  );

  // Menu cho người dùng chưa đăng nhập
  const guestMenu = (
    <Menu>
      <Menu.Item key="1">
        <Link to="/login" className="block px-4 py-1 hover:text-yellow-600">
          Đăng nhập
        </Link>
      </Menu.Item>
      <Menu.Item key="2">
        <Link to="/register" className="block px-4 py-1 hover:text-yellow-600">
          Đăng ký
        </Link>
      </Menu.Item>
    </Menu>
  );

  return (
    <div id="header" className="w-full sticky top-0 z-10 transition-all">
      <header className="max-w-[1400px] mx-auto p-3 transition-all duration-300">
        <div className="mx-auto my-4">
          <div className="grid grid-cols-3 gap-9 items-center">
            {/* Logo */}
            <div>
              <Link to="/">
                <img src="../logo.svg" alt="FurniroShop" className="h-10" />
              </Link>
            </div>

            {/* Navigation Links */}
            <nav>
              <ul className="flex space-x-16 text-xl font-medium">
                <li>
                  <Link to="/" className="hover:text-yellow-600">
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    to="/shop"
                    className="flex items-center hover:text-yellow-600"
                  >
                    Shop
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="hover:text-yellow-600">
                    About
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="hover:text-yellow-600">
                    Contact
                  </Link>
                </li>
              </ul>
            </nav>

            {/* Icons Section */}
            <div className="flex justify-end space-x-11 text-2xl relative">
              {/* User Account */}
              <div className="relative group">
                <Dropdown
                  overlay={user.fullName ? userMenu : guestMenu}
                  trigger={["click"]}
                >
                  <button className="flex items-center space-x-2 text-gray-600 hover:text-yellow-600">
                    <img
                      src="./img/account.svg"
                      alt="User Icon"
                      className="h-7 w-7"
                    />
                  </button>
                </Dropdown>
              </div>

              {/* Other Icons */}
              <Link
                to="/search"
                className="text-gray-600 hover:text-yellow-600"
              >
                <img
                  src="./img/search.svg"
                  alt="Search Icon"
                  className="h-7 w-7"
                />
              </Link>
              <Link
                to="/wishlist"
                className="text-gray-600 hover:text-yellow-600"
              >
                <img
                  src="./img/heart.svg"
                  alt="Favorites Icon"
                  className="h-7 w-7"
                />
              </Link>
              <Link
                to="/shop/cart"
                className="text-gray-600 hover:text-yellow-600"
              >
                <img
                  src="./img/shopping.svg"
                  alt="Shopping Cart Icon"
                  className="h-7 w-7"
                />
              </Link>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
};

export default Header;
