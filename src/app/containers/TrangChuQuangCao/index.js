import "./TrangChuQuangCao.scss";
import React, { useEffect, useState } from "react";
import { RightOutlined } from "@ant-design/icons";
import IMG_TRUY_XUAT_APP from "@assets/images/imgtruyxuatapp.png";
import LOGO from "@assets/images/logo/auth-logo.svg";
import { URL } from "@url";
import { Button } from "antd";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import LOGO_THTRACING from "@assets/images/LogoTHTracing.png";
import ModalTuVan from "./ModalTuVan";
import { ADVANTAGE_CONTENT } from "@constants";
TrangChuQuangCao.propTypes = {};

function TrangChuQuangCao(props) {
  const [openFormTuVan, setIsOpenFormTuVan] = useState(false);
  const isOpenFormTuVan = () => {
    setIsOpenFormTuVan(!openFormTuVan);
  };
  const history = useHistory();
  return (
    <div className="trang-chu-quang-cao-container">
      <div className="header">
        <img src={LOGO} alt="" />
        <div className="btn-actions">
          <Button className="btn_login_header" onClick={() => history.push(URL.LOGIN)}>
            Đăng nhập
          </Button>
        </div>
      </div>
      <div className="titleSlide">
        <div className="left_slide">
          <div className="left_slide">
            <span className="title-left-slide">Giải pháp phần mềm truy xuất nguồn gốc HĐ - Tracing</span>
            <span>
              <span className="title-left-slide-2">
                HĐ - Tracing là phần mềm truy xuất nguồn gốc của Trường Đại học Hồng Đức, cung cấp giải pháp truy xuất
                nguồn gốc cho doanh nghiệp giúp chống hàng giả, hàng nhái và minh bạch trong quá trình sản xuất.
              </span>
            </span>
          </div>
          <div className="btn-actions">
            <Button className="btn-visit-program" onClick={() => history.push(URL.LOGIN)}>
              Truy cập phần mềm <RightOutlined />
            </Button>
            <Button className="btn-lhtv" onClick={isOpenFormTuVan}>
              Đăng ký tư vấn
            </Button>
          </div>
        </div>
        <div className="right_slide">
          <img src={IMG_TRUY_XUAT_APP} className="img-truy-xuat-app" />
        </div>
      </div>
      <div className="advantage-introduction-container">
        <div className="advantage-title">HĐ - Tracing</div>
        <div className="introduction-advantage-description">
          Phần mềm truy xuất nguồn gốc của trường Đại học Hồng Đức
        </div>
        <div className="advantage-body">
          <div className="advantage-logo-center-responsive">
            <img src={LOGO_THTRACING} />
          </div>
          <div className="advantage-left">
            {ADVANTAGE_CONTENT.map((item, index) => {
              if (item?.position === "left")
                return (
                  <div className="advantage-item" key={index}>
                    <div className="advantage-item-icon">
                      <img src={item?.icon} />
                    </div>
                    <div className="advantage-item-right">
                      <div className="advantage-item-right-top">{item?.title}</div>
                      <div className="advantage-item-right-bottom">{item?.content}</div>
                    </div>
                  </div>
                );
            })}
          </div>
          <div className="advantage-logo-center">
            <img src={LOGO_THTRACING} />
          </div>
          <div className="advantage-left">
            {ADVANTAGE_CONTENT.map((item, index) => {
              if (item?.position === "right")
                return (
                  <div className="advantage-item" key={index}>
                    <div className="advantage-item-icon">
                      <img src={item?.icon} />
                    </div>
                    <div className="advantage-item-right">
                      <div className="advantage-item-right-top">{item?.title}</div>
                      <div className="advantage-item-right-bottom">{item?.content}</div>
                    </div>
                  </div>
                );
            })}
          </div>
        </div>
      </div>
      <div className="homepage-eco-system-container">
        <div className="homepage-eco-system-title">Hệ sinh thái HĐ - Tracing</div>
        <div className="homepage-eco-system-description">
          HĐ - Tracing ứng dụng công nghệ QR Code giúp doanh nghiệp quản lý sản phẩm, kênh phân phối & tương tác hiệu
          quả với người dùng nhằm tăng trải nghiệm khách hàng, tăng hiệu quả kinh doanh cho Doanh nghiệp.
        </div>
        <div className="youtube-eco-system-video">
        <iframe  src="https://www.youtube.com/embed/8JrcL-0cPik" title="Truy xuất nguồn gốc thực phẩm qua QR code| VTV24" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
        </div>
      </div>
      <ModalTuVan onOpen={openFormTuVan} setIsOpen={isOpenFormTuVan} />
    </div>
  );
}

export default TrangChuQuangCao;
