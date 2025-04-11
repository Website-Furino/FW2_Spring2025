import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { message, notification } from "antd";
import axios from "axios";

const NoiBat = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const nav = useNavigate();

  const fetchProducts = async () => {
    try {
      const res = await axios.get("https://json-server-online-8kf1.onrender.com/products");
      const featured = res.data.filter(
        (product: any) => product.noibat === true
      );
      setProducts(featured);
    } catch (err) {
      console.error("Lỗi khi lấy sản phẩm:", err);
    }
  };

  const fetchCart = async () => {
    try {
      const res = await axios.get("https://json-server-online-8kf1.onrender.com/carts");
      setCartItems(res.data);
    } catch (err) {
      console.error("Lỗi khi lấy giỏ hàng:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCart();
  }, []);

  const addToCart = async (product: any) => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    if (!user.id) {
      notification.error({
        message: "Bạn cần đăng nhập để thêm vào giỏ hàng!",
        description: "Vui lòng đăng nhập trước khi mua hàng.",
      });
      nav("/login");
      return;
    }

    try {
      const res = await axios.get(
        `https://json-server-online-8kf1.onrender.com/products/${product.id}`
      );
      const latestProduct = res.data;

      const userCartItems = cartItems.filter(
        (item: any) => item.userId === user.id && item.productId === product.id
      );

      const existingItem = userCartItems[0];
      const existingQty = existingItem ? existingItem.quantity : 0;

      const remainingStock = latestProduct.stock - existingQty;

      if (remainingStock <= 0) {
        notification.warning({
          message: "Vượt quá số lượng tồn kho!",
          description: "Không thể thêm sản phẩm, đã hết hàng trong kho.",
        });
        return;
      }

      if (existingItem) {
        await axios.put(`https://json-server-online-8kf1.onrender.com/carts/${existingItem.id}`, {
          ...existingItem,
          quantity: existingItem.quantity + 1,
          totalPrice: (existingItem.quantity + 1) * product.price,
        });
      } else {
        await axios.post("https://json-server-online-8kf1.onrender.com/carts", {
          productId: product.id,
          name: product.name,
          imageUrl: product.imageUrl,
          price: product.price,
          userId: user.id,
          quantity: 1,
          totalPrice: product.price,
        });
      }

      message.success("Đã thêm vào giỏ hàng!");
      fetchCart();
    } catch (err) {
      console.error("Lỗi khi thêm vào giỏ hàng:", err);
      message.error("Không thể thêm vào giỏ hàng.");
    }
  };

  return (
    <section className="max-w-7xl mx-auto p-4">
      <h2 className="text-medium text-[40px] border-b border-[#000] mb-[57px] pb-5 text-center font-bold">
        Sản phẩm nổi bật
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="relative group h-80 overflow-hidden rounded-t-lg">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-cover transition duration-300 group-hover:scale-110"
              />
              {product.noibat && (
                <span className="absolute top-4 left-4 bg-yellow-500 text-white font-medium px-3 py-1 rounded-full text-sm">
                  Nổi bật
                </span>
              )}
              <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300 bg-black bg-opacity-60">
                <button
                  onClick={() => addToCart(product)}
                  className="bg-yellow-500 text-white font-semibold py-3 px-6 rounded-full mb-3 hover:bg-yellow-600 transition-colors duration-300"
                >
                  Thêm vào giỏ hàng
                </button>
                <div className="flex space-x-6 text-white">
                  <button className="flex items-center space-x-2 hover:text-yellow-500 transition-colors duration-300">
                    <i className="fa-solid fa-share-nodes" />
                    <span>Chia sẻ</span>
                  </button>
                  <button className="hover:text-yellow-500 transition-colors duration-300">
                    <i className="fa-solid fa-arrow-right-arrow-left" />
                  </button>
                  <button className="flex items-center space-x-2 hover:text-yellow-500 transition-colors duration-300">
                    <i className="fas fa-heart" />
                    <span>Yêu Thích</span>
                  </button>
                </div>
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-bold text-xl mb-2">
                <Link
                  to={`/shop/${product.id}`}
                  className="hover:text-yellow-600 transition-colors duration-300"
                >
                  {product.name.length > 20
                    ? `${product.name.substring(0, 20)}...`
                    : product.name}
                </Link>
              </h3>
              <div className="text-yellow-600 font-bold text-lg">
                <span>
                  {product.price.toLocaleString()}
                  <sup>đ</sup>
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default NoiBat;