import React from 'react';
import { Button, Result } from 'antd';
import { Link } from 'react-router-dom';

const ThankYouPage = () => {
  return (
    <div style={{ padding: '50px' }}>
      <Result
        status="success"
        title="Cảm ơn bạn đã đặt hàng!"
        subTitle="Đơn hàng của bạn đã được xử lý thành công. Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất."
        extra={[
          <Link to="/" key="home">
            <Button type="primary">Quay lại trang chủ</Button>
          </Link>
        ]}
      />
    </div>
  );
};

export default ThankYouPage;
