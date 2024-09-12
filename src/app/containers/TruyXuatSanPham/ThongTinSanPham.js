import { API } from '@api';
import IconVerify from '@assets/icons/icon-verify.svg';
import { Image, Tooltip } from 'antd';
import React, { useRef, useState } from 'react';
import 'swiper/components/navigation/navigation.min.css';
import 'swiper/components/pagination/pagination.min.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper.min.css';
import './ThongTinSanPham.scss';

import { formatDate } from '@app/common/functionCommons';
import RefreshIcon from '@components/Icons/RefreshIcon';
import UploadImage from '@components/UploadImage/UploadImage';
import { STATUS_PARCEL, VI_STATUS_PARCEL } from '@constants';
import BinhLuanSanPham from '@containers/BinhLuanSanPham/BinhLuanSanPham';
import ModalShowVerifyBlockchain from '@containers/ModalShowVerifyBlockchain/ModalShowVerifyBlockchain';
import { URL } from '@url';
import SwiperCore, { Autoplay, Navigation, Pagination } from 'swiper';
import NhatKySanXuatTruyXuat from '@containers/CongKhaiSanPham/NhatKySanXuat';
import NhatKyKiemDinhTruyXuat from '@containers/CongKhaiSanPham/NhatKyKiemDinh';

SwiperCore.use([Navigation, Pagination, Autoplay]);

