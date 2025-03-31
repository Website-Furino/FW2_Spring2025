import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { notification } from "antd";
import axios from "axios"; // Add axios import

const NoiBat = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [cartCount, setCartCount] = useState<number>(0);

  // Lấy dữ liệu sản phẩm từ API
  useEffect(() => {
    fetch("http://localhost:3000/products")
      .then((response) => response.json())
      .then((data) => {
        // Lọc các sản phẩm nổi bật
        const featuredProducts = data.filter(
          (product) => product.noibat === true
        );
        setProducts(featuredProducts); // Lưu dữ liệu vào state, chỉ bao gồm sản phẩm nổi bật
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  // Cập nhật số lượng giỏ hàng khi có thay đổi
  useEffect(() => {
    const fetchCartCount = async () => {
      try {
        const response = await axios.get("http://localhost:3000/carts");
        const cart = response.data;
        const totalItems = cart.reduce(
          (total: number, item: any) => total + item.quantity,
          0
        );
        setCartCount(totalItems);
      } catch (error) {
        console.error("Error fetching cart data:", error);
      }
    };

    fetchCartCount();
  }, []);

  // Thêm sản phẩm vào giỏ hàng (cập nhật vào DB)
  const addToCart = async (product: any) => {
    try {
      // Kiểm tra xem người dùng đã đăng nhập chưa
      const user = JSON.parse(localStorage.getItem("user") || "{}");

      if (user.id) {
        // Người dùng đã đăng nhập, xử lý giỏ hàng trên server
        const response = await axios.get("http://localhost:3000/carts");
        const cart = response.data;

        // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
        const existingProduct = cart.find(
          (item: any) => item.id === product.id
        );

        if (existingProduct) {
          // Nếu sản phẩm đã có, tăng số lượng lên 1
          existingProduct.quantity += 1;
          await axios.put(
            `http://localhost:3000/carts/${existingProduct.id}`,
            existingProduct
          );
          notification.success({
            message: "Sản phẩm đã được cập nhật",
            description: `Số lượng của ${product.name} đã được tăng lên.`,
          });
        } else {
          // Nếu sản phẩm chưa có trong giỏ hàng, thêm sản phẩm mới với số lượng = 1
          const newProduct = { ...product, quantity: 1, userId: user.id };
          await axios.post("http://localhost:3000/carts", newProduct);
          notification.success({
            message: "Thêm vào giỏ hàng thành công",
            description: `${product.name} đã được thêm vào giỏ hàng.`,
          });
        }
      } else {
        // Người dùng chưa đăng nhập, lưu giỏ hàng vào localStorage
        const localCart = JSON.parse(localStorage.getItem("cart") || "[]");
        const existingProduct = localCart.find(
          (item: any) => item.id === product.id
        );

        if (existingProduct) {
          // Nếu sản phẩm đã có, tăng số lượng lên 1
          existingProduct.quantity += 1;
        } else {
          // Nếu sản phẩm chưa có trong giỏ hàng, thêm sản phẩm mới với số lượng = 1
          localCart.push({ ...product, quantity: 1 });
        }

        // Lưu giỏ hàng vào localStorage
        localStorage.setItem("cart", JSON.stringify(localCart));
        notification.success({
          message: "Thêm vào giỏ hàng thành công",
          description: `${product.name} đã được thêm vào giỏ hàng.`,
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
        Sản phẩm nổi bật
      </h2>

      {/* Swiper Slider */}
      <Swiper
        modules={[Navigation, Autoplay, Pagination]}
        slidesPerView={1}
        spaceBetween={10}
        loop={true}
        autoplay={{ delay: 2500, disableOnInteraction: false }}
        navigation={true}
        pagination={{ clickable: true }}
        breakpoints={{
          640: { slidesPerView: 2 },
          768: { slidesPerView: 3 },
          1024: { slidesPerView: 4 },
        }}
        className="w-full max-w-7xl mx-auto"
      >
        {products.map((product) => (
          <SwiperSlide key={product.id}>
            <div className="bg-[#F4F5F7]">
              {/* Box ảnh sản phẩm */}
              <div className="relative group h-80 overflow-hidden">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover transition duration-300 group-hover:opacity-70"
                />

                {/* Hiển thị sản phẩm nổi bật */}
                {product.noibat && (
                  <span className="absolute top-4 left-4 bg-yellow-500 text-white font-medium px-2 py-1 rounded-full">
                    Nổi bật
                  </span>
                )}

                {/* Các nút khi hover */}
                <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300 bg-black bg-opacity-50">
                  <button
                    onClick={() => addToCart(product)} // Gọi addToCart khi bấm vào nút
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

              {/* Box thông tin sản phẩm */}
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
        ))}
      </Swiper>
    </section>
  );
};

export default NoiBat;
