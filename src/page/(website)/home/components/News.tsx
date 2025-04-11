import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { notification, Spin } from "antd";

const NewsHome = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetch("http://localhost:3000/products")
      .then((response) => response.json())
      .then((data) => {
        const sortedProducts = data.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setProducts(sortedProducts.slice(0, 8));
        setLoading(false);
      })
      .catch((error) => {
        console.error("Lỗi khi lấy dữ liệu:", error);
        setLoading(false);
      });

    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const res = await axios.get("http://localhost:3000/carts");
      setCartItems(res.data);
    } catch (err) {
      console.error("Lỗi khi lấy giỏ hàng:", err);
    }
  };

  const addToCart = async (product: any) => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");

      const res = await axios.get(`http://localhost:3000/products/${product.id}`);
      const latestProduct = res.data;
      const stock = latestProduct.stock;

      if (user.id) {
        const cartRes = await axios.get("http://localhost:3000/carts");
        const userCart = cartRes.data.filter((item: any) => item.userId === user.id);
        const existingItem = userCart.find((item: any) => item.productId === product.id);
        const currentQty = existingItem?.quantity || 0;

        if (currentQty >= stock) {
          notification.warning({
            message: "Hết hàng",
            description: "Bạn đã thêm tối đa số lượng sản phẩm có sẵn.",
          });
          return;
        }

        if (existingItem) {
          await axios.put(`http://localhost:3000/carts/${existingItem.id}`, {
            ...existingItem,
            quantity: currentQty + 1,
            totalPrice: (currentQty + 1) * product.price,
          });
        } else {
          await axios.post("http://localhost:3000/carts", {
            productId: product.id,
            name: product.name,
            imageUrl: product.imageUrl,
            price: product.price,
            userId: user.id,
            quantity: 1,
            totalPrice: product.price,
          });
        }

        notification.success({
          message: "Thêm vào giỏ hàng thành công",
        });
        fetchCart();
      } else {
        const localCart = JSON.parse(localStorage.getItem("cart") || "[]");
        const existingItem = localCart.find((item: any) => item.id === product.id);
        const currentQty = existingItem?.quantity || 0;

        if (currentQty >= stock) {
          notification.warning({
            message: "Hết hàng",
            description: "Bạn đã thêm tối đa số lượng sản phẩm có sẵn.",
          });
          return;
        }

        if (existingItem) {
          existingItem.quantity += 1;
        } else {
          localCart.push({ ...product, quantity: 1 });
        }

        localStorage.setItem("cart", JSON.stringify(localCart));
        notification.success({
          message: "Thêm vào giỏ hàng thành công",
        });
      }
    } catch (error) {
      console.error("Lỗi khi thêm sản phẩm vào giỏ hàng:", error);
      notification.error({
        message: "Lỗi",
        description: "Đã có lỗi xảy ra khi thêm sản phẩm vào giỏ hàng.",
      });
    }
  };

  return (
    <section className="max-w-7xl mx-auto p-4">
      <h2 className="text-medium text-[40px] border-b border-[#000] mb-[57px] pb-5">
        Sản phẩm mới
      </h2>

      {loading ? (
        <div className="flex justify-center">
          <Spin size="large" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {products.length > 0 ? (
            products.map((product) => (
              <div key={product.id} className="bg-[#F4F5F7]">
                <div className="relative group h-80 overflow-hidden">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover transition duration-300 group-hover:opacity-70"
                  />
                  {product.noibat && (
                    <span className="absolute top-4 left-4 bg-yellow-500 text-white font-medium px-2 py-1 rounded-full">
                      Nổi bật
                    </span>
                  )}
                  <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300 bg-black bg-opacity-50">
                    <button
                      onClick={() => addToCart(product)}
                      className="bg-white text-yellow-600 font-semibold py-3 px-11 mb-2"
                    >
                      Thêm vào giỏ hàng
                    </button>
                    <div className="flex space-x-4 text-white">
                      <button className="flex items-center space-x-1">
                        <i className="fa-solid fa-share-nodes" />
                        <span>Chia sẻ</span>
                      </button>
                      <button className="flex items-center space-x-1">
                        <i className="fa-solid fa-arrow-right-arrow-left" />
                      </button>
                      <button className="flex items-center space-x-1">
                        <i className="fas fa-heart" />
                        <span>Yêu thích</span>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mt-3 bg-[#F4F5F7] pt-4 pl-4 pb-8">
                  <h3 className="font-semibold text-2xl mb-2">
                    <Link
                      to={`/shop/${product.id}`}
                      className="hover:text-yellow-600 block text-ellipsis whitespace-nowrap overflow-hidden"
                      style={{ maxWidth: "250px" }}
                    >
                      {product.name}
                    </Link>
                  </h3>
                  <div className="text-[#3a3a3a] font-semibold">
                    <span className="mr-3">
                      {product.price.toLocaleString()}
                      <sup>đ</sup>
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div>Không có sản phẩm nào</div>
          )}
        </div>
      )}
    </section>
  );
};

export default NewsHome;
