import React, { useState, useEffect } from "react";
import { Row, Col, Card, Statistic, Table, Image } from "antd";
import axios from "axios"; // Import axios
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"; // Import recharts
import dayjs from "dayjs"; // Import dayjs

const Dashboard = () => {
  const [orderData, setOrderData] = useState([]); // State để lưu trữ dữ liệu đơn hàng
  const [topProducts, setTopProducts] = useState([]); // State để lưu trữ sản phẩm bán chạy

  useEffect(() => {
    // Lấy dữ liệu đơn hàng
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:3000/orders");
        const data = response.data;
        console.log(data);

        setOrderData(data); // Lưu dữ liệu vào state

        // Lọc đơn hàng đã giao thành công
        const successfulOrders = data.filter(
          (order) => order.status === "Đã giao thành công"
        );

        // Tính toán sản phẩm bán chạy theo tên sản phẩm
        const productSales = successfulOrders.reduce((result, order) => {
          order.cartItems.forEach((product) => {
            // Kiểm tra nếu sản phẩm đã tồn tại trong result, nếu có thì cộng dồn số lượng
            if (!result[product.name]) {
              result[product.name] = {
                name: product.name,
                quantity: 0,
                imageUrl: product.imageUrl,
              };
            }
            result[product.name].quantity += product.quantity; // Cộng dồn số lượng sản phẩm theo tên
          });
          return result;
        }, {});

        // Chuyển dữ liệu sản phẩm bán chạy thành một mảng
        const topSellingProducts = Object.keys(productSales).map(
          (productName) => ({
            key: productName,
            name: productSales[productName].name,
            imageUrl: productSales[productName].imageUrl,
            quantity: productSales[productName].quantity,
          })
        );
        console.log(topSellingProducts);

        // Sắp xếp sản phẩm bán chạy theo số lượng
        setTopProducts(
          topSellingProducts.sort((a, b) => b.quantity - a.quantity).slice(0, 5)
        ); // Lấy 5 sản phẩm bán chạy nhất
      } catch (error) {
        console.error("Có lỗi khi lấy dữ liệu đơn hàng:", error);
      }
    };

    fetchData();
  }, []);

  // Nhóm đơn hàng theo ngày, tháng và năm
  const groupByDate = (orders) => {
    return orders.reduce((result, order) => {
      const date = dayjs(order.date).format("YYYY-MM-DD"); // Lấy ngày theo định dạng YYYY-MM-DD
      if (!result[date]) result[date] = { total: 0, count: 0 };
      result[date].total += parseFloat(order.totalPrice);
      result[date].count += 1;
      return result;
    }, {});
  };

  const groupByMonth = (orders) => {
    return orders.reduce((result, order) => {
      const month = dayjs(order.date).format("YYYY-MM"); // Lấy tháng theo định dạng YYYY-MM
      if (!result[month]) result[month] = { total: 0, count: 0 };
      result[month].total += parseFloat(order.totalPrice);
      result[month].count += 1;
      return result;
    }, {});
  };

  const groupByYear = (orders) => {
    return orders.reduce((result, order) => {
      const year = dayjs(order.date).format("YYYY"); // Lấy năm theo định dạng YYYY
      if (!result[year]) result[year] = { total: 0, count: 0 };
      result[year].total += parseFloat(order.totalPrice);
      result[year].count += 1;
      return result;
    }, {});
  };

  const dailySales = groupByDate(orderData);
  const monthlySales = groupByMonth(orderData);
  const yearlySales = groupByYear(orderData);

  // Chuyển dữ liệu thành dạng mà recharts yêu cầu
  const dailySalesData = Object.keys(dailySales).map((date) => ({
    name: date,
    total: dailySales[date].total,
    orderCount: dailySales[date].count,
  }));

  const monthlySalesData = Object.keys(monthlySales).map((month) => ({
    name: month,
    total: monthlySales[month].total,
    orderCount: monthlySales[month].count,
  }));

  const yearlySalesData = Object.keys(yearlySales).map((year) => ({
    name: year,
    total: yearlySales[year].total,
    orderCount: yearlySales[year].count,
  }));

  // Các cột bảng thống kê
  const columns = [
    {
      title: "Thời gian",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Doanh Thu",
      dataIndex: "total",
      key: "total",
      render: (total) => `₫${total.toLocaleString()}`,
    },
    {
      title: "Số Đơn Hàng",
      dataIndex: "orderCount",
      key: "orderCount",
    },
  ];

  // Cột bảng sản phẩm bán chạy
  const productColumns = [
    {
      title: "#",
      dataIndex: "imageUrl",
      key: "imageUrl",
      render: (imageUrl) => (
        <Image
          src={imageUrl}
          alt="Product"
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
      {/* Thống kê tổng doanh thu của các đơn hàng đã giao thành công */}
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

      {/* Thống kê theo ngày */}
      <Row gutter={24} style={{ marginTop: 24 }}>
        <Col span={24}>
          <Card title="Doanh Thu Theo Ngày">
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={dailySalesData}>
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
          <Card title="Doanh Thu Theo Ngày">
            <Table
              columns={columns}
              dataSource={dailySalesData}
              rowKey="name"
            />
          </Card>
        </Col>
      </Row>

      {/* Thống kê theo tháng */}
      <Row gutter={24} style={{ marginTop: 24 }}>
        <Col span={24}>
          <Card title="Doanh Thu Theo Tháng">
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={monthlySalesData}>
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
          <Card title="Doanh Thu Theo Tháng">
            <Table
              columns={columns}
              dataSource={monthlySalesData}
              rowKey="name"
            />
          </Card>
        </Col>
      </Row>

      {/* Thống kê theo năm */}
      <Row gutter={24} style={{ marginTop: 24 }}>
        <Col span={24}>
          <Card title="Doanh Thu Theo Năm">
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={yearlySalesData}>
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
          <Card title="Doanh Thu Theo Năm">
            <Table
              columns={columns}
              dataSource={yearlySalesData}
              rowKey="name"
            />
          </Card>
        </Col>
      </Row>

      {/* Thống kê sản phẩm bán chạy */}
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
