import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { message, notification } from "antd";
import axios from "axios";

const NoiBat = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const nav = useNavigate();

  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:3000/products");
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
      const res = await axios.get("http://localhost:3000/carts");
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
        `http://localhost:3000/products/${product.id}`
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
        await axios.put(`http://localhost:3000/carts/${existingItem.id}`, {
          ...existingItem,
          quantity: existingItem.quantity + 1,
          totalPrice: (existingItem.quantity + 1) * product.price,
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

      message.success("Đã thêm vào giỏ hàng!");
      fetchCart(); // cập nhật lại số lượng hiển thị
    } catch (err) {
      console.error("Lỗi khi thêm vào giỏ hàng:", err);
      message.error("Không thể thêm vào giỏ hàng.");
    }
  };

  const getRemainingStock = (product: any) => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const userItem = cartItems.find(
      (item: any) => item.userId === user.id && item.productId === product.id
    );
    return product.stock - (userItem?.quantity || 0);
  };

  return (
    <section className="max-w-7xl mx-auto p-4">
      <h2 className="text-medium text-[40px] border-b border-[#000] mb-[57px] pb-5">
        Sản phẩm nổi bật
      </h2>

      <Swiper
        modules={[Navigation, Autoplay, Pagination]}
        slidesPerView={1}
        spaceBetween={10}
        loop
        autoplay={{ delay: 2500, disableOnInteraction: false }}
        navigation
        pagination={{ clickable: true }}
        breakpoints={{
          640: { slidesPerView: 2 },
          768: { slidesPerView: 3 },
          1024: { slidesPerView: 4 },
        }}
        className="w-full max-w-7xl mx-auto"
      >
        {products.map((product) => {
          const remainingStock = getRemainingStock(product);
          return (
            <SwiperSlide key={product.id}>
              <div className="bg-[#F4F5F7]">
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
                        <span>Yêu Thích</span>
                      </button>
                    </div>
                  </div>
                </div>
                <div className="mt-3 bg-[#F4F5F7] pt-4 pl-4 pb-8">
                  <h3 className="font-semibold text-2xl mb-2">
                    <Link
                      to={`/shop/${product.id}`}
                      className="hover:text-yellow-600"
                    >
                      {product.name.length > 20
                        ? `${product.name.substring(0, 20)}...`
                        : product.name}
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
            </SwiperSlide>
          );
        })}
      </Swiper>
    </section>
  );
};

export default NoiBat;
