import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  Button,
  Descriptions,
  Spin,
  Row,
  Col,
  Card,
  Typography,
  InputNumber,
  notification,
} from "antd";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Link } from "react-router-dom";

const { Title, Text } = Typography;

const ProductDetail = () => {
  const [product, setProduct] = useState<any | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1); // Số lượng mặc định là 1
  const { id } = useParams(); // Lấy ID sản phẩm từ URL

  useEffect(() => {
    // Lấy dữ liệu sản phẩm
    axios
      .get(`http://localhost:3000/products/${id}`)
      .then((response) => {
        // console.log("Product data:", response.data); // Kiểm tra thông tin sản phẩm
        setProduct(response.data);
        setLoading(false);

        const categoryName = response.data.categoryName;
        if (categoryName) {
          // Lọc sản phẩm liên quan theo category
          axios
            .get(
              `http://localhost:3000/products?categoryName=${encodeURIComponent(
                categoryName
              )}`
            )
            .then((res) => {
              // Lọc các sản phẩm khác ngoài sản phẩm hiện tại
              setRelatedProducts(
                res.data.filter((p: any) => p.id !== response.data.id)
              );
            })
            .catch(() => {
              setError("Không thể tải sản phẩm liên quan.");
            });
        } else {
          setError("Không tìm thấy danh mục cho sản phẩm này.");
        }
      })
      .catch((error) => {
        console.error("Lỗi khi lấy dữ liệu sản phẩm:", error);
        setError("Không thể tải thông tin sản phẩm. Vui lòng thử lại sau.");
        setLoading(false);
      });
  }, [id]);

  const handleAddToCart = () => {
    // Kiểm tra số lượng
    if (quantity < 1 || quantity > product.stock) {
      notification.error({
        message: "Số lượng không hợp lệ",
        description: `Vui lòng chọn số lượng từ 1 đến ${product.stock}.`,
      });
      return;
    }

    // Tạo đối tượng sản phẩm trong giỏ hàng
    const cartItem = {
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity,
      imageUrl: product.imageUrl,
    };

    // Gửi yêu cầu thêm vào giỏ hàng
    axios
      .post("http://localhost:3000/carts", cartItem)
      .then(() => {
        notification.success({
          message: "Thêm vào giỏ hàng thành công",
          description: `${product.name} đã được thêm vào giỏ hàng.`,
        });
      })
      .catch(() => {
        notification.error({
          message: "Lỗi khi thêm vào giỏ hàng",
          description: "Có lỗi xảy ra, vui lòng thử lại.",
        });
      });
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <h3>{error}</h3>
      </div>
    );
  }

  if (!product) {
    return <div>Không tìm thấy sản phẩm</div>;
  }

  return (
    <div style={{ padding: "40px" }}>
      <Row gutter={32}>
        <Col span={12} style={{ textAlign: "center" }}>
          <Card
            hoverable
            cover={
              <img
                alt={product.name}
                src={product.imageUrl}
                style={{ width: "100%", height: "auto" }}
              />
            }
            style={{
              boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
              borderRadius: "10px",
            }}
          />
        </Col>

        <Col span={12}>
          <Card
            bordered={false}
            bodyStyle={{ padding: "24px" }}
            style={{
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
              borderRadius: "10px",
            }}
          >
            <Title level={2}>{product.name}</Title>
            <Text strong style={{ fontSize: "24px", color: "#CA8A04" }}>
              {product.price.toLocaleString()} VND
            </Text>

            <Descriptions
              title="Thông tin chi tiết sản phẩm"
              bordered
              column={1}
              style={{ marginTop: "20px" }}
            >
              <Descriptions.Item label="Kích thước">
                {product.size}
              </Descriptions.Item>
              <Descriptions.Item label="Chất liệu">
                {product.material}
              </Descriptions.Item>
              <Descriptions.Item label="Nổi bật">
                {product.noibat ? "Có" : "Không"}
              </Descriptions.Item>
              {/* Hiển thị danh mục sản phẩm */}
              <Descriptions.Item label="Danh mục">
                {product.categoryName}
              </Descriptions.Item>
            </Descriptions>

            {/* Số lượng */}
            <div style={{ marginTop: "20px" }}>
              <Text>Số lượng:</Text>
              <InputNumber
                min={1}
                max={product.stock}
                value={quantity}
                onChange={(value) => setQuantity(value || 1)}
                style={{ width: "100%", marginTop: "10px" }}
              />
            </div>

            <div style={{ marginTop: "30px" }}>
              <Button
                type="primary"
                style={{
                  width: "100%",
                  fontSize: "16px",
                  fontWeight: "bold",
                  padding: "14px",
                  borderRadius: "5px",
                  backgroundColor: "#CA8A04",
                  borderColor: "#CA8A04",
                }}
                size="large"
                onClick={handleAddToCart}
              >
                Thêm vào giỏ hàng
              </Button>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Hiển thị sản phẩm liên quan dưới dạng Swiper */}
      <div style={{ marginTop: "50px" }}>
        <Title level={3}>Sản phẩm liên quan</Title>
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
          className="w-full mx-auto"
        >
          {relatedProducts.map((product) => (
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
                      onClick={() => handleAddToCart(product)} // Gọi handleAddToCart khi bấm vào nút
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
      </div>
    </div>
  );
};

export default ProductDetail;
