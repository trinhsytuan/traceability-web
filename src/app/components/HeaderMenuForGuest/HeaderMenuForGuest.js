import React from "react";
import PropTypes from "prop-types";
import "./HeaderMenuForGuest.scss";
import { Button, Layout, Typography } from "antd";
import LOGO from "@assets/images/logo/logo.svg";
import { URL } from "@url";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
HeaderMenuForGuest.propTypes = {};

function HeaderMenuForGuest(props) {
  return (
    <div className="header-guest-container">
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
        <div className="header-menu-center">
          <img src={LOGO} style={{ width: "219px", height: "39px" }} />
          <Link to={URL.LOGIN} className="btn_signin">
            Đăng nhập
          </Link>
        </div>
      </Layout.Header>
    </div>
  );
}

export default HeaderMenuForGuest;

