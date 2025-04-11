import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
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
  Image,
} from "antd";

const { Title, Text } = Typography;

const ProductDetail = () => {
  const [product, setProduct] = useState<any | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`http://localhost:3000/products/${id}`)
      .then((response) => {
        setProduct(response.data);
        setLoading(false);

        const categoryName = response.data.categoryName;
        if (categoryName) {
          axios
            .get(
              `http://localhost:3000/products?categoryName=${encodeURIComponent(
                categoryName
              )}`
            )
            .then((res) => {
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
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (!user.id) {
      notification.error({
        message: "Bạn cần đăng nhập để thêm vào giỏ hàng",
        description: "Vui lòng đăng nhập để tiếp tục.",
      });
      navigate("/login");
      return;
    }

    if (quantity < 1 || quantity > product.stock) {
      notification.error({
        message: "Số lượng không hợp lệ",
        description: `Vui lòng chọn số lượng từ 1 đến ${product.stock}.`,
      });
      return;
    }

    axios
      .get(`http://localhost:3000/carts?userId=${user.id}&productId=${product.id}`)
      .then((res) => {
        const existingCartItem = res.data[0];
        const currentQty = existingCartItem ? existingCartItem.quantity : 0;
        const totalQty = currentQty + quantity;

        if (totalQty > product.stock) {
          notification.error({
            message: "Vượt quá số lượng tồn kho",
            description: `Bạn chỉ có thể thêm tối đa ${
              product.stock - currentQty
            } sản phẩm nữa vào giỏ.`,
          });
          return;
        }

        if (existingCartItem) {
          axios
            .patch(`http://localhost:3000/carts/${existingCartItem.id}`, {
              quantity: totalQty,
            })
            .then(() => {
              notification.success({
                message: "Cập nhật giỏ hàng thành công",
                description: `${product.name} đã được cập nhật số lượng.`,
              });
            });
        } else {
          const cartItem = {
            userId: user.id,
            productId: product.id,
            name: product.name,
            price: product.price,
            quantity,
            imageUrl: product.imageUrl,
          };

          axios.post("http://localhost:3000/carts", cartItem).then(() => {
            notification.success({
              message: "Thêm vào giỏ hàng thành công",
              description: `${product.name} đã được thêm vào giỏ hàng.`,
            });
          });
        }
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
      <div className="flex items-center justify-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <h3 className="text-red-500">{error}</h3>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <h3 className="text-gray-500">Không tìm thấy sản phẩm</h3>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Row gutter={[32, 32]} className="mb-12">
        <Col xs={24} md={12}>
          <Card
            hoverable
            className="overflow-hidden rounded-lg shadow-lg"
            cover={
              <Image
                alt={product.name}
                src={product.imageUrl}
                className="object-cover w-full"
              />
            }
          />
        </Col>
        <Col xs={24} md={12}>
          <Card className="rounded-lg shadow-md">
            <Title level={2} className="mb-4">
              {product.name}
            </Title>
            <Text className="text-2xl font-bold text-yellow-600 block mb-6">
              {product.price.toLocaleString()} VND
            </Text>
            <Descriptions
              title="Thông tin chi tiết sản phẩm"
              bordered
              column={1}
              className="mb-6"
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
              <Descriptions.Item label="Danh mục">
                {product.categoryName}
              </Descriptions.Item>
            </Descriptions>
            <div className="mb-6">
              <Text className="block mb-2">Số lượng:</Text>
              <InputNumber
                min={1}
                max={product.stock}
                value={quantity}
                onChange={(value) => setQuantity(value || 1)}
                className="w-full"
              />
            </div>
            <Button
              type="primary"
              size="large"
              onClick={handleAddToCart}
              className="w-full h-12 text-lg font-bold bg-yellow-600 hover:bg-yellow-700 border-yellow-600 hover:border-yellow-700"
            >
              Thêm vào giỏ hàng
            </Button>
          </Card>
        </Col>
      </Row>

      <div className="mt-12">
        <Title level={3} className="mb-6">
          Sản phẩm liên quan
        </Title>
        <Row gutter={[16, 16]}>
          {relatedProducts.map((product) => (
            <Col xs={24} sm={12} md={8} lg={6} key={product.id}>
              <div className="bg-gray-50 rounded-lg overflow-hidden shadow-md">
                <div className="relative group h-80">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover transition duration-300 group-hover:opacity-75"
                  />
                  {product.noibat && (
                    <span className="absolute top-4 left-4 bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Nổi bật
                    </span>
                  )}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black bg-opacity-50">
                    <button
                      className="bg-white text-yellow-600 font-semibold py-3 px-6 rounded-md transform hover:scale-105 transition-transform"
                      onClick={() => navigate(`/shop/${product.id}`)}
                    >
                      Xem chi tiết
                    </button>
                  </div>
                </div>
                <div className="p-4">
                  <Link
                    to={`/shop/${product.id}`}
                    className="block text-xl font-semibold mb-2 hover:text-yellow-600 transition-colors"
                  >
                    {product.name.length > 20
                      ? `${product.name.substring(0, 20)}...`
                      : product.name}
                  </Link>
                  <div className="text-yellow-600 font-semibold">
                    {product.price.toLocaleString()}
                    <sup>đ</sup>
                  </div>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
};

export default ProductDetail;