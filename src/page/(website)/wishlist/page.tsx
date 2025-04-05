import React, { useState, useEffect } from "react";

import axios from "axios";

import { List, Button, Input, Typography, Space, message } from "antd"; // Import các component từ antd

const { Title } = Typography;

const WishList = () => {
  // State lưu danh sách yêu thích và giá trị nhập từ input
  const [wishlist, setWishlist] = useState([]);
  const [newItem, setNewItem] = useState("");

  // Kiểm tra trạng thái đăng nhập dựa trên sự tồn tại của token trong localStorage
  const isLoggedIn = !!localStorage.getItem("token");

  // Các key lưu trữ trong localStorage cho wishlist và cart khi chưa đăng nhập
  const localWishlistKey = "wishlist";
  const localCartKey = "cart";

  // Hàm fetch lấy danh sách wishlist từ backend (json-server) hoặc localStorage
  const fetchWishlist = async () => {
    if (isLoggedIn) {
      // Nếu đã đăng nhập, lấy dữ liệu từ json-server qua axios
      try {
        const response = await axios.get("http://localhost:3000/wishlist");
        setWishlist(response.data);
      } catch (error) {
        console.error("Lỗi khi lấy wishlist từ JSON:", error);
        message.error("Không thể lấy dữ liệu từ server!");
      }
    } else {
      // Nếu chưa đăng nhập, lấy dữ liệu từ localStorage
      const storedWishlist = localStorage.getItem(localWishlistKey);
      if (storedWishlist) {
        setWishlist(JSON.parse(storedWishlist));
      } else {
        setWishlist([]);
      }
    }
  };

  // Hàm cập nhật dữ liệu wishlist trong localStorage
  const updateLocalStorageWishlist = (updatedWishlist) => {
    localStorage.setItem(localWishlistKey, JSON.stringify(updatedWishlist));
  };

  // Sử dụng useEffect để gọi fetchWishlist khi component mount
  useEffect(() => {
    fetchWishlist();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Hàm thêm sản phẩm vào wishlist
  const addItem = async () => {
    // Nếu input rỗng thì không làm gì
    if (!newItem) return;

    // Tạo đối tượng item mới với tên sản phẩm
    const item = { name: newItem };

    if (isLoggedIn) {
      // Nếu đăng nhập, gửi yêu cầu POST đến json-server để thêm sản phẩm
      try {
        const response = await axios.post(
          "http://localhost:3000/wishlist",
          item,
          {
            headers: { "Content-Type": "application/json" },
          }
        );
        setWishlist([...wishlist, response.data]);
        message.success("Đã thêm sản phẩm vào wishlist!");
        setNewItem("");
      } catch (error) {
        console.error("Lỗi khi thêm sản phẩm vào JSON:", error);
        message.error("Thêm sản phẩm thất bại!");
      }
    } else {
      // Nếu chưa đăng nhập, tự sinh id và thêm sản phẩm vào localStorage
      const newId =
        wishlist.length > 0 ? wishlist[wishlist.length - 1].id + 1 : 1;
      const newItemWithId = { id: newId, name: newItem };
      const updatedWishlist = [...wishlist, newItemWithId];
      setWishlist(updatedWishlist);
      updateLocalStorageWishlist(updatedWishlist);
      message.success("Đã thêm sản phẩm vào wishlist (local)!");
      setNewItem("");
    }
  };

  // Hàm xóa sản phẩm khỏi wishlist
  const removeItem = async (id) => {
    if (isLoggedIn) {
      // Nếu đã đăng nhập, gửi yêu cầu DELETE đến json-server để xóa sản phẩm
      try {
        await axios.delete(`http://localhost:3000/wishlist/${id}`);
        setWishlist(wishlist.filter((item) => item.id !== id));
        message.success("Đã xóa sản phẩm!");
      } catch (error) {
        console.error("Lỗi khi xóa sản phẩm từ JSON:", error);
        message.error("Xóa sản phẩm thất bại!");
      }
    } else {
      // Nếu chưa đăng nhập, lọc bỏ sản phẩm khỏi state và cập nhật lại localStorage
      const updatedWishlist = wishlist.filter((item) => item.id !== id);
      setWishlist(updatedWishlist);
      updateLocalStorageWishlist(updatedWishlist);
      message.success("Đã xóa sản phẩm khỏi wishlist (local)!");
    }
  };

  // Hàm thêm sản phẩm vào giỏ hàng
  const addToCart = async (item) => {
    if (isLoggedIn) {
      // Nếu đã đăng nhập, gửi yêu cầu POST đến json-server để thêm sản phẩm vào cart
      try {
        const response = await axios.post("http://localhost:3000/cart", item, {
          headers: { "Content-Type": "application/json" },
        });
        console.log("Đã thêm vào giỏ hàng từ JSON:", response.data);
        message.success("Đã thêm sản phẩm vào giỏ hàng!");
      } catch (error) {
        console.error("Lỗi khi thêm vào giỏ hàng từ JSON:", error);
        message.error("Thêm vào giỏ hàng thất bại!");
      }
    } else {
      // Nếu chưa đăng nhập, lấy dữ liệu cart từ localStorage và thêm sản phẩm mới vào mảng
      const cart = localStorage.getItem(localCartKey);
      let cartArray = cart ? JSON.parse(cart) : [];
      const newId =
        cartArray.length > 0 ? cartArray[cartArray.length - 1].id + 1 : 1;
      const newCartItem = { ...item, id: newId };
      cartArray.push(newCartItem);
      localStorage.setItem(localCartKey, JSON.stringify(cartArray));
      console.log("Đã thêm vào giỏ hàng trong localStorage:", newCartItem);
      message.success("Đã thêm sản phẩm vào giỏ hàng (local)!");
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "auto", padding: "20px" }}>
      {/* Sử dụng Typography.Title của antd cho tiêu đề */}
      <Title level={2}>Danh sách yêu thích</Title>

      {/* Sử dụng List của antd để hiển thị danh sách sản phẩm */}
      <List
        bordered
        dataSource={wishlist}
        renderItem={(item) => (
          <List.Item
            actions={[
              // Nút xóa sản phẩm, sử dụng Button của antd
              <Button type="primary" danger onClick={() => removeItem(item.id)}>
                Xóa
              </Button>,
              // Nút thêm sản phẩm vào giỏ hàng
              <Button type="default" onClick={() => addToCart(item)}>
                Thêm vào giỏ hàng
              </Button>,
            ]}
          >
            {item.name}
          </List.Item>
        )}
      />

      {/* Phần nhập và thêm sản phẩm */}
      <Space style={{ marginTop: 20 }}>
        <Input
          placeholder="Thêm sản phẩm"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          onPressEnter={addItem} // Cho phép nhấn Enter để thêm
        />
        <Button type="primary" onClick={addItem}>
          Thêm
        </Button>
      </Space>
    </div>
  );
};
export default WishList;
