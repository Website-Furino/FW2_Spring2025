import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios"; // Đảm bảo bạn đã cài axios
import { notification, Spin } from "antd"; // Nhập Spin để hiển thị trạng thái tải

const NewsHome = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true); // Theo dõi trạng thái tải

  useEffect(() => {
    // Lấy dữ liệu sản phẩm với xử lý lỗi
    fetch("http://localhost:3000/products")
      .then((response) => response.json())
      .then((data) => {
        // Sắp xếp sản phẩm theo ngày tạo (createdAt)
        const sortedProducts = data.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        // Lấy 8 sản phẩm mới nhất
        setProducts(sortedProducts.slice(0, 8));
        setLoading(false); // Set trạng thái tải là false khi đã lấy xong dữ liệu
      })
      .catch((error) => {
        console.error("Lỗi khi lấy dữ liệu:", error);
        setLoading(false); // Set trạng thái tải là false khi có lỗi
      });
  }, []);

  // Hàm thêm sản phẩm vào giỏ hàng
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
        Sản phẩm mới
      </h2>

      {/* Hiển thị spinner khi đang tải sản phẩm */}
      {loading ? (
        <div className="flex justify-center">
          <Spin size="large" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {products.length > 0 ? (
            products.map((product) => (
              <div key={product.id} className="bg-[#F4F5F7]">
                {/* Ảnh sản phẩm */}
                <div className="relative group h-80 overflow-hidden">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover transition duration-300 group-hover:opacity-70"
                  />

                  {/* Hiển thị nếu sản phẩm là nổi bật */}
                  {product.noibat && (
                    <span className="absolute top-4 left-4 bg-yellow-500 text-white font-medium px-2 py-1 rounded-full">
                      Nổi bật
                    </span>
                  )}

                  {/* Các nút khi hover */}
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

                {/* Thông tin sản phẩm */}
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
