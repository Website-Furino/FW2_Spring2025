import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Col, message, Pagination, notification, Row, Input, Select } from "antd";
import axios from "axios";

const ShopPage = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(16);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const nav = useNavigate();

  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:3000/products");
      setProducts(res.data);
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
      fetchCart();
    } catch (err) {
      console.error("Lỗi khi thêm vào giỏ hàng:", err);
      message.error("Không thể thêm vào giỏ hàng.");
    }
  };

  const handlePageChange = (page: number, pageSize: number) => {
    setCurrentPage(page);
    setPageSize(pageSize);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    setCurrentPage(1);
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory
      ? product.categoryName.toLowerCase() === selectedCategory.toLowerCase()
      : true;
    return matchesSearch && matchesCategory;
  });

  const startIndex = (currentPage - 1) * pageSize;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + pageSize);

  return (
    <section className="max-w-7xl mx-auto p-4">
      <h2 className="text-medium text-[40px] border-b border-[#000] mb-[57px] pb-5">
        Tất cả sản phẩm
      </h2>

      <div className="mb-4 flex gap-4">
        <Input
          placeholder="Tìm kiếm sản phẩm..."
          value={searchTerm}
          onChange={handleSearch}
          className="max-w-xs"
        />
        <Select
          placeholder="Chọn danh mục"
          onChange={handleCategoryChange}
          value={selectedCategory}
          className="min-w-[200px]"
          allowClear
        >
          {[...new Set(products.map((product) => product.categoryName))].map(
            (category) => (
              <Select.Option key={category} value={category}>
                {category}
              </Select.Option>
            )
          )}
        </Select>
      </div>

      <Row gutter={[16, 16]}>
        {paginatedProducts.map((product) => (
          <Col key={product.id} xs={24} sm={12} md={8} lg={6}>
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
          </Col>
        ))}
      </Row>

      <div className="flex justify-center mt-10">
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={filteredProducts.length}
          onChange={handlePageChange}
          showSizeChanger
          pageSizeOptions={["8", "16", "24"]}
        />
      </div>
    </section>
  );
};

export default ShopPage;