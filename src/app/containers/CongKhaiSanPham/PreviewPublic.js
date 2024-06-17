import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import "./PreviewPublic.scss";
import { Image, Modal } from "antd";
import { STATUS_PARCEL, VI_STATUS_PARCEL } from "@constants";
import "swiper/components/navigation/navigation.min.css";
import "swiper/components/pagination/pagination.min.css";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper.min.css";
import { getMediaBase } from "@app/services/ThemMoiSanPham";
import { API } from "@api";
import IconVerify from "@assets/icons/icon-verify.svg";
import { formatDate } from "@app/common/functionCommons";
import UploadImage from "@components/UploadImage/UploadImage";
import BinhLuanSanPham from "@containers/BinhLuanSanPham/BinhLuanSanPham";
import SwiperCore, { Autoplay, Navigation, Pagination } from "swiper";
import { getOrg } from "@app/services/TruyXuat";
import NhatKyKiemDinh from "@containers/KiemDinhLoHang/NhatKyKiemDinh";
import NhatKyKiemDinhTruyXuat from "./NhatKyKiemDinh";
import NhatKySanXuatTruyXuat from "./NhatKySanXuat";
PreviewPublic.propTypes = {};

function PreviewPublic({ isOpen, handleOpen, idParcel, infoParcel, infoStep, infoPublic }) {
  const firstSwiperRef = useRef(null);
  const secondSwiperRef = useRef(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(1);
  const [activeTabs, setActiveTab] = useState(0);
  const [imgProduct, setImgProduct] = useState(null);
  const [infoOrg, setInfoOrg] = useState(null);
  const [showNKKD, setShowNKKD] = useState(false);
  const [idShowNKKD, setIDShowNKKD] = useState(null);
  const [showNKSX, setShowNKSX] = useState(false);
  const [idShowNKSX, setIDShowNKSX] = useState(null);
  const handleShowNKKD = (e) => {
    setShowNKKD(!showNKKD);
    if (!showNKKD) setIDShowNKKD(e);
    else setIDShowNKKD(null);
  };
  const handleShowNKSX = (e) => {
    setShowNKSX(!showNKSX);
    if (!showNKSX) setIDShowNKSX(e);
    else setIDShowNKSX(null);
  };
  const handleSlideChange = () => {
    let currentIndex = firstSwiperRef.current?.activeIndex;
    if (currentIndex !== undefined && currentIndex !== null) {
      setCurrentSlideIndex(currentIndex);
      secondSwiperRef.current?.slideTo(currentIndex);
    }
  };
  const handleSlideChangeBottom = () => {
    const currentIndex = secondSwiperRef.current?.activeIndex;
    if (currentIndex !== undefined && currentIndex !== null) {
      setCurrentSlideIndex(currentIndex);
      firstSwiperRef.current?.slideTo(currentIndex);
    }
  };
  const handleBottomSlideClick = (index) => {
    firstSwiperRef.current?.slideTo(index + 1);
    setCurrentSlideIndex(index + 1);
  };
  const onChange = (index) => {
    setActiveTab(index);
  };
  const viStatus = (status) => {
    let viText = status;
    if (viText == STATUS_PARCEL.UNEXPORTED) viText = VI_STATUS_PARCEL.UNEXPORTED;
    else if (viText == STATUS_PARCEL.CANCELLED) viText = VI_STATUS_PARCEL.CANCELLED;
    else if (viText == STATUS_PARCEL.CREATING) viText = VI_STATUS_PARCEL.CREATING;
    else viText = VI_STATUS_PARCEL.EXPORTED;
    return viText;
  };
  useEffect(() => {
    if (isOpen && infoParcel.product._id && infoPublic.product_public_items.media) {
      getImageProduct();
    }
    if (isOpen && infoParcel.product._id && !infoPublic.product_public_items.media) {
      setImgProduct([]);
    }
    if (isOpen && infoPublic.product_public_items.producer) {
      getInfoOrg();
    }
  }, [infoParcel, isOpen]);
  const getImageProduct = async () => {
    const response = await getMediaBase(infoParcel?.product?._id);
    setImgProduct(response);
  };
  const getInfoOrg = async () => {
    const org = await getOrg(infoParcel?.user.org);
    setInfoOrg(org);
  };
  return (
    <div>
      <Modal visible={isOpen} onCancel={handleOpen} footer={null} width={900}>
        <div className="info-product-container">
          <div className="header-top">
            <div className="header-slide">
              <div className="header-slide-left">
                <Swiper
                  className="slider-left"
                  onSlideChange={handleSlideChange}
                  loop={imgProduct?.length > 1 ? true : false}
                  autoplay={{ delay: 3000 }}
                  onSwiper={(swiper) => (firstSwiperRef.current = swiper)}
                >
                  {imgProduct?.map((res, index) => {
                    if (res.type == "image") {
                      return (
                        <SwiperSlide key={index}>
                          <Image
                            className="img_slide_top"
                            src={API.PREVIEW_ID.format(res.url)}
                            width={"100%"}
                            height={"100%"}
                            style={{ objectFit: "cover", borderRadius: "10px" }}
                          />
                        </SwiperSlide>
                      );
                    }
                  })}
                  {imgProduct && imgProduct?.length == 0 && (
                    <SwiperSlide>
                      <Image
                        className="img_slide_top"
                        src={require("../../../assets/icons/NotImage.png")}
                        preview={false}
                        width={"100%"}
                        height={"100%"}
                        style={{ objectFit: "cover", borderRadius: "10px" }}
                      />
                    </SwiperSlide>
                  )}
                </Swiper>
              </div>
              <div className="header-slide-right">
                <Swiper
                  slidesPerView={5}
                  spaceBetween={5}
                  modules={[Pagination]}
                  className="swiper-right"
                  onSlideChange={handleSlideChangeBottom}
                  allowSlideNext={false}
                  allowSlidePrev={false}
                  allowTouchMove={false}
                >
                  {imgProduct?.map((res, index) => {
                    if (res.type == "image") {
                      return (
                        <SwiperSlide key={index}>
                          <img
                            src={API.PREVIEW_ID.format(res.url)}
                            className={`preview_image ${currentSlideIndex - 1 == index && "image_active"}`}
                            onClick={() => handleBottomSlideClick(index)}
                          />
                        </SwiperSlide>
                      );
                    }
                  })}
                </Swiper>
              </div>
            </div>

            <div className="header-content">
              {infoPublic?.product_public_items?.name && (
                <div className="title">
                  <span>{infoParcel?.product?.name}</span>
                </div>
              )}
              {infoPublic?.product_public_items?.code && (
                <div className="product-code">
                  <div>Mã sản phẩm:</div>
                  <div className="codeid">{infoParcel?.product?.code}</div>
                </div>
              )}
              {infoPublic?.parcel_public_items?.name && (
                <div className="product-code">
                  <div>Mã lô hàng:</div>
                  <div className="codeid">{infoParcel?.name}</div>
                </div>
              )}
              {infoPublic?.product_public_items?.nsx && (
                <div className="product-code">
                  <div>Ngày sản xuất:</div>
                  <div className="codeid">{formatDate(infoParcel?.nsx)}</div>
                </div>
              )}
              {infoPublic?.product_public_items?.producer && infoOrg?.name && (
                <div className="product-code">
                  <div>Cơ sở sản xuất:</div>
                  <div className="codeid">{infoOrg?.name}</div>
                </div>
              )}
              {infoPublic?.product_public_items?.address && (
                <div className="product-code">
                  <div>Địa chỉ:</div>
                  <div className="codeid">{infoParcel?.product?.address}</div>
                </div>
              )}
            </div>
          </div>
          <div className="div_hr"></div>
          <div className="body-info">
            <div className="tabs-item">
              <div className={activeTabs == 0 ? "tabs-active" : "tab-inactive"} onClick={() => onChange(0)}>
                Thông tin sản phẩm
              </div>
              <div className={activeTabs == 1 ? "tabs-active" : "tab-inactive"} onClick={() => onChange(1)}>
                Thông tin lô sản phẩm
              </div>
              <div className={activeTabs == 2 ? "tabs-active" : "tab-inactive"} onClick={() => onChange(2)}>
                Quy trình sản xuất
              </div>
              <div className={activeTabs == 3 ? "tabs-active" : "tab-inactive"} onClick={() => onChange(3)}>
                Bình luận
              </div>
            </div>
            <div className="tabs-body">
              {activeTabs == 0 && (
                <div className="tab0">
                  {infoPublic?.product_public_items?.name && infoParcel.product?.name && (
                    <div className="info-product">
                      <span className="title">Tên sản phẩm:</span>
                      <span>{infoParcel?.product?.name}</span>
                    </div>
                  )}
                  {infoPublic?.product_public_items?.code && infoParcel?.product?._id && (
                    <div className="info-product">
                      <span className="title">Mã sản phẩm:</span>
                      <span>{infoParcel?.product?.code}</span>
                    </div>
                  )}
                  {infoPublic?.product_public_items?.producer && infoOrg?.name && (
                    <div className="info-product">
                      <span className="title">Cơ sở sản xuất:</span>
                      <span>{infoOrg?.name}</span>
                    </div>
                  )}
                  {infoPublic?.product_public_items?.address && infoParcel?.product?.address && (
                    <div className="info-product">
                      <span className="title">Địa chỉ:</span>
                      <span>{infoParcel?.product?.address}</span>
                    </div>
                  )}
                  {infoPublic?.product_public_items?.nationalStandard && infoParcel?.product?.nationalStandard && (
                    <div className="info-product">
                      <span className="title">Các tiêu chuẩn quốc gia, quốc tế:</span>
                      <span>{infoParcel?.product?.nationalStandard}</span>
                    </div>
                  )}
                  {infoPublic?.product_public_items?.describe && infoParcel?.product?.describe && (
                    <div className="info-product">
                      <span className="title">Giới thiệu sản phẩm:</span>
                      <span className="describe">{infoParcel?.product?.describe}</span>
                    </div>
                  )}
                  {infoPublic?.product_public_items?.url && infoParcel?.product?.url && (
                    <div className="info-product">
                      <span className="title">URL:</span>
                      <span className="describe">{infoParcel?.product?.url}</span>
                    </div>
                  )}
                </div>
              )}
              {activeTabs == 1 && (
                <div className="tab1">
                  {infoPublic?.parcel_public_items?.name && infoParcel?.procedure?._id && (
                    <div className="info-product">
                      <span className="title">Mã lô hàng:</span>
                      <span>{infoParcel?.name}</span>
                    </div>
                  )}
                  {infoPublic?.parcel_public_items?.nsx && infoParcel?.nsx && (
                    <div className="info-product">
                      <span className="title">Ngày sản xuất:</span>
                      <span>{formatDate(infoParcel?.nsx)}</span>
                    </div>
                  )}
                  {infoPublic?.parcel_public_items?.num && infoParcel?.num && (
                    <div className="info-product">
                      <span className="title">Số lượng sản phẩm:</span>
                      <span>{infoParcel?.num}</span>
                    </div>
                  )}
                </div>
              )}
              {activeTabs == 2 && infoStep && (
                <div className="tab2">
                  {infoStep.map((res, index) => {
                    const isPublic = infoPublic?.step_public_items.includes(res._id);
                    if (isPublic) {
                      return (
                        <div className="show_step_product" key={index}>
                          <div className="show_step_product__title">
                            <img src={IconVerify} />
                            <span>
                              Bước {res.stepIndex} : {res.name}
                            </span>
                            {res.status == "endorsed" ? (
                              <div className="show_step_product__kiemdinh">
                                Đã được kiểm định bởi {res?.endorser.name}
                              </div>
                            ) : (
                              <div className="show_step_product__kiemdinhcancel">Quy trình chưa được kiểm định</div>
                            )}
                          </div>
                          <div className="show_step_product__info">
                            <div className="show_step_product__info__content titleMoTaTruyXuat">
                              <span className="title ">Mô tả:</span> <span>{res.describe}</span>
                            </div>
                            {res.from_date && (
                              <div className="show_step_product__info__content">
                                <span className="title">Thời gian bắt đầu:</span>{" "}
                                <span>{formatDate(res.from_date)}</span>
                              </div>
                            )}
                            {res.to_date && (
                              <div className="show_step_product__info__content">
                                <span className="title">Thời gian kết thúc:</span>{" "}
                                <span>{formatDate(res.to_date)}</span>
                              </div>
                            )}
                            {infoPublic?.parcel_public_items?.productHistory && (
                              <div className="show_step_product__info__content">
                                <span className="title title_clickaction" onClick={() => handleShowNKSX(res)}>
                                  Xem nhật ký sản xuất
                                </span>
                              </div>
                            )}
                            {infoPublic?.parcel_public_items?.productHistory && (
                              <div className="show_step_product__info__content">
                                <span className="title title_clickaction" onClick={() => handleShowNKKD(res)}>
                                  Xem nhật ký kiểm định
                                </span>
                              </div>
                            )}
                            {res.image.length > 0 && (
                              <div className="show_step_product__info__content">
                                <span className="title">Hình ảnh, video lô hàng:</span>
                              </div>
                            )}
                            <div className="show_step_product__img">
                              {res.image && <UploadImage data={res.image} disabled={true} />}
                            </div>
                          </div>
                          {index != infoStep.length - 1 && <div className="show_hr" />}
                        </div>
                      );
                    }
                  })}
                </div>
              )}
              {activeTabs == 3 && (
                <BinhLuanSanPham idParcel={idParcel} idProduct={infoParcel.product._id} disabled={true} />
              )}
              <NhatKySanXuatTruyXuat idParcel={idShowNKSX} handleVisible={handleShowNKSX} onVisible={showNKSX} />
              <NhatKyKiemDinhTruyXuat idParcel={idShowNKKD} handleVisible={handleShowNKKD} onVisible={showNKKD} />
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default PreviewPublic;
