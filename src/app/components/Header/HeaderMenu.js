import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import { Dropdown, Layout, Menu } from 'antd';

// import Notifications from './Notifications';
import { API } from '@api';
import { URL } from '@url';

import * as app from '@app/store/ducks/app.duck';
import * as user from '@app/store/ducks/user.duck';

import './Header.less';

import ARROW_LEFT from '@assets/images/icon/arrow-left.svg';
import ARROW_RIGHT from '@assets/images/icon/arrow-right.svg';
import Notifications from './Notifications';

import LogoHongDuc from '@assets/images/logo/LogoHongDuc.png'
function HeaderMenu({ token, history, myInfo, isBroken, siderCollapsed, ...props }) {
  if (!token) return null;
  const [isAvatarLoader, setAvatarLoader] = useState(false);
  const [name, setName] = useState("");
  const { pathname } = history.location;
  const { toggleCollapsed } = props;
  const menu = (
    <Menu selectedKeys={pathname}>
      <Menu.Item key={URL.THONG_TIN_CA_NHAN}>
        <Link to={URL.THONG_TIN_CA_NHAN}>Thông tin cá nhân</Link>
      </Menu.Item>
      <Menu.Item onClick={() => props.clearToken(history)} key={"signout"}>
        Đăng xuất
      </Menu.Item>
    </Menu>
  );
  useEffect(() => {
    if (myInfo?.name || myInfo?.username) {
      var name = myInfo?.name || myInfo?.username;
      var arrName = name.split(" ");
      const initials = arrName?.slice(0, 4).map((name) => name.charAt(0).toUpperCase());
      const abbreviation = initials.join("");
      setName(abbreviation);
    }
  }, [myInfo]);
  return (
    <Layout.Header
      className="site-layout-background position-relative"
      size="small"
      style={{
        padding: 0,
        position: "sticky",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 2,
        background: "#179A6B",
      }}
    >
      <div className="Header">
        <div className="Header__Logo">
          <div className="Header__Toggle toggle-menu">
            <img src={siderCollapsed ? ARROW_RIGHT : ARROW_LEFT} alt="" onClick={toggleCollapsed} />
          </div>
         
          <span className="toggle-drawer-menu Header__Toggle">
            <img src={ARROW_RIGHT} alt="" onClick={toggleCollapsed} />
          </span>
        </div>
        <div className='Header__MessageHDU'>
            <span>Đây là hệ thống Truy xuất nguồn gốc của trường Đại học Hồng Đức</span>
            <img src={LogoHongDuc}/>
          </div>
        <div className="header-action" style={{ width: "unset" }}>
          <Dropdown overlay={menu} trigger={["click"]} placement="bottomRight">
            <div className="my-info-container">
              <span className="my-info-container__name">{myInfo?.name || myInfo?.username}</span>
              <div className="my-info__avatar">
                {myInfo.avatar && (
                  <img
                    onLoad={() => setAvatarLoader(true)}
                    src={API.PREVIEW_ID.format(myInfo.avatar)}
                    className="my-info__imgAvatar"
                    style={{ display: isAvatarLoader ? "block" : "none" }}
                    alt=""
                  />
                )}
                {(!isAvatarLoader || !myInfo?.avatar) && (
                  <>
                    <div className="my-info__nameAvatar">
                      <span>{name}</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </Dropdown>
          <Notifications />
        </div>
      </div>
    </Layout.Header>
  );
}

function mapStateToProps(store) {
  const { siderCollapsed, isBroken, token } = store.app;
  const { myInfo } = store.user;
  // const { caiDatHeThong } = store.caiDat;
  return { siderCollapsed, isBroken, token, myInfo };
}

export default connect(mapStateToProps, { ...app.actions, ...user.actions })(withRouter(HeaderMenu));
