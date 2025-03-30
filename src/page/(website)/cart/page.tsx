import React, { useState, useEffect } from "react";
import { AiFillDelete } from "react-icons/ai";
import { message, notification } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CartPage = () => {
  const [cart, setCart] = useState<any[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0);
  const nav = useNavigate();

  useEffect(() => {
    // Kiểm tra xem người dùng đã đăng nhập chưa
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user.id) {
      setIsLoggedIn(true);

      // Lấy giỏ hàng của người dùng từ JSON Server
      axios
        .get(`http://localhost:3000/carts?userId=${user.id}`) // Chỉ lấy giỏ hàng của người dùng đăng nhập
        .then((response) => {
          const cartData = response.data;
          const updatedCart = mergeDuplicateItems(cartData);
          setCart(updatedCart);
          calculateTotal(updatedCart);
        })
        .catch((error) => {
          console.error("Lỗi khi lấy giỏ hàng: ", error);
        });
    } else {
      // Nếu người dùng chưa đăng nhập, kiểm tra giỏ hàng trong localStorage
      const localCart = JSON.parse(localStorage.getItem("cart") || "[]");
      setCart(localCart);
      calculateTotal(localCart);
    }
  }, []);

  // Hàm xử lý sản phẩm trùng trong giỏ hàng, cộng dồn số lượng
  const mergeDuplicateItems = (cartData: any[]) => {
    const cartMap: any = {};

    cartData.forEach((item) => {
      const existingProduct = Object.values(cartMap).find(
        (cartItem: any) => cartItem.name === item.name
      );

      if (existingProduct) {
        existingProduct.quantity += item.quantity;
        existingProduct.totalPrice = existingProduct.price * existingProduct.quantity;
      } else {
        cartMap[item.id] = { ...item, totalPrice: item.price * item.quantity };
      }
    });

    return Object.values(cartMap);
  };

  // Hàm xử lý xóa sản phẩm khỏi giỏ hàng
  const handleRemoveItem = (productId: number) => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user.id) {
      axios
        .delete(`http://localhost:3000/carts/${productId}`)
        .then(() => {
          setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
          message.success("Xóa sản phẩm thành công");
          calculateTotal(cart.filter((item) => item.id !== productId));
        })
        .catch((error) => {
          console.error("Lỗi khi xóa sản phẩm khỏi giỏ hàng: ", error);
        });
    } else {
      // Nếu người dùng không đăng nhập, xóa sản phẩm khỏi localStorage
      const updatedCart = cart.filter((item) => item.id !== productId);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      setCart(updatedCart);
      calculateTotal(updatedCart);
    }
  };

  // Hàm thay đổi số lượng sản phẩm
  const handleChangeQuantity = (index: number, quantity: number) => {
    const updatedCart = [...cart];
    updatedCart[index].quantity = quantity;
    updatedCart[index].totalPrice = updatedCart[index].price * quantity;

    const user = JSON.parse(localStorage.getItem("user") || "{}");

    if (user.id) {
      // Cập nhật giỏ hàng trên server nếu người dùng đã đăng nhập
      axios
        .put(`http://localhost:3000/carts/${updatedCart[index].id}`, updatedCart[index])
        .then(() => {
          setCart(updatedCart);
          calculateTotal(updatedCart);
        })
        .catch((error) => {
          console.error("Lỗi khi thay đổi số lượng: ", error);
        });
    } else {
      // Cập nhật giỏ hàng trong localStorage nếu người dùng chưa đăng nhập
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      setCart(updatedCart);
      calculateTotal(updatedCart);
    }
  };

  // Hàm xử lý thanh toán
  const handleCheckout = () => {
    if (!isLoggedIn) {
      notification.error({
        message: "Bạn cần đăng nhập để thanh toán!",
        description: "Vui lòng đăng nhập để tiếp tục.",
      });
      nav("/login");
    } else {
      nav("/checkout");
    }
  };

  // Hàm tính tổng giỏ hàng
  const calculateTotal = (cartData: any[]) => {
    let totalPrice = 0;
    cartData.forEach((item) => {
      totalPrice += item.totalPrice;
    });
    setTotal(totalPrice);
  };

  return (
    <div className="w-[1280px] mx-auto flex mt-12 mb-16">
      {cart.length === 0 ? (
        <div className="flex flex-col items-center justify-center w-full h-[400px]">
          <h2 className="text-2xl font-semibold">Giỏ hàng trống</h2>
          <p className="text-gray-500">Hiện tại giỏ hàng của bạn chưa có sản phẩm nào.</p>
          <button
            onClick={() => nav("/shop")}
            className="mt-4 px-6 py-2 bg-[#B88E2F] text-white rounded-lg"
          >
            Mua sắm ngay
          </button>
        </div>
      ) : (
        <div className="w-[817px]">
          <table className="w-full text-[#262626] text-base font-medium font-poppins table-auto">
            <thead className="bg-[#F9F1E7] text-left">
              <tr>
                <th className="py-4 pl-24">Sản phẩm</th>
                <th className="py-4">Giá</th>
                <th className="py-4">Số lượng</th>
                <th className="py-4">Tổng phụ</th>
                <th className="py-4"></th>
              </tr>
            </thead>
            <tbody className="text-base font-medium text-[#A3A3A3]">
              {cart.map((item, index) => (
                <tr key={item.id}>
                  <td className="py-[55px] flex items-center space-x-4">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-[80px] h-[80px] rounded-md bg-[#F9F1E7]"
                    />
                    <span>{item.name}</span>
                  </td>
                  <td className="text-left">{item.price.toLocaleString()}đ</td>
                  <td>
                    <input
                      className="border border-[#e5e5e5] rounded-[5px] text-center w-8 h-8"
                      type="number"
                      min={1}
                      value={item.quantity}
                      onChange={(e) =>
                        handleChangeQuantity(index, +e.target.value)
                      }
                    />
                  </td>
                  <td className="text-left">
                    {item.totalPrice.toLocaleString()}đ
                  </td>
                  <td>
                    <AiFillDelete
                      className="text-2xl text-[#B88E2F] cursor-pointer hover:text-[#e0ae3a]"
                      onClick={() => handleRemoveItem(item.id)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {cart.length > 0 && (
        <div className="w-[393px] h-[390px] px-16 pt-4 ml-[30px] bg-[#F9F1E7] shadow text-center">
          <h3 className="text-[32px] font-semibold">Tổng giỏ hàng</h3>
          <div className="pt-[61px] mt-4 text-base space-y-8 font-medium text-black">
            <div className="flex justify-between">
              <h4>Tổng phụ</h4>
              <span className="font-normal text-[#9F9F9F]">
                {total.toLocaleString()}đ
              </span>
            </div>
            <div className="flex justify-between">
              <h4>Tổng cộng</h4>
              <span className="text-[#B88E2F] font-medium text-xl">
                {total.toLocaleString()}đ
              </span>
            </div>
          </div>
          <button
            onClick={handleCheckout}
            className="w-full mt-8 border border-black rounded-[15px] py-[15px] text-[#000] px-[58px] text-xl font-semibold hover:bg-[#000] hover:text-white"
          >
            Thanh toán
          </button>
        </div>
      )}
    </div>
  );
};

export default CartPage;
