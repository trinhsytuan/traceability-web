import React from "react";
import "./ChoXetDuyet.scss";
import AuthBase from "@containers/Authenticator/AuthBase";
import BaseContent from "@components/BaseContent";
import { Button } from "antd";
import { URL } from "@url";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import SecuityIcon from "@components/Icons/SecuityIcon";
ChoXetDuyet.propTypes = {};

function ChoXetDuyet(props) {
  return (
    <AuthBase>
      <div className="pending-appoval-container">
        <BaseContent>
          <div className="pending-appoval-content">
            <div className="popup-icon">
              <SecuityIcon />
            </div>
            <div className="popup-title">Tài khoản chờ xét duyệt</div>
            <div className="popup-content">
              Xin lỗi vì bất tiện này! Tài khoản của bạn đang chờ xét duyệt. Chúng tôi sẽ gửi thông báo đến email của
              bạn khi tài khoản được chúng tôi xác nhận.
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

export default ChoXetDuyet;

