import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { notification, Pagination } from "antd";

const ShopPage = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [priceFilter, setPriceFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [categories, setCategories] = useState<any[]>([]); // State cho danh mục
  const [selectedCategory, setSelectedCategory] = useState("all"); // State cho danh mục đã chọn

  useEffect(() => {
    // Lấy sản phẩm
    fetch("http://localhost:3000/products")
      .then((response) => response.json())
      .then((data) => {
        setProducts(data);
        setFilteredProducts(data);
      })
      .catch((error) => {
        console.error("Lỗi khi lấy dữ liệu sản phẩm:", error);
      });

    // Lấy danh mục (hoặc bạn có thể cung cấp danh mục cố định)
    fetch("http://localhost:3000/categories") // Giả sử danh mục lưu tại đây
      .then((response) => response.json())
      .then((data) => {
        setCategories(data);
      })
      .catch((error) => {
        console.error("Lỗi khi lấy danh mục:", error);
      });
  }, []);

  // Hàm tìm kiếm sản phẩm theo tên
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    filterProducts(value, selectedCategory, priceFilter);
  };

  // Hàm lọc sản phẩm theo tên, danh mục và giá
  const filterProducts = (search: string, category: string, price: string) => {
    let filtered = products.filter((product) =>
      product.name.toLowerCase().includes(search)
    );

    // Lọc theo danh mục
    if (category !== "all") {
      filtered = filtered.filter(
        (product) => product.categoryName === category
      );
    }

    // Lọc theo giá
    if (price === "newest") {
      filtered = filtered.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } else if (price === "lowToHigh") {
      filtered = filtered.sort((a, b) => a.price - b.price);
    } else if (price === "highToLow") {
      filtered = filtered.sort((a, b) => b.price - a.price);
    }

    setFilteredProducts(filtered);
  };

  // Hàm lọc theo danh mục
  const handleCategoryFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const category = e.target.value;
    setSelectedCategory(category);
    filterProducts(searchTerm, category, priceFilter);
  };

  // Hàm lọc theo giá
  const handlePriceFilter = (value: string) => {
    setPriceFilter(value);
    filterProducts(searchTerm, selectedCategory, value);
  };
  // Hàm thêm sản phẩm vào giỏ hàng và lưu vào DB
  const addToCart = async (product: any) => {
    try {
      // Lấy giỏ hàng hiện tại
      const response = await axios.get("http://localhost:3000/carts");
      const cart = response.data;

      // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
      const existingProduct = cart.find((item: any) => item.id === product.id);

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
        const newProduct = { ...product, quantity: 1 };
        await axios.post("http://localhost:3000/carts", newProduct);
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

  // Phân trang
  const handlePageChange = (page: number, pageSize: number) => {
    setCurrentPage(page);
    setPageSize(pageSize);
  };

  const startIndex = (currentPage - 1) * pageSize;
  const paginatedProducts = filteredProducts.slice(
    startIndex,
    startIndex + pageSize
  );

  return (
    <>
      <div className="max-w-7xl mx-auto p-6">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-4 text-sm text-gray-700">
          <span className="text-gray-500 hover:text-gray-800 cursor-pointer transition duration-300">
            <Link to="/">Trang chủ</Link>
          </span>
          <span className="text-gray-400">/</span>
          <span className="text-gray-800 font-medium">Sản phẩm</span>
        </div>
      </div>

      <section className="max-w-7xl mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm"
            value={searchTerm}
            onChange={handleSearch}
            className="w-1/3 p-2 border rounded"
          />
          <select
            value={priceFilter}
            onChange={(e) => handlePriceFilter(e.target.value)}
            className="w-1/4 p-2 border rounded"
          >
            <option value="all">Tất cả sản phẩm</option>
            <option value="newest">Sản phẩm mới nhất</option>
            <option value="lowToHigh">Giá: Thấp đến Cao</option>
            <option value="highToLow">Giá: Cao đến Thấp</option>
          </select>

          {/* Bộ lọc theo danh mục */}
          <select
            value={selectedCategory}
            onChange={handleCategoryFilter}
            className="w-1/4 p-2 border rounded"
          >
            <option value="all">Tất cả danh mục</option>
            {categories.map((category) => (
              <option key={category.id} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {paginatedProducts.map((product) => (
            <div key={product.id} className="bg-[#F4F5F7]">
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

              {/* Box thông tin sản phẩm */}
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
          ))}
        </div>

        <div className="flex justify-center mt-10">
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={filteredProducts.length}
            onChange={handlePageChange}
          />
        </div>
      </section>
    </>
  );
};

export default ShopPage;
