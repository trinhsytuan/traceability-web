import React from 'react';
import { connect } from 'react-redux';
import './TrangChu.scss';
import BaseContent from '@components/BaseContent';
import IMG_TRUY_XUAT_APP from '@assets/images/imgtruyxuatapp.png';
import GOOGLE_PLAY from '@assets/icons/google-play.svg';
import APP_STORE from '@assets/icons/app-store.svg';
import { LINK_DOWNLOAD_APP } from '@constants';

function TrangChu({ isLoading, ...props }) {
  return (
    <>
      <BaseContent>
        <div className="homepage">
          <div className="img_app_div">
            <img src={IMG_TRUY_XUAT_APP} className="img_app"  />
          </div>
          <div className="homepage_right">
            <h2>TH Tracing nay đã có phiên bản Mobile:</h2>
            <h2>Tải ứng dụng TH Tracing tại địa chỉ:</h2>
            <div className="row-linkdownloadapp">
              <a href={LINK_DOWNLOAD_APP.CH_PLAY}>
                <img src={GOOGLE_PLAY} width={150} height={150}></img>
              </a>
              <a href={LINK_DOWNLOAD_APP.APP_STORE}>
                <img src={APP_STORE} width={150} height={150}></img>
              </a>
            </div>
          </div>
        </div>
      </BaseContent>
    </>
  );
}

function mapStateToProps(store) {
  const { isLoading } = store.app;
  return { isLoading };
}

export default connect(mapStateToProps)(TrangChu);
