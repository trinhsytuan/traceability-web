import "./TrangChuQuangCao.scss";
import React, { useRef, useState } from "react";
import { RightOutlined } from "@ant-design/icons";
import IMG_TRUY_XUAT_APP from "@assets/images/imgtruyxuatapp.png";
import LOGO from "@assets/images/logo/logo.svg";
import { URL } from "@url";
import { Button, Image } from "antd";
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
import GOOGLE_PLAY from "@assets/icons/google-play-small.svg";
import APP_STORE from "@assets/icons/app-store-small.svg";
import MARKETING_ICON from "@assets/images/icon/marketingIcon.svg";
import FOCUS_ICON from "@assets/images/icon/focusImage.svg";
import SOLUTION_IMAGE from "@assets/images/icon/solutionLeftImage.png";
import SOLUTION_ICON from "@assets/images/SvgIcons/solutionIcon.svg";
import HOTLINE_ICON from "@assets/images/SvgIcons/hotlineIcon.svg";
import STAMP_ICON from "@assets/images/SvgIcons/stampIcon.svg";
import "swiper/components/navigation/navigation.min.css";
import "swiper/components/pagination/pagination.min.css";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper.min.css";
import ANH_TXNG_1 from "@assets/images/anhTruyXuatSP1.png";
import ANH_TXNG_2 from "@assets/images/anhTruyXuatSP2.png";
import ANH_TXNG_3 from "@assets/images/anhTruyXuatSP3.png";
import ANH_TXNG_4 from "@assets/images/anhTruyXuatSP4.png";
import ANH_TXNG_5 from "@assets/images/anhTruyXuatSP5.png";
import ANH_TXNG_6 from "@assets/images/anhTruyXuatSP6.png";
TrangChuQuangCao.propTypes = {};

