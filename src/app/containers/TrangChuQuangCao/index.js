import "./TrangChuQuangCao.scss";
import React, { useState } from "react";
import { RightOutlined } from "@ant-design/icons";
import IMG_TRUY_XUAT_APP from "@assets/images/imgtruyxuatapp.png";
import LOGO from "@assets/images/logo/auth-logo.svg";
import { URL } from "@url";
import { Button } from "antd";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import LOGO_THTRACING from "@assets/images/LogoTHTracing.png";
import ModalTuVan from "./ModalTuVan";
import { ADVANTAGE_CONTENT } from "@constants";
import QR_CODE_IMG from "@assets/images/icon/qrCodeItem.svg";
import REVIEW_IMG from "@assets/images/icon/reviewIcon.svg";
import USER_ICON from "@assets/images/icon/userIcon.svg";
import BOX_IMG from "@assets/images/icon/boxIcon.svg";
import IMG_THANHLONG from "@assets/images/icon/imgThanhLong.png";
import SAVE_ICON from "@assets/images/icon/saveIcon.svg";
import MARKETING_ICON from "@assets/images/icon/marketingIcon.svg";
import FOCUS_ICON from "@assets/images/icon/focusImage.svg";
import SOLUTION_IMAGE from "@assets/images/icon/solutionLeftImage.png";
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
          <iframe
            src="https://www.youtube.com/embed/8JrcL-0cPik"
            title="Truy xuất nguồn gốc thực phẩm qua QR code| VTV24"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerpolicy="strict-origin-when-cross-origin"
            allowfullscreen
          ></iframe>
        </div>
      </div>
      <div className="txng-mobile-container">
        <div className="txng-mobile-container-left">
          <div className="txng-mobile-tagname">HĐ - Tracing Mobile</div>
          <div className="txng-mobile-description">Ứng dụng truy xuất nguồn gốc HĐ - Tracing phiên bản di động</div>
          <div className="txng-mobile-feature">
            <div className="txng-mobile-feature-item">
              <div className="txng-mobile-feature-item-left">
                <img src={BOX_IMG} />
              </div>
              <div className="txng-mobile-feature-item-right">
                <span className="txng-mobile-feature-item-right-top">100 SKU</span>
                <span className="txng-mobile-feature-item-right-bottom">Sản phẩm đã có thông tin trên ứng dụng</span>
              </div>
            </div>
            <div className="txng-mobile-feature-item">
              <div className="txng-mobile-feature-item-left">
                <img src={USER_ICON} />
              </div>
              <div className="txng-mobile-feature-item-right">
                <span className="txng-mobile-feature-item-right-top">100+</span>
                <span className="txng-mobile-feature-item-right-bottom">Lượt quét mã</span>
              </div>
            </div>
            <div className="txng-mobile-feature-item">
              <div className="txng-mobile-feature-item-left">
                <img src={QR_CODE_IMG} />
              </div>
              <div className="txng-mobile-feature-item-right">
                <span className="txng-mobile-feature-item-right-top">100</span>
                <span className="txng-mobile-feature-item-right-bottom">Lượt tải ứng dụng</span>
              </div>
            </div>
            <div className="txng-mobile-feature-item">
              <div className="txng-mobile-feature-item-left">
                <img src={REVIEW_IMG} />
              </div>
              <div className="txng-mobile-feature-item-right">
                <span className="txng-mobile-feature-item-right-top">100+</span>
                <span className="txng-mobile-feature-item-right-bottom">Lượt đánh giá sản phẩm</span>
              </div>
            </div>
          </div>
          <div className="txng-mobile-feature-left-app">
            <div className="txng-mobile-feature-left-app-left">
              <img src={LOGO_THTRACING} width={84} height={77} />
            </div>
            <div className="txng-mobile-feature-left-app-right">
              <span className="txng-mobile-feature-left-app-right-top">
                HĐ - Tracing Mobile là ứng dụng cho người dùng và doanh nghiệp.
              </span>
              <span className="txng-mobile-feature-left-app-right-bottom">
                Hỗ trợ truyền thông thương hiệu doanh nghiệp đến hàng triệu người dùng sử dụng ứng dụng.
              </span>
            </div>
          </div>
        </div>
        <div className="txng-mobile-container-right">
          <img src={IMG_THANHLONG} />
        </div>
      </div>
      <div className="solutions-container">
        <div className="solutions-title">HĐ - Tracing Solutions</div>
        <div className="solutions-pp">Bộ giải pháp toàn diện cho doanh nghiệp sản xuất, phân phối</div>
        <div className="solutions-bottom">
          <div className="solutions-left-bottom">
            <img src={SOLUTION_IMAGE} />
          </div>
          <div className="solutions-right-bottom">
            <div className="solutions-right-item">
              <div className="solutions-right-left-item">
                <img src={FOCUS_ICON} />
              </div>
              <div className="solutions-right-right-item">
                <div className="solutions-right-right-top-item">
                  <span>Giải quyết ĐA DẠNG vấn đề trong quản lý sản phẩm</span>
                </div>
                <div className="solutions-right-right-bottom-item">
                  <ul>
                    <li>Hàng giả, hàng nhái</li>
                    <li>Bảo hành sản phẩm</li>
                    <li>Quản lí đường đi sản phẩm, tràn hàng lấn tuyến phân phối</li>
                    <li>Gian lận tại kênh phân phối</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="solutions-right-item">
              <div className="solutions-right-left-item">
                <img src={SAVE_ICON} />
              </div>
              <div className="solutions-right-right-item">
                <div className="solutions-right-right-top-item">
                  <span>Số hóa hoạt động marketing</span>
                </div>
                <div className="solutions-right-right-bottom-item">
                  <ul>
                    <li>Kết nối trực tiếp doanh nghiệp - nhà phân phối - người tiêu dùng</li>
                    <li>Nhận bình luận và đánh giá của người dùng dành cho sản phẩm</li>
                    <li>Thu thập dữ liệu khách hàng quét mã theo thời gian thực</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="solutions-right-item">
              <div className="solutions-right-left-item">
                <img src={SAVE_ICON} />
              </div>
              <div className="solutions-right-right-item">
                <div className="solutions-right-right-top-item">
                  <span>Tích hợp dễ dàng - Tiết kiệm chi phí</span>
                </div>
                <div className="solutions-right-right-bottom-item-span">
                Các giải pháp dễ dàng tùy biến, sử dụng độc lập hoặc tích hợp trên cùng 1 con tem theo nhu cầu của doanh nghiệp, nhờ vậy giúp tiết kiệm chi phí và vận hành hiệu quả hơn.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ModalTuVan onOpen={openFormTuVan} setIsOpen={isOpenFormTuVan} />
    </div>
  );
}

export default TrangChuQuangCao;
