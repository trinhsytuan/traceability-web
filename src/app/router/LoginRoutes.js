import React, { lazy } from 'react';
import { Redirect, Route, Switch, withRouter } from 'react-router-dom';

import { URL } from '@url';
import '@src/app/common/prototype';

const Register = lazy(() => import("@containers/Authenticator/Register"));

const ResetPassword = lazy(() => import("@containers/Authenticator/ResetPassword/index"));
const ForgetPassword = lazy(() => import("@containers/Authenticator/ForgetPassword/index"));

const Login = lazy(() => import("@components/../containers/Authenticator/Login/Login"));
const DangKyThanhCong = lazy(() => import("@containers/DangKyThanhCong/DangKyThanhCong"));
const ChoXetDuyet = lazy(() => import("@containers/ChoXetDuyet/ChoXetDuyet"));
const TruyXuatSanPhamForGuest = lazy(() => import("@containers/TruyXuatSanPhamForGuest/TruyXuatSanPhamForGuest"));
const UrlNotToken = [
  { path: URL.LOGIN, component: Login },
  { path: URL.REGISTER, component: Register },
  { path: URL.FORGET_PASSWORD, component: ForgetPassword },
  { path: URL.RESET_PASSWORD, component: ResetPassword },
  { path: URL.DANG_KY_THANH_CONG, component: DangKyThanhCong },
  { path: URL.CHO_XET_DUYET, component: ChoXetDuyet },
  { path: URL.TRUY_XUAT_SAN_PHAM, component: TruyXuatSanPhamForGuest },
];
const LoginRoutes = (props) => {
  return (
    <Switch>
      {UrlNotToken.map((res, index) => (
        <Route path={res.path} component={res.component} key={index} />
      ))}
      <Redirect to={URL.LOGIN} />
    </Switch>
  );
};
export const UrlLogin = () => {
  return UrlNotToken;
};
export default withRouter(LoginRoutes);
