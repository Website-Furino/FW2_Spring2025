import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, Pagination } from "swiper/modules";
import { message, notification } from "antd";
import axios from "axios";

interface Product {
  id: number | string;
  name: string;
  imageUrl: string;
  price: number;
  stock: number;
}

interface CartItem {
  id?: number | string;
  productId: number|string;
  name: string;
  imageUrl: string;
  price: number;
  userId: number|string;
  quantity: number;
  totalPrice: number;
}

interface Order {
  status: string;
  cartItems: {
    name: string;
    quantity: number;
  }[];
}

interface User {
  id: number|string;
}

const TopSellerPage = () => {
  const [topProducts, setTopProducts] = useState<Product[]>([]);
  const nav = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productsRes = await axios.get("https://json-server-online-8kf1.onrender.com/products");
        const products: Product[] = productsRes.data;

        const productsMap: { [key: string]: Product } = {};
        products.forEach((p: Product) => {
          productsMap[p.name] = p;
        });

        const ordersRes = await axios.get("https://json-server-online-8kf1.onrender.com/orders");
        const orders: Order[] = ordersRes.data;

        const successfulOrders = orders.filter(
          (order: Order) => order.status === "Đã giao thành công"
        );

        const productSalesMap: { [key: string]: Product & { quantity: number } } = {};

        successfulOrders.forEach((order: Order) => {
          order.cartItems.forEach((item: { name: string; quantity: number }) => {
            const productDetails = productsMap[item.name];
            if (productDetails) {
              if (productSalesMap[item.name]) {
                productSalesMap[item.name].quantity += item.quantity;
              } else {
                productSalesMap[item.name] = {
                  ...productDetails,
                  quantity: item.quantity,
                };
              }
            }
          });
        });

        const productSales = Object.values(productSalesMap);
        setTopProducts(
          productSales
            .sort((a, b) => b.quantity - a.quantity)
            .slice(0, 5)
        );
      } catch (err) {
        console.error("Lỗi khi lấy sản phẩm bán chạy:", err);
      }
    };

    fetchData();
  }, []);

  const addToCart = async (product: Product) => {
    const user: User = JSON.parse(localStorage.getItem("user") || "{}");

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
      const latestProduct: Product = res.data;

      if (latestProduct.stock <= 0) {
        notification.error({
          message: "Sản phẩm đã hết hàng!",
          description: "Rất tiếc, sản phẩm này hiện đã hết hàng.",
        });
        return;
      }

      const cartRes = await axios.get("https://json-server-online-8kf1.onrender.com/carts");
      const userCart: CartItem[] = cartRes.data.filter(
        (item: CartItem) => item.userId === user.id
      );
      const existingItem = userCart.find(
        (item: CartItem) => item.productId === product.id
      );
      const existingQty = existingItem ? existingItem.quantity : 0;

      if (existingQty + 1 > latestProduct.stock) {
        notification.warning({
          message: "Vượt quá số lượng tồn kho!",
          description: `Chỉ còn ${
            latestProduct.stock - existingQty
          } sản phẩm có sẵn.`,
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
        const newCartItem: CartItem = {
          productId: product.id,
          name: product.name,
          imageUrl: product.imageUrl,
          price: product.price,
          userId: user.id,
          quantity: 1,
          totalPrice: product.price,
        };
        await axios.post("https://json-server-online-8kf1.onrender.com/carts", newCartItem);
      }

      setTopProducts((prev) =>
        prev.map((p) =>
          p.id === product.id ? { ...p, stock: p.stock - 1 } : p
        )
      );

      message.success("Đã thêm vào giỏ hàng!");
    } catch (error) {
      console.error("Lỗi khi thêm vào giỏ hàng:", error);
      message.error("Không thể thêm vào giỏ hàng.");
    }
  };

  return (
    <section className="max-w-7xl mx-auto p-4">
      <h2 className="text-[40px] text-center mb-8">Sản Phẩm Bán Chạy</h2>

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
        {topProducts.map((product) => (
          <SwiperSlide key={product.id}>
            <div className="bg-[#F4F5F7]">
              <div className="relative group h-80 overflow-hidden">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover transition duration-300 group-hover:opacity-70"
                />
                <span className="absolute top-4 left-4 bg-yellow-500 text-white font-medium px-2 py-1 rounded-full">
                  Bán Chạy
                </span>

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
                  {product.stock < 0 && (
                    <span className="text-red-500 font-medium">Hết hàng</span>
                  )}
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default TopSellerPage;