import { Button, Result } from 'antd';
import { Link } from 'react-router-dom';

const ThankYouPage = () => {
  return (
    <div className="thank-you-container" style={{ 
      padding: '50px',
      maxWidth: '100%',
      margin: '0 auto'
    }}>
      <Result
        status="success"
        title={<div style={{ 
          fontSize: 'clamp(20px, 4vw, 24px)',
          textAlign: 'center' 
        }}>Cảm ơn bạn đã đặt hàng!</div>}
        subTitle={<div style={{ 
          fontSize: 'clamp(14px, 3vw, 16px)',
          textAlign: 'center',
          padding: '0 10px'
        }}>Đơn hàng của bạn đã được xử lý thành công. Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất.</div>}
        extra={[
          <Link to="/" key="home" style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
            <Button type="primary" style={{
              fontSize: 'clamp(14px, 3vw, 16px)',
              height: 'auto',
              padding: '8px 20px'
            }}>Quay lại trang chủ</Button>
          </Link>
        ]}
      />
      <style>{`
        .thank-you-container {
          @media (max-width: 768px) {
            padding: 30px !important;
          }
          @media (max-width: 480px) {
            padding: 20px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default ThankYouPage;