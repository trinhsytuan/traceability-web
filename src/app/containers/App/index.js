import React, { Suspense, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Switch, withRouter } from 'react-router-dom';
import { Layout } from 'antd';
import Cookies from 'js-cookie';

import Menu from '@components/Menu';
import Routes from '@app/router/Routes';
import LoginRoutes from '@app/router/LoginRoutes';
import Loading from '@components/Loading';
import CustomBreadcrumb from '@components/CustomBreadcrumb/CustomBreadcrumb';
import HeaderMenu from '@components/Header/HeaderMenu';

import { URL } from '@url';
import { CONSTANTS } from '@constants';

import * as app from '@app/store/ducks/app.duck';
import * as user from '@app/store/ducks/user.duck';
import * as caiDat from '@app/store/ducks/caiDat.duck';
import * as extraField from '@app/store/ducks/extraField.duck';

const { Footer, Content } = Layout;

function App({ isLoading, siderCollapsed, token, history, myInfo, ...props }) {
  const [isBroken, setBroken] = useState(false);
  const [isShowDrawer, setShowDrawer] = useState(false);

  useEffect(() => {
    props.getToken();

    handleLogoutAllTab();
  }, []);

  useEffect(() => {
    props.getPermission();
  }, [myInfo]);

  useEffect(() => {
    if (token && token !== CONSTANTS.INITIAL) {
      // props.getExtraData();
      // props.getCaiDatHeThong();
      props.requestUser(history);
    }
  }, [token]);

  function handleLogoutAllTab() {
    window.addEventListener(
      "storage",
      (event) => {
        if (event.storageArea === localStorage) {
          let isLogout = localStorage.getItem(window.location.host + "logout");
          if (isLogout) {
            props.clearToken(history);
          } else {
            const cookiesToken = Cookies.get("token");
            props.setToken(cookiesToken);
            history.replace(URL.MENU.DASHBOARD);
          }
        }
      },
      false
    );
  }

  function onBreakpoint(broken) {
    setBroken(broken);
    setShowDrawer(false);
  }

  function toggleCollapsed() {
    if (isBroken) {
      setShowDrawer(!isShowDrawer);
    } else {
      props.toggleSider(!siderCollapsed);
    }
  }
  if (token && token === CONSTANTS.INITIAL) {
    //  return null;

    // const isResetPassword = URL.RESET_PASSWORD === history?.location?.pathname;
    // const isForgetPassword = URL.FORGET_PASSWORD === history?.location?.pathname;
    const isLogin = URL.LOGIN === history?.location?.pathname;
    // const isRegister = URL.REGISTER === history?.location?.pathname;
    if (isLogin)
      return (
        <Suspense fallback={<Loading />}>
          <LoginRoutes />
        </Suspense>
      );
  }

  return (
    <Layout>
      <Menu
        isBroken={isBroken}
        onBreakpoint={onBreakpoint}
        toggleCollapsed={toggleCollapsed}
        isShowDrawer={isShowDrawer}
        width={230}
      />

      <Layout className="site-layout">
        {token !== CONSTANTS.INITIAL && (
          <HeaderMenu isBroken={isBroken} siderCollapsed={siderCollapsed} toggleCollapsed={toggleCollapsed} />
        )}

        <div id="content-container" className={`custom-scrollbar flex-column${!token ? " login" : ""}`}>
          <CustomBreadcrumb />
          <div id="content">
            <Content>
              {isLoading && <Loading />}
              <Switch>
                <Routes />
              </Switch>
            </Content>
          </div>
        </div>
      </Layout>
    </Layout>
  );
}

function mapStateToProps(store) {
  const { siderCollapsed, token } = store.app;
  const { myInfo } = store.user;
  return { siderCollapsed, token, myInfo };
}

export default connect(mapStateToProps, { ...app.actions, ...user.actions, ...caiDat.actions, ...extraField.actions })(
  withRouter(App)
);