function ThongTinSanPham({ data, isPublic }) {
  const firstSwiperRef = useRef(null);
  const secondSwiperRef = useRef(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(1);
  const [activeTabs, setActiveTab] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [linkToBlock, setLinkToBlock] = useState('');
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
  const handleClickBlock = (link) => {
    setShowModal(true);
    setLinkToBlock(URL.SITE_HYPERLEDGER.format(link));
  };
  const cancelModal = () => {
    setShowModal(false);
    setLinkToBlock('');
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
    if (viText == STATUS_PARCEL.UNEXPORTED)
      viText = VI_STATUS_PARCEL.UNEXPORTED;
    else if (viText == STATUS_PARCEL.CANCELLED)
      viText = VI_STATUS_PARCEL.CANCELLED;
    else if (viText == STATUS_PARCEL.CREATING)
      viText = VI_STATUS_PARCEL.CREATING;
    else viText = VI_STATUS_PARCEL.EXPORTED;
    return viText;
  };
  return (
    <div className="info-product-container">
      <div className="header-top">
        <div className="header-slide">
          <div className="header-slide-left">
            <Swiper
              className="slider-left"
              onSlideChange={handleSlideChange}
              loop={data?.imgProduct?.length > 1 ? true : false}
              autoplay={{ delay: 3000 }}
              onSwiper={(swiper) => (firstSwiperRef.current = swiper)}
            >
              {data?.imgProduct?.map((res, index) => {
                if (res.type == 'image') {
                  return (
                    <SwiperSlide key={index}>
                      <Image
                        className="img_slide_top"
                        src={API.PREVIEW_ID.format(res.url)}
                        width={'100%'}
                        height={'100%'}
                        style={{ objectFit: 'cover', borderRadius: '10px' }}
                      />
                    </SwiperSlide>
                  );
                }
              })}
              {(!data.imgProduct || data?.imgProduct?.length == 0) && (
                <SwiperSlide>
                  <Image
                    className="img_slide_top"
                    src={require('@assets/icons/NotImage.png')}
                    preview={false}
                    width={'100%'}
                    height={'100%'}
                    style={{ objectFit: 'cover', borderRadius: '10px' }}
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
              {data?.imgProduct?.map((res, index) => {
                if (res.type == 'image') {
                  return (
                    <SwiperSlide key={index}>
                      <img
                        src={API.PREVIEW_ID.format(res.url)}
                        className={`preview_image ${
                          currentSlideIndex - 1 == index && 'image_active'
                        }`}
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
          {data?.product?.name && (
            <div className="title">
              <span>{data?.product?.name}</span>
            </div>
          )}
          {data?.product?.code && (
            <div className="product-code">
              <div>Mã sản phẩm:</div>
              <div className="codeid">{data?.product?.code}</div>
            </div>
          )}
          {data?.parcel?.name && (
            <div className="product-code">
              <div>Mã lô hàng:</div>
              <div className="codeid">{data?.parcel?.name}</div>
            </div>
          )}
          {data?.nsx && (
            <div className="product-code">
              <div>Ngày sản xuất:</div>
              <div className="codeid">{formatDate(data?.nsx)}</div>
            </div>
          )}
          {data?.product?.org?.name && (
            <div className="product-code">
              <div>Cơ sở sản xuất:</div>
              <div className="codeid">{data?.product?.org?.name}</div>
            </div>
          )}
          {data?.product?.address && (
            <div className="product-code">
              <div>Địa chỉ:</div>
              <div className="codeid">{data?.product?.address}</div>
            </div>
          )}
        </div>
      </div>
      <div className="div_hr"></div>
      <div className="body-info">
        <div className="tabs-item">
          <div
            className={activeTabs == 0 ? 'tabs-active' : 'tab-inactive'}
            onClick={() => onChange(0)}
          >
            Thông tin sản phẩm
          </div>
          <div
            className={activeTabs == 1 ? 'tabs-active' : 'tab-inactive'}
            onClick={() => onChange(1)}
          >
            Thông tin lô sản phẩm
          </div>
          <div
            className={activeTabs == 2 ? 'tabs-active' : 'tab-inactive'}
            onClick={() => onChange(2)}
          >
            Quy trình sản xuất
          </div>
          <div
            className={activeTabs == 3 ? 'tabs-active' : 'tab-inactive'}
            onClick={() => onChange(3)}
          >
            Bình luận
          </div>
        </div>
        <div className="tabs-body">
          {activeTabs == 0 && (
            <div className="tab0">
              {data?.product?.name && (
                <div className="info-product">
                  <span className="title">Tên sản phẩm:</span>
                  <span>{data?.product?.name}</span>
                </div>
              )}
              {data?.product?.code && (
                <div className="info-product">
                  <span className="title">Mã sản phẩm:</span>
                  <span>{data?.product?.code}</span>
                </div>
              )}
              {data?.product.org?.name && (
                <div className="info-product">
                  <span className="title">Cơ sở sản xuất:</span>
                  <span>{data?.product.org?.name}</span>
                </div>
              )}
              {data?.product?.address && (
                <div className="info-product">
                  <span className="title">Địa chỉ:</span>
                  <span>{data?.product?.address}</span>
                </div>
              )}
              {data?.product?.describe && (
                <div className="info-product">
                  <span className="title">Giới thiệu sản phẩm:</span>
                  <span className="describe">{data?.product?.describe}</span>
                </div>
              )}
              {data?.product?.nationalstandard && (
                <div className="info-product">
                  <span className="title">Các tiêu chuẩn quốc gia, quốc tế:</span>
                  <span className="describe">{data?.product?.nationalstandard}</span>
                </div>
              )}
              {data?.product?.url && (
                <div className="info-product">
                  <span className="title">URL:</span>
                  <a href={data?.product?.url} className="describe">{data?.product?.url}</a>
                </div>
              )}
            </div>
          )}
          {activeTabs == 1 && (
            <div className="tab1">
              {data?.name && (
                <div className="info-product">
                  <span className="title">Mã lô hàng:</span>
                  <span>{data.name}</span>
                </div>
              )}
              {data?.nsx && (
                <div className="info-product">
                  <span className="title">Ngày sản xuất:</span>
                  <span>{formatDate(data.nsx)}</span>
                </div>
              )}
              {data?.num && (
                <div className="info-product">
                  <span className="title">Số lượng sản phẩm:</span>
                  <span>{data.num}</span>
                </div>
              )}
              
            </div>
          )}
          {activeTabs == 2 && (
            <div className="tab2">
              {data?.steps?.map((res, index) => {
                return (
                  <div className="show_step_product" key={index}>
                    <div className="show_step_product__title">
                      <img src={IconVerify}/>
                      <span>
                        Bước {res.stepIndex} : {res.name}
                      </span>
                      {data?.product?.require_inspect ? (
                        res?.status == 'endorsed' ? (
                          <div className="show_step_product__kiemdinh">
                            Đã được kiểm định bởi {res?.endorser.name}
                          </div>
                        ) : (
                          <div className="show_step_product__kiemdinhcancel">
                            Quy trình chưa được kiểm định
                          </div>
                        )
                      ) : (
                        ''
                      )}
                    </div>
                    <div className="show_step_product__info">
                      <div className="show_step_product__info__content titleMoTaTruyXuat">
                        <span className="title ">Mô tả:</span>{' '}
                        <span>{res.describe}</span>
                      </div>
                      {res?.fromDate && (
                        <div className="show_step_product__info__content">
                          <span className="title">Thời gian bắt đầu:</span>{' '}
                          <span>{formatDate(res.fromDate)}</span>
                        </div>
                      )}
                      {res?.toDate && (
                        <div className="show_step_product__info__content">
                          <span className="title">Thời gian kết thúc:</span>{' '}
                          <span>{formatDate(res.toDate)}</span>
                        </div>
                      )}
                      {data?.procedure?.productHistory && res?.productHistory && (
                        <div className="show_step_product__info__content">
                          <span
                            className="title title_clickaction nkkd_action"
                            onClick={() => handleShowNKSX(res)}
                          >
                            Xem nhật ký sản xuất
                          </span>
                        </div>
                      )}
                      {data?.procedure?.auditHistory && res?.auditHistory && (
                        <div className="show_step_product__info__content">
                          <span
                            className="title title_clickaction nkkd_action"
                            onClick={() => handleShowNKKD(res)}
                          >
                            Xem nhật ký kiểm định
                          </span>
                        </div>
                      )}
                      {res?.img?.length > 0 && (
                        <div className="show_step_product__info__content">
                          <span className="title">
                            Hình ảnh, video lô hàng:
                          </span>
                        </div>
                      )}
                      <div className="show_step_product__img">
                        {res.img && (
                          <UploadImage data={res.img} disabled={true}/>
                        )}
                      </div>
                      <div className="show_step_product__blockchain">
                        {res?.txtId && (
                          <div
                            className="verify_checked"
                            onClick={() => handleClickBlock(res.txtId)}
                          >
                            <Tooltip placement="top" title={'Xác thực lại'}>
                              <a>
                                Thông tin đã được xác thực trên hệ thống
                                Blockchain
                              </a>
                              <RefreshIcon/>
                            </Tooltip>
                          </div>
                        )}
                      </div>
                    </div>
                    {index != data.steps.length - 1 && (
                      <div className="show_hr"/>
                    )}
                  </div>
                );
              })}
            </div>
          )}
          {activeTabs == 3 && (
            <BinhLuanSanPham idParcel={data._id} idProduct={data.product._id}/>
          )}
        </div>
      </div>
      <ModalShowVerifyBlockchain
        isVisible={showModal}
        handleCancel={cancelModal}
        linkToUrl={linkToBlock}
      ></ModalShowVerifyBlockchain>
      <NhatKySanXuatTruyXuat
        idParcel={idShowNKSX}
        handleVisible={handleShowNKSX}
        onVisible={showNKSX}
      />
      <NhatKyKiemDinhTruyXuat
        idParcel={idShowNKKD}
        handleVisible={handleShowNKKD}
        onVisible={showNKKD}
      />
    </div>
  );
}

export default ThongTinSanPham;
