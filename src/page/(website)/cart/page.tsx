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
    const user = localStorage.getItem("userId");
    if (user) {
      setIsLoggedIn(true);
    }

    axios
      .get("http://localhost:3000/carts")
      .then((response) => {
        const cartData = response.data;
        // Xử lý giỏ hàng, cộng dồn số lượng nếu sản phẩm trùng tên
        const updatedCart = mergeDuplicateItems(cartData);
        setCart(updatedCart);
        calculateTotal(updatedCart);
      })
      .catch((error) => {
        console.error("Lỗi khi lấy giỏ hàng: ", error);
      });
  }, []);

  // Hàm xử lý sản phẩm trùng trong giỏ hàng, cộng dồn số lượng
  const mergeDuplicateItems = (cartData: any[]) => {
    const cartMap: any = {};

    // Duyệt qua tất cả sản phẩm trong giỏ hàng
    cartData.forEach((item) => {
      // Kiểm tra sản phẩm đã có trong giỏ hàng chưa, so sánh theo tên sản phẩm
      const existingProduct = Object.values(cartMap).find(
        (cartItem: any) => cartItem.name === item.name
      );

      if (existingProduct) {
        // Nếu sản phẩm trùng, cộng dồn số lượng
        existingProduct.quantity += item.quantity;
        existingProduct.totalPrice =
          existingProduct.price * existingProduct.quantity; // Cập nhật lại tổng
      } else {
        // Nếu sản phẩm chưa có, thêm mới vào giỏ hàng
        cartMap[item.id] = { ...item, totalPrice: item.price * item.quantity };
      }
    });

    // Chuyển từ cartMap về mảng
    return Object.values(cartMap);
  };

  const handleRemoveItem = (productId: number) => {
    // Xóa tất cả các sản phẩm có cùng productId trong giỏ hàng
    const updatedCart = cart.filter((item) => item.id !== productId);

    axios
      .delete(`http://localhost:3000/carts/${productId}`)
      .then((response) => {
        setCart(updatedCart);
        message.success("Xóa sản phẩm thành công");
        localStorage.setItem("cart", JSON.stringify(updatedCart));
        calculateTotal(updatedCart); // Tính lại tổng giá trị giỏ hàng
      })
      .catch((error) => {
        console.error("Lỗi khi xóa sản phẩm khỏi giỏ hàng: ", error);
      });
  };

  const handleChangeQuantity = (index: number, quantity: number) => {
    const updatedCart = [...cart];
    updatedCart[index].quantity = quantity;
    updatedCart[index].totalPrice = updatedCart[index].price * quantity; // Cập nhật lại tổng giá trị sản phẩm

    axios
      .put(
        `http://localhost:3000/carts/${updatedCart[index].id}`,
        updatedCart[index]
      )
      .then((response) => {
        setCart(updatedCart);
        calculateTotal(updatedCart);
      })
      .catch((error) => {
        console.error("Lỗi khi thay đổi số lượng: ", error);
      });
  };

  const handleCheckout = () => {
    if (!isLoggedIn) {
      notification.error({
        message: "Bạn cần đăng nhập để thanh toán!",
        description: "Vui lòng đăng nhập để tiếp tục.",
      });
      nav("/login");
    } else {
      console.log("Proceeding to checkout...");
      nav("checkout");
    }
  };

  const calculateTotal = (cartData: any[]) => {
    let totalPrice = 0;
    cartData.forEach((item) => {
      totalPrice += item.totalPrice; // Cộng dồn tổng của tất cả sản phẩm trong giỏ
    });
    setTotal(totalPrice);
  };

  return (
    <div className="w-[1280px] mx-auto flex mt-12 mb-16">
      {cart.length === 0 ? (
        // Giỏ hàng trống
        <div className="flex flex-col items-center justify-center w-full h-[400px]">
          <h2 className="text-2xl font-semibold">Giỏ hàng trống</h2>
          <p className="text-gray-500">
            Hiện tại giỏ hàng của bạn chưa có sản phẩm nào.
          </p>
          <button
            onClick={() => nav("/shop")} // Chuyển đến trang sản phẩm hoặc trang chủ
            className="mt-4 px-6 py-2 bg-[#B88E2F] text-white rounded-lg"
          >
            Mua sắm ngay
          </button>
        </div>
      ) : (
        // Giỏ hàng có sản phẩm
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
                      onClick={() => handleRemoveItem(item.id)} // Xóa tất cả sản phẩm có id giống
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
