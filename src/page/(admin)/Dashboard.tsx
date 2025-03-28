import React, { useState } from 'react';
import { Table, Button, Space, Popconfirm, message, Row, Col, Card, Statistic } from 'antd';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import dayjs from 'dayjs'; // Import dayjs để xử lý ngày

const Dashboard = () => {
  // Giả lập dữ liệu đơn hàng với ngày tháng năm
  const orderData = [
    { id: 1, total: 5000, date: '2025-03-01' },
    { id: 2, total: 3000, date: '2025-03-02' },
    { id: 3, total: 7000, date: '2025-03-03' },
    { id: 4, total: 4000, date: '2025-03-01' },
    { id: 5, total: 9000, date: '2025-02-28' },
    { id: 6, total: 6000, date: '2025-02-25' },
  ];

  // Group theo ngày, tháng, năm
  const groupByDate = (data) => {
    return data.reduce((result, order) => {
      const date = dayjs(order.date).format('YYYY-MM-DD'); // Group theo ngày
      if (!result[date]) result[date] = 0;
      result[date] += order.total;
      return result;
    }, {});
  };

  const groupByMonth = (data) => {
    return data.reduce((result, order) => {
      const month = dayjs(order.date).format('YYYY-MM'); // Group theo tháng
      if (!result[month]) result[month] = 0;
      result[month] += order.total;
      return result;
    }, {});
  };

  const groupByYear = (data) => {
    return data.reduce((result, order) => {
      const year = dayjs(order.date).format('YYYY'); // Group theo năm
      if (!result[year]) result[year] = 0;
      result[year] += order.total;
      return result;
    }, {});
  };

  // Các dữ liệu thống kê
  const dailySales = groupByDate(orderData);
  const monthlySales = groupByMonth(orderData);
  const yearlySales = groupByYear(orderData);

  // Biểu đồ và bảng thống kê
  const salesData = [
    { name: '2025-03-01', total: dailySales['2025-03-01'] || 0 },
    { name: '2025-03-02', total: dailySales['2025-03-02'] || 0 },
    { name: '2025-02-28', total: dailySales['2025-02-28'] || 0 },
  ];

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Ngày',
      dataIndex: 'date',
      key: 'date',
      render: (date) => dayjs(date).format('DD/MM/YYYY'), // Hiển thị ngày theo định dạng
    },
    {
      title: 'Doanh Thu',
      dataIndex: 'total',
      key: 'total',
      render: (total) => `₫${total.toLocaleString()}`,
    },
  ];

  const userData = [
    { id: 1, name: 'User 1', email: 'user1@example.com', role: 'Admin' },
    { id: 2, name: 'User 2', email: 'user2@example.com', role: 'User' },
    { id: 3, name: 'User 3', email: 'user3@example.com', role: 'User' },
  ];

  return (
    <div style={{ padding: '24px' }}>
      {/* Thống kê tổng doanh thu */}
      <Row gutter={24}>
        <Col span={8}>
          <Card>
            <Statistic
              title="Tổng Doanh Thu"
              value={orderData.reduce((acc, order) => acc + order.total, 0)}
              precision={2}
              prefix="₫"
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic title="Số Đơn Hàng" value={orderData.length} />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic title="Khách Hàng Mới" value={userData.length} />
          </Card>
        </Col>
      </Row>

      {/* Biểu đồ doanh thu theo ngày */}
      <Row gutter={24} style={{ marginTop: 24 }}>
        <Col span={24}>
          <Card title="Doanh Thu Theo Ngày">
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={salesData}>
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

      {/* Bảng doanh thu theo ngày */}
      <Row gutter={24} style={{ marginTop: 24 }}>
        <Col span={24}>
          <Card title="Doanh Thu Theo Ngày">
            <Table
              columns={columns}
              dataSource={salesData}
              rowKey="id"
            />
          </Card>
        </Col>
      </Row>

      {/* Thống kê theo tháng */}
      <Row gutter={24} style={{ marginTop: 24 }}>
        <Col span={24}>
          <Card title="Doanh Thu Theo Tháng">
            <ul>
              {Object.keys(monthlySales).map((month) => (
                <li key={month}>{month}: ₫{monthlySales[month].toLocaleString()}</li>
              ))}
            </ul>
          </Card>
        </Col>
      </Row>

      {/* Thống kê theo năm */}
      <Row gutter={24} style={{ marginTop: 24 }}>
        <Col span={24}>
          <Card title="Doanh Thu Theo Năm">
            <ul>
              {Object.keys(yearlySales).map((year) => (
                <li key={year}>{year}: ₫{yearlySales[year].toLocaleString()}</li>
              ))}
            </ul>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
