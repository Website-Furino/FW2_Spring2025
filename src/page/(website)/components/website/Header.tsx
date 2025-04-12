import { Link, useNavigate } from "react-router-dom";
import {
  UserOutlined,
  LogoutOutlined,
  HistoryOutlined,
  AppstoreAddOutlined,
  MenuOutlined,
} from "@ant-design/icons";
import { Dropdown, Menu, message } from "antd";
import { useState } from "react";

const Header = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const nav = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    message.success("Đăng xuất thành công");
    nav("/login");
  };

  const isAdmin = user.role === "admin";

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
    <div id="header" className="w-full sticky top-0 z-10 transition-all bg-white">
      <header className="max-w-[1400px] mx-auto p-2 sm:p-3 transition-all duration-300">
        <div className="mx-auto my-2 sm:my-4">
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-4 md:gap-9 items-center">
            {/* Logo */}
            <div>
              <Link to="/">
                <img src="../logo.svg" alt="FurniroShop" className="h-6 sm:h-8 md:h-10" />
              </Link>
            </div>

            {/* Navigation Links - Desktop */}
            <nav className="hidden md:block">
              <ul className="flex space-x-4 sm:space-x-8 lg:space-x-16 text-sm sm:text-base lg:text-xl font-medium">
                <li>
                  <Link to="/" className="hover:text-yellow-600">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/shop" className="flex items-center hover:text-yellow-600">
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

            {/* Mobile Menu Button */}
            <button
              className="md:hidden justify-self-end mr-2 sm:mr-4"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <MenuOutlined className="text-xl sm:text-2xl" />
            </button>

            {/* Mobile Navigation Menu */}
            {isMenuOpen && (
              <div className="fixed inset-0 bg-white z-50 md:hidden">
                <div className="p-3 sm:p-4">
                  <button
                    className="float-right text-lg sm:text-xl"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    ✕
                  </button>
                  <ul className="flex flex-col space-y-3 sm:space-y-4 mt-10 sm:mt-12 text-lg sm:text-xl">
                    <li>
                      <Link to="/" className="hover:text-yellow-600">
                        Home
                      </Link>
                    </li>
                    <li>
                      <Link to="/shop" className="hover:text-yellow-600">
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
                </div>
              </div>
            )}

            {/* Icons Section */}
            <div className="flex justify-end space-x-2 sm:space-x-4 md:space-x-11 text-lg sm:text-xl md:text-2xl relative">
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
                      className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7"
                    />
                  </button>
                </Dropdown>
              </div>

              {/* Other Icons */}
              <Link to="/search" className="text-gray-600 hover:text-yellow-600">
                <img
                  src="./img/search.svg"
                  alt="Search Icon"
                  className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7"
                />
              </Link>
              <Link to="/wishlist" className="text-gray-600 hover:text-yellow-600">
                <img
                  src="./img/heart.svg"
                  alt="Favorites Icon"
                  className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7"
                />
              </Link>
              <Link to="/shop/cart" className="text-gray-600 hover:text-yellow-600">
                <img
                  src="./img/shopping.svg"
                  alt="Shopping Cart Icon"
                  className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7"
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