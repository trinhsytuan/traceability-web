import { Tabs } from "antd";
import React, { useState } from "react";
import { connect } from "react-redux";

import * as app from "@app/store/ducks/app.duck";
import * as user from "@app/store/ducks/user.duck";
import BaseContent from "@components/BaseContent";
import Loading from "@components/Loading";
import ChangePassword from "./ChangePassword";
import GetInfoKey from "./GetInfoKey";
import "./MyInfo.scss";
import PersonalInfomation from "./PersonalInfomation";
import { TYPE_ORG } from "@constants";

function MyInfo({ myInfo, isLoading, roleList, ...props }) {
  const [handleChangeTab, setHandleChangeTab] = useState(1);

  function handleChangeTabPanel(value) {
    setHandleChangeTab(value);
  }
  return (
    <div className="rootMyInfo">
      <div className="MyInfo">
        <BaseContent className="MyInfoClass">
          <div className="tabs">
            <Tabs size="small" tabPosition="left" onChange={handleChangeTabPanel}>
              <Tabs.TabPane tab="Thông tin cá nhân" key="1"></Tabs.TabPane>
              <Tabs.TabPane tab="Thông tin mật khẩu" key="2"></Tabs.TabPane>
              {myInfo.type != TYPE_ORG.CONSUMER && <Tabs.TabPane tab="Chữ ký số" key="3"></Tabs.TabPane>}
            </Tabs>
          </div>
        </BaseContent>
      </div>
      <BaseContent className="leftClassPanel">
        <div className="leftPanel">
          {handleChangeTab == 1 && <PersonalInfomation />}
          {handleChangeTab == 2 && <ChangePassword />}
          {handleChangeTab == 3 && <GetInfoKey />}
        </div>
      </BaseContent>
    </div>
  );
}

function mapStateToProps(store) {
  const { myInfo } = store.user;
  const { isLoading } = store.app;
  return { isLoading, myInfo };
}

export default connect(mapStateToProps, { ...app.actions, ...user.actions })(MyInfo);

