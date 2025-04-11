import { useState, useEffect } from "react";
import { Row, Col, Card, Statistic, Table, Image, Select } from "antd";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import dayjs from "dayjs";

const { Option } = Select;

// ================== INTERFACES ==================

interface CartItem {
  name: string;
  imageUrl: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  date: string;
  totalPrice: string;
  status: string;
  cartItems: CartItem[];
}

interface Product {
  key: string;
  name: string;
  imageUrl: string;
  quantity: number;
}

interface SalesData {
  name: string;
  total: number;
  orderCount: number;
}

// ================== COMPONENT ==================

const Dashboard = () => {
  const [orderData, setOrderData] = useState<Order[]>([]);
  const [topProducts, setTopProducts] = useState<Product[]>([]);
  const [filterType, setFilterType] = useState<"day" | "month" | "year">("day");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:3000/orders");
        const data: Order[] = response.data;
        setOrderData(data);

        const successfulOrders = data.filter(
          (order) => order.status === "Đã giao thành công"
        );

        const productSales: { [key: string]: Omit<Product, "key"> } =
          successfulOrders.reduce((result, order) => {
            order.cartItems.forEach((product) => {
              if (!result[product.name]) {
                result[product.name] = {
                  name: product.name,
                  imageUrl: product.imageUrl,
                  quantity: 0,
                };
              }
              result[product.name].quantity += product.quantity;
            });
            return result;
          }, {} as { [key: string]: Omit<Product, "key"> });

        const topSellingProducts: Product[] = Object.keys(productSales).map(
          (productName) => ({
            key: productName,
            name: productSales[productName].name,
            imageUrl: productSales[productName].imageUrl,
            quantity: productSales[productName].quantity,
          })
        );

        setTopProducts(
          topSellingProducts.sort((a, b) => b.quantity - a.quantity).slice(0, 5)
        );
      } catch (error) {
        console.error("Có lỗi khi lấy dữ liệu đơn hàng:", error);
      }
    };

    fetchData();
  }, []);

  const createDateList = (startDate: any, endDate: any) => {
    let dates: string[] = [];
    let currentDate = startDate;
    while (
      currentDate.isBefore(endDate) ||
      currentDate.isSame(endDate, "day")
    ) {
      dates.push(currentDate.format("YYYY-MM-DD"));
      currentDate = currentDate.add(1, "day");
    }
    return dates;
  };

  const groupByDate = (orders: Order[]) => {
    return orders.reduce((result, order) => {
      const date = dayjs(order.date).format("YYYY-MM-DD");
      if (!result[date]) result[date] = { total: 0, count: 0 };
      result[date].total += parseFloat(order.totalPrice);
      result[date].count += 1;
      return result;
    }, {} as { [key: string]: { total: number; count: number } });
  };

  const groupByMonth = (orders: Order[]) => {
    return orders.reduce((result, order) => {
      const month = dayjs(order.date).format("YYYY-MM");
      if (!result[month]) result[month] = { total: 0, count: 0 };
      result[month].total += parseFloat(order.totalPrice);
      result[month].count += 1;
      return result;
    }, {} as { [key: string]: { total: number; count: number } });
  };

  const groupByYear = (orders: Order[]) => {
    return orders.reduce((result, order) => {
      const year = dayjs(order.date).format("YYYY");
      if (!result[year]) result[year] = { total: 0, count: 0 };
      result[year].total += parseFloat(order.totalPrice);
      result[year].count += 1;
      return result;
    }, {} as { [key: string]: { total: number; count: number } });
  };

  const dailySales = groupByDate(orderData);
  const monthlySales = groupByMonth(orderData);
  const yearlySales = groupByYear(orderData);

  const dailySalesData = (): SalesData[] => {
    const allDates = createDateList(dayjs("2025-01-01"), dayjs());
    return allDates.map((date) => ({
      name: date,
      total: dailySales[date]?.total || 0,
      orderCount: dailySales[date]?.count || 0,
    }));
  };

  const monthlySalesData = (): SalesData[] => {
    const allMonths: string[] = [];
    const startMonth = dayjs("2025-01");
    const endMonth = dayjs();
    let currentMonth = startMonth;

    while (
      currentMonth.isBefore(endMonth) ||
      currentMonth.isSame(endMonth, "month")
    ) {
      allMonths.push(currentMonth.format("YYYY-MM"));
      currentMonth = currentMonth.add(1, "month");
    }

    return allMonths.map((month) => ({
      name: month,
      total: monthlySales[month]?.total || 0,
      orderCount: monthlySales[month]?.count || 0,
    }));
  };

  const yearlySalesData = (): SalesData[] => {
    const allYears: string[] = [];
    const startYear = dayjs("2025");
    const endYear = dayjs();
    let currentYear = startYear;

    while (
      currentYear.isBefore(endYear) ||
      currentYear.isSame(endYear, "year")
    ) {
      allYears.push(currentYear.format("YYYY"));
      currentYear = currentYear.add(1, "year");
    }

    return allYears.map((year) => ({
      name: year,
      total: yearlySales[year]?.total || 0,
      orderCount: yearlySales[year]?.count || 0,
    }));
  };

  const productColumns = [
    {
      title: "#",
      dataIndex: "imageUrl",
      key: "imageUrl",
      render: (imageUrl: string) => (
        <Image
          src={imageUrl}
          alt="Sản phẩm"
          style={{ width: "50px", height: "50px", objectFit: "cover" }}
        />
      ),
    },
    {
      title: "Sản Phẩm",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Số Lượng Bán",
      dataIndex: "quantity",
      key: "quantity",
    },
  ];

  return (
    <div style={{ padding: "24px" }}>
      <Row gutter={24} style={{ marginBottom: 24 }}>
        <Col span={8}>
          <Select
            defaultValue="day"
            style={{ width: "100%" }}
            onChange={(value) =>
              setFilterType(value as "day" | "month" | "year")
            }
          >
            <Option value="day">Theo Ngày</Option>
            <Option value="month">Theo Tháng</Option>
            <Option value="year">Theo Năm</Option>
          </Select>
        </Col>
      </Row>

      <Row gutter={24}>
        <Col span={8}>
          <Card>
            <Statistic
              title="Tổng Doanh Thu"
              value={
                orderData.reduce(
                  (acc, order) => acc + parseFloat(order.totalPrice),
                  0
                ) || 0
              }
              precision={2}
              prefix="₫"
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic title="Số Đơn Hàng" value={orderData.length || 0} />
          </Card>
        </Col>
      </Row>

      <Row gutter={24} style={{ marginTop: 24 }}>
        <Col span={24}>
          <Card
            title={`Doanh Thu ${
              filterType === "day"
                ? "Theo Ngày"
                : filterType === "month"
                ? "Theo Tháng"
                : "Theo Năm"
            }`}
          >
            <ResponsiveContainer width="100%" height={400}>
              <LineChart
                data={
                  filterType === "day"
                    ? dailySalesData()
                    : filterType === "month"
                    ? monthlySalesData()
                    : yearlySalesData()
                }
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="total" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      <Row gutter={24} style={{ marginTop: 24 }}>
        <Col span={24}>
          <Card title="Sản Phẩm Bán Chạy">
            <Table
              columns={productColumns}
              dataSource={topProducts}
              rowKey="key"
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
