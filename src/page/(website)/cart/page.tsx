import { useState, useEffect } from "react";
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
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user.id) {
      setIsLoggedIn(true);
      axios
        .get(`https://json-server-online-8kf1.onrender.com/carts?userId=${user.id}`)
        .then(async (response) => {
          const cartData = response.data;

          const updatedCart = await Promise.all(
            cartData.map(async (item: any) => {
              const productRes = await axios.get(
                `https://json-server-online-8kf1.onrender.com/products/${item.productId}`
              );
              return {
                ...item,
                stock: productRes.data.stock,
              };
            })
          );

          setCart(updatedCart);
          calculateTotal(updatedCart);
        })
        .catch((error) => {
          console.error("Lỗi khi lấy giỏ hàng: ", error);
        });
    }
  }, []);

  const handleRemoveItem = (productId: number) => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user.id) {
      axios
        .delete(`https://json-server-online-8kf1.onrender.com/carts/${productId}`)
        .then(() => {
          const newCart = cart.filter((item) => item.id !== productId);
          setCart(newCart);
          message.success("Xóa sản phẩm thành công");
          calculateTotal(newCart);
        })
        .catch((error) => {
          console.error("Lỗi khi xóa sản phẩm khỏi giỏ hàng: ", error);
        });
    }
  };

  const handleChangeQuantity = async (index: number, quantity: number) => {
    const updatedCart = [...cart];
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const item = updatedCart[index];

    if (!user.id) return;

    try {
      const productRes = await axios.get(`https://json-server-online-8kf1.onrender.com/products/${item.productId}`);
      const product = productRes.data;

      if (quantity > product.stock) {
        notification.warning({
          message: "Vượt quá số lượng tồn kho!",
          description: `Chỉ còn ${product.stock} sản phẩm trong kho.`,
        });
        return;
      }

      updatedCart[index].quantity = quantity;
      updatedCart[index].totalPrice = updatedCart[index].price * quantity;

      await axios.put(
        `https://json-server-online-8kf1.onrender.com/carts/${updatedCart[index].id}`,
        updatedCart[index]
      );

      updatedCart[index].stock = product.stock;
      setCart(updatedCart);
      calculateTotal(updatedCart);
    } catch (error) {
      console.error("Lỗi khi thay đổi số lượng: ", error);
    }
  };

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

  const calculateTotal = (cartData: any[]) => {
    let totalPrice = 0;
    cartData.forEach((item) => {
      totalPrice += item.totalPrice;
    });
    setTotal(totalPrice);
  };

  return (
    <div className="w-full max-w-[1280px] mx-auto flex flex-col lg:flex-row mt-6 lg:mt-12 mb-8 lg:mb-16 px-4 lg:px-0">
      {cart.length === 0 ? (
        <div className="flex flex-col items-center justify-center w-full h-[300px] lg:h-[400px]">
          <h2 className="text-xl lg:text-2xl font-semibold">Giỏ hàng trống</h2>
          <p className="text-gray-500 text-center px-4">
            Hiện tại giỏ hàng của bạn chưa có sản phẩm nào.
          </p>
          <button
            onClick={() => nav("/shop")}
            className="mt-4 px-4 lg:px-6 py-2 bg-[#B88E2F] text-white rounded-lg"
          >
            Mua sắm ngay
          </button>
        </div>
      ) : (
        <div className="w-full lg:w-[817px] overflow-x-auto">
          <table className="w-full text-[#262626] text-sm lg:text-base font-medium font-poppins table-auto min-w-[600px]">
            <thead className="bg-[#F9F1E7] text-left">
              <tr>
                <th className="py-3 lg:py-4 pl-4 lg:pl-24">Sản phẩm</th>
                <th className="py-3 lg:py-4">Giá</th>
                <th className="py-3 lg:py-4">Số lượng</th>
                <th className="py-3 lg:py-4">Tổng phụ</th>
                <th className="py-3 lg:py-4"></th>
              </tr>
            </thead>
            <tbody className="text-sm lg:text-base font-medium text-[#A3A3A3]">
              {cart.map((item, index) => (
                <tr key={item.id}>
                  <td className="py-4 lg:py-[55px] flex items-center space-x-2 lg:space-x-4 pl-4 lg:pl-0">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-[60px] h-[60px] lg:w-[80px] lg:h-[80px] rounded-md bg-[#F9F1E7]"
                    />
                    <span className="text-sm lg:text-base">{item.name}</span>
                  </td>
                  <td className="text-left">
                    {item.price ? item.price.toLocaleString() : 0}đ
                  </td>
                  <td>
                    <input
                      className="border border-[#e5e5e5] rounded-[5px] text-center w-10 lg:w-12 h-7 lg:h-8"
                      type="number"
                      min={1}
                      max={item.stock}
                      value={item.quantity}
                      onChange={(e) =>
                        handleChangeQuantity(index, +e.target.value)
                      }
                    />
                  </td>
                  <td className="text-left">
                    {item.totalPrice ? item.totalPrice.toLocaleString() : 0}đ
                  </td>
                  <td>
                    <AiFillDelete
                      className="text-xl lg:text-2xl text-[#B88E2F] cursor-pointer hover:text-[#e0ae3a]"
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
        <div className="w-full lg:w-[393px] h-auto lg:h-[390px] px-6 lg:px-16 pt-4 mt-8 lg:mt-0 lg:ml-[30px] bg-[#F9F1E7] shadow text-center">
          <h3 className="text-2xl lg:text-[32px] font-semibold">Tổng giỏ hàng</h3>
          <div className="pt-6 lg:pt-[61px] mt-4 text-sm lg:text-base space-y-6 lg:space-y-8 font-medium text-black">
            <div className="flex justify-between">
              <h4>Tổng phụ</h4>
              <span className="font-normal text-[#9F9F9F]">
                {total.toLocaleString()}đ
              </span>
            </div>
            <div className="flex justify-between">
              <h4>Tổng cộng</h4>
              <span className="text-[#B88E2F] font-medium text-lg lg:text-xl">
                {total.toLocaleString()}đ
              </span>
            </div>
          </div>
          <button
            onClick={handleCheckout}
            className="w-full mt-6 lg:mt-8 border border-black rounded-[15px] py-3 lg:py-[15px] text-[#000] px-4 lg:px-[58px] text-lg lg:text-xl font-semibold hover:bg-[#000] hover:text-white mb-6 lg:mb-0"
          >
            Thanh toán
          </button>
        </div>
      )}
    </div>
  );
};

export default CartPage;