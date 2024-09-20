import React from 'react';
import './DangKyThanhCong.scss';
import AuthBase from '@containers/Authenticator/AuthBase';
import BaseContent from '@components/BaseContent';
import IconVerifyLarge from '@components/Icons/IconVerifyLarge';
import { Button } from 'antd';
import { URL } from '@url';
import { Link } from 'react-router-dom/cjs/react-router-dom.min';

DangKyThanhCong.propTypes = {};

function DangKyThanhCong(props) {
  return (
    <AuthBase>
      <div className="pending-appoval-container">
        <BaseContent>
          <div className="pending-appoval-content">
            <div className="popup-icon">
              <IconVerifyLarge />
            </div>
            <div className="popup-title">Đăng ký thành công</div>
            <div className="popup-content">
              Rất cám ơn bạn! Yêu cầu đăng ký của bạn đã được tiếp nhận và xử lý. Chúng tôi sẽ gửi thông báo đến Email
              của bạn khi tài khoản được hệ thống xác nhận thông tin.
            </div>
            <Link to={URL.LOGIN}>
              <Button type="primary" className="btn_redirect">
                Đồng ý
              </Button>
            </Link>
          </div>
        </BaseContent>
      </div>
    </AuthBase>
  );
}

export default DangKyThanhCong;