function TrangChuQuangCao(props) {
  const swiperRef = useRef(null);
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
          <Button className="btn-lhtv" onClick={isOpenFormTuVan}>
            Đăng ký tư vấn
          </Button>
        </div>
      </div>
      <div className="titleSlide">
        <div className="left_slide">
          <div className="left_slide">
            <div className="advantage-introduction-container">
              <div className="advantage-title">HĐ - Tracing</div>
              <div className="introduction-advantage-description">
                Phần mềm truy xuất nguồn gốc của trường Đại học Hồng Đức
              </div>
              <div className="advantage-body">
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
          </div>
          <div className="btn-actions"></div>
        </div>
        <div className="right_slide" onMouseEnter={() => swiperRef.current.autoplay.stop()}>
          <Swiper
            onSwiper={(swiper) => (swiperRef.current = swiper)}
            className="slider-left"
            loop={true}
            autoplay={{ delay: 2000, disableOnInteraction: false }}
          >
            <SwiperSlide key={1}>
              <img
                className="img_slide_top"
                src={ANH_TXNG_1}
                width={"100%"}
                style={{ objectFit: "cover", borderRadius: "10px" }}
                height={"auto"}
              />
            </SwiperSlide>
            <SwiperSlide key={2}>
              <img
                className="img_slide_top"
                src={ANH_TXNG_2}
                width={"100%"}
                height={"auto"}
                style={{ objectFit: "cover", borderRadius: "10px" }}
              />
            </SwiperSlide>
            <SwiperSlide key={3}>
              <img
                className="img_slide_top"
                src={ANH_TXNG_3}
                width={"100%"}
                height={"auto"}
                style={{ objectFit: "cover", borderRadius: "10px" }}
              />
            </SwiperSlide>

            <SwiperSlide key={4}>
              <img
                className="img_slide_top"
                src={ANH_TXNG_4}
                width={"100%"}
                style={{ objectFit: "cover", borderRadius: "10px" }}
                height={"auto"}
              />
            </SwiperSlide>
            <SwiperSlide key={5}>
              <img
                className="img_slide_top"
                src={ANH_TXNG_5}
                width={"100%"}
                style={{ objectFit: "cover", borderRadius: "10px" }}
                height={"auto"}
              />
            </SwiperSlide>
            <SwiperSlide key={6}>
              <img
                className="img_slide_top"
                src={ANH_TXNG_6}
                width={"100%"}
                style={{ objectFit: "cover", borderRadius: "10px" }}
                height={"auto"}
              />
            </SwiperSlide>
          </Swiper>
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
                <img src={MARKETING_ICON} />
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
                  Các giải pháp dễ dàng tùy biến, sử dụng độc lập hoặc tích hợp trên cùng 1 con tem theo nhu cầu của
                  doanh nghiệp, nhờ vậy giúp tiết kiệm chi phí và vận hành hiệu quả hơn.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="circle-ad-container">
        <div className="circle-ad-item">
          <span className="circle-ad-item-title">Các giải pháp tiêu biểu</span>
          <span className="circle-ad-item-desciption">
            Tất cả các giải pháp đều được liên kết chặt chẽ với nhau, dễ dàng sử dụng trên máy tính và thiết bị Mobile
          </span>
          <img src={SOLUTION_ICON} className="solutions-mobile-show" />
          <div className="circle-ad-body">
            <div className="circle-ad-left">
              <div className="circle-ad-item1">
                <div className="circle-ad-item1-title">Minh bạch thông tin bằng công nghệ Blockchain</div>
                <div className="circle-ad-item1-desciption">
                  Sản phẩm sử dụng công nghệ Blockchain giúp minh bạch sản phẩm, dữ liệu không thể sửa hoặc thay đổi
                </div>
              </div>
              <div className="circle-ad-item1">
                <div className="circle-ad-item1-title">QR Code Chống giả</div>
                <div className="circle-ad-item1-desciption">
                  Cảnh báo và xác thực hàng thật / giả thông qua QR Code, SMS chỉ với 1 mã duy nhất trên mỗi đơn vị sản
                  phẩm.
                </div>
              </div>
              <div className="circle-ad-item1">
                <div className="circle-ad-item1-title">Kết nối doanh nghiệp với nhà kiểm định</div>
                <div className="circle-ad-item1-desciption">
                  Hỗ trợ kết nối doanh nghiệp với các nhà kiểm định kiểm định sản phẩm
                </div>
              </div>
            </div>
            <div className="circle-ad-mid">
              <img src={SOLUTION_ICON} className="solutions-mobile-hidden" />
              <div className="hidden-solutions">
                <div className="circle-ad-item1 left-solutions">
                  <p className="circle-ad-item1-title ">QR Code Truy xuất nguồn gốc</p>
                  <div className="circle-ad-item1-desciption" style={{ textAlign: "left" }}>
                    Giải pháp dành cho nhà doanh nghiệp, các hợp tác xã thực hiện truy xuất nguồn gốc sản phẩm theo tiêu
                    chuẩn quốc gia.
                  </div>
                </div>
              </div>
            </div>
            <div className="circle-ad-right">
              <div className="circle-ad-item1 left-solutions">
                <div className="circle-ad-item1-title">QR Code Bảo hành điện tử</div>
                <div className="circle-ad-item1-desciption" style={{ textAlign: "left" }}>
                  Số hóa quy trình bảo hành thông qua QR Code duy nhất trên mỗi đơn vị sản phẩm.
                </div>
              </div>
              <div className="circle-ad-item1 left-solutions">
                <div className="circle-ad-item1-title">Hỗ trợ quản lý lô hàng</div>
                <div className="circle-ad-item1-desciption" style={{ textAlign: "left" }}>
                  Giúp các doanh nghiệp quản lý lô hàng xuất ra thị trường theo số lượng của lô hàng.
                </div>
              </div>
              <div className="circle-ad-item1 left-solutions">
                <div className="circle-ad-item1-title">Hỗ trợ quản lý sản phẩm</div>
                <div className="circle-ad-item1-desciption" style={{ textAlign: "left" }}>
                  Phần mềm hỗ trợ doanh nghiệp quản lý sản phẩm đang có mặt trên thị trường.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="service-container">
        <div className="service-tag">Dịch vụ</div>
        <div className="service-tag-body">
          Hỗ trợ doanh nghiệp đưa sản phẩm ra thị trường NHANH NHẤT - TIẾT KIỆM NHẤT
        </div>
        <div className="service-support">
          <div className="service-support-item">
            <div className="service-support-left">
              <img src={HOTLINE_ICON} />
            </div>
            <div className="service-support-right">
              <div className="service-support-title">Hỗ trợ</div>
              <div className="service-support-description">
                Dịch vụ hỗ trợ doanh nghiệp đưa thông tin lên phần mềm của chúng tôi giúp doanh nghiệp sử dụng dịch vụ
                với thời gian nhanh và chi phí cạnh tranh.
              </div>
            </div>
          </div>
          <div className="service-support-item">
            <div className="service-support-left">
              <img src={STAMP_ICON} />
            </div>
            <div className="service-support-right">
              <div className="service-support-title">Dịch vụ in tem nhãn</div>
              <div className="service-support-description">
                Dịch vụ in tem nhãn dành cho doanh nghiệp sản xuất, phân phối, nhập khẩu, kinh doanh nhỏ lẻ. HĐ -
                Tracing cam kết giá rẻ nhất, thời gian nhanh nhất và tích hợp in trực tiếp vào bao bì.
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="download-app-container">
        <span className="download-app-title">Tải ứng dụng quét mã vạch</span>
        <div className="icon-store">
          <a
            href="https://play.google.com/store/apps/details?id=vn.thinklabs.traceabilityapp&pli=1"
            className="icon-google"
          >
            <img src={GOOGLE_PLAY} width={200} />
          </a>
          <a href="https://apps.apple.com/vn/app/th-tracing/id6529534082?platform=iphone">
            <img src={APP_STORE} width={200} />
          </a>
        </div>
      </div>
      <div className="footer-hd">
        <hr className="footer-hr" />
        <span>© Copyright © 2024 HĐ - Tracing phần mềm Truy xuất nguồn gốc của trường Đại học Hồng Đức</span>
      </div>

      <ModalTuVan onOpen={openFormTuVan} setIsOpen={isOpenFormTuVan} />
    </div>
  );
}

export default TrangChuQuangCao;
