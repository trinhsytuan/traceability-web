import React, { useEffect, useState } from "react";
import { Button, Form, Input, Row, Col, Checkbox, Alert } from "antd";
import { connect } from "react-redux";
import { Link, useRouteMatch, Switch, Route, useHistory } from "react-router-dom";

import AuthBase from "@containers/Authenticator/AuthBase";

import { URL } from "@url";

import * as app from "@app/store/ducks/app.duck";
import "./Register.scss";
import HouseIcon from "@components/Icons/HouseIcon";
import { Regular } from "./regular";
import { Enterprise } from "./enterprise";
import { Inspection } from "./inspection";
import { register } from "@app/services/User";
import { toast } from "@app/common/functionCommons";
import { CONSTANTS, TOAST_MESSAGE } from "@constants";

function Register({ history, isLoading, resultLogin, ...props }) {
  const [activeKey, setActiveKey] = useState(URL.REGISTER);
  useEffect(() => {
    const pathName = history?.location?.pathname;
    if (pathName) {
      setActiveKey(pathName);
    }
  }, [history?.location?.pathname]);
  async function handleRegister(value) {
    const res = await register({...value, username: value?.username.toString().toLowerCase()});
    if (res && !value.type) {
      toast(CONSTANTS.SUCCESS, TOAST_MESSAGE.SUCCESS.REGISTER_AND_INVITE_LOGIN);
      history.push(URL.LOGIN)
    }
    if (res && value.type) {
      history.push(URL.DANG_KY_THANH_CONG);
    }
  }
  return (
    <AuthBase>
      <div className="register-container">
        <div className="nav-tabs">
          <Row>
            <Col span={8}>
              <Link to={URL.REGISTER}>
                <div className={`nav-tabs__item ${activeKey == URL.REGISTER && "nav-tabs__item--active"}`}>
                  <div className="tab-icon">
                    <HouseIcon />
                  </div>
                  <div className="tab-title">Người tiêu dùng</div>
                </div>
              </Link>
            </Col>
            <Col span={8}>
              <Link to={URL.REGISTER_ENTERPRISE}>
                <div className={`nav-tabs__item ${activeKey == URL.REGISTER_ENTERPRISE && "nav-tabs__item--active"}`}>
                  <div className="tab-icon">
                    <HouseIcon />
                  </div>
                  <div className="tab-title">Doanh nghiệp</div>
                </div>
              </Link>
            </Col>
            <Col span={8}>
              <Link to={URL.REGISTER_INSPECTION}>
                <div className={`nav-tabs__item ${activeKey == URL.REGISTER_INSPECTION && "nav-tabs__item--active"}`}>
                  <div className="tab-icon">
                    <HouseIcon />
                  </div>
                  <div className="tab-title">Đơn vị kiểm định</div>
                </div>
              </Link>
            </Col>
          </Row>
        </div>
        <div className="register-container__title">Đăng ký tài khoản</div>
        <Row className="d-flex">
          <Col xs={20} sm={18} md={14} lg={14} className="register-container__form mx-auto">
            <Switch>
              <Route exact path={URL.REGISTER}>
                <Regular handleRegister={handleRegister} />
              </Route>
              <Route path={URL.REGISTER_ENTERPRISE}>
                <Enterprise handleRegister={handleRegister} />
              </Route>
              <Route path={URL.REGISTER_INSPECTION}>
                <Inspection handleRegister={handleRegister} />
              </Route>
            </Switch>
          </Col>
        </Row>
      </div>
    </AuthBase>
  );
}

function mapStateToProps(store) {
  const { isLoading, resultLogin } = store.app;
  return { isLoading, resultLogin };
}

export default connect(mapStateToProps, app.actions)(Register);

