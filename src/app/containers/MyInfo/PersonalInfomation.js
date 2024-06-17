import React, { useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { cloneObj } from "@app/common/dataConverter";
import "./PersonalInfomation.scss";
import { Button, Col, Form, Row, Upload } from "antd";
import CustomSkeleton from "@components/CustomSkeleton";
import { CONSTANTS, GENDER_OPTIONS, RULES, TYPE_ORG } from "@constants";

import DropZoneCustomImage from "./DropZoneCustomImage";
import * as user from "@app/store/ducks/user.duck";
import Loading from "@app/components/Loading";
PersonalInfomation.propTypes = {
  myInfo: PropTypes.object,
};

function PersonalInfomation({ myInfo, isLoading, ...props }) {
  const [formValue] = Form.useForm();
  const [dataImage, setDataImage] = useState(null);
  const formData = new FormData();
  const formSubmit = (e) => {
    if (dataImage != null) {
      formData.append("image", dataImage);
    }
    const dataUpdate = {
      name: e.name,
      gender: e.gender,
      email: e.email,
      phone: e.phone,
      address: e.address,
    };
    if (dataImage != null) props.updateMyInfo(dataUpdate, formData);
    else props.updateMyInfo(dataUpdate);
  };
  const handleSelectAvatar = (file) => {
    setDataImage(file);
  };
  React.useEffect(() => {
    if (myInfo) {
      let newVaiTro = null;
      const dataField = cloneObj(myInfo);
      dataField.role = dataField?.access_role?.tenvaitro || "Người dùng";
      dataField.nameOrg = dataField?.org?.name;
      formValue.setFieldsValue(dataField);
    }
  }, [myInfo]);
  return (
    <div className="PersonalInfomation">
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <div className="title">Thông tin cá nhân</div>
          <div className="PersonalInfomation__Content">
            <Form form={formValue} autoComplete="off" layout="vertical" onFinish={formSubmit}>
              <Row gutter={16}>
                <Col xs={24} sm={24} md={12}>
                  <CustomSkeleton
                    size="default"
                    label="Tài khoản"
                    name="username"
                    type={CONSTANTS.TEXT}
                    labelCol={{ xs: 24 }}
                    layoutCol={{ xs: 24 }}
                    showInputLabel={false}
                    disabled
                    form={formValue}
                  />
                </Col>
                <Col xs={24} sm={24} md={12}>
                  <CustomSkeleton
                    size="default"
                    label="Vai trò"
                    name="role"
                    type={CONSTANTS.TEXT}
                    labelCol={{ xs: 24 }}
                    layoutCol={{ xs: 24 }}
                    showInputLabel={false}
                    form={formValue}
                    disabled
                  />
                </Col>
              </Row>
              <Row gutter={16}>
                <Col xs={24} sm={24} md={12}>
                  <CustomSkeleton
                    size="default"
                    label="Họ tên"
                    placeholder="Nhập họ tên"
                    name="name"
                    type={CONSTANTS.TEXT}
                    labelCol={{ xs: 24 }}
                    layoutCol={{ xs: 24 }}
                    rules={[RULES.REQUIRED]}
                    showInputLabel={false}
                    form={formValue}
                  />
                </Col>
                <Col xs={24} sm={24} md={12}>
                  <CustomSkeleton
                    size="default"
                    placeholder="Chọn giới tính"
                    label="Giới tính"
                    name="gender"
                    type={CONSTANTS.SELECT}
                    options={{ data: GENDER_OPTIONS }}
                    labelCol={{ xs: 24 }}
                    layoutCol={{ xs: 24 }}
                    rules={[RULES.REQUIRED]}
                    showInputLabel={false}
                    form={formValue}
                  />
                </Col>
              </Row>
              <Row gutter={16}>
                <Col xs={24} sm={24} md={12}>
                  <CustomSkeleton
                    size="default"
                    label="Email"
                    placeholder="Nhập email"
                    name="email"
                    helpInline={false}
                    type={CONSTANTS.TEXT}
                    labelCol={{ xs: 24 }}
                    layoutCol={{ xs: 24 }}
                    rules={[RULES.REQUIRED, RULES.EMAIL]}
                    form={formValue}
                  />
                </Col>
                <Col xs={24} sm={24} md={12}>
                  <CustomSkeleton
                    size="default"
                    helpInline={false}
                    label="Điện thoại"
                    placeholder="Nhập số điện thoại"
                    name="phone"
                    type={CONSTANTS.TEXT}
                    labelCol={{ xs: 24 }}
                    layoutCol={{ xs: 24 }}
                    rules={[RULES.PHONE_NUMBER, { required: true, message: "Số điện thoại không được bỏ trống!" }]}
                    form={formValue}
                  />
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={24}>
                  <CustomSkeleton
                    size="default"
                    label="Địa chỉ"
                    placeholder="Nhập địa chỉ"
                    name="address"
                    type={CONSTANTS.TEXT}
                    labelCol={{ xs: 24 }}
                    layoutCol={{ xs: 24 }}
                    form={formValue}
                  />
                </Col>
              </Row>
              {myInfo.dataField?.org?.name && (
                <Row gutter={16}>
                  <Col span={24}>
                    <CustomSkeleton
                      size="default"
                      label="Tên tổ chức"
                      placeholder="Tên tổ chức"
                      name="nameOrg"
                      type={CONSTANTS.TEXT}
                      labelCol={{ xs: 24 }}
                      layoutCol={{ xs: 24 }}
                      form={formValue}
                      disabled={true}
                    />
                  </Col>
                </Row>
              )}

              <div className="attach-image">
                <Row gutter={16}>
                  <Col span={24}>
                    <div className="attach-image__title">Ảnh đại diện</div>
                    <div className="attach-image__img">
                      <DropZoneCustomImage
                        width={140}
                        height={140}
                        myInfo={myInfo}
                        imgUrl={myInfo.avatar ? myInfo.avatar : null}
                        handleDrop={handleSelectAvatar}
                        stateRerender={myInfo.avatar}
                      />
                    </div>
                  </Col>
                </Row>
                <div className="btn_personal_submit">
                  <Button type="primary" htmlType="submit">
                    Lưu thông tin
                  </Button>
                </div>
              </div>
            </Form>
          </div>
        </>
      )}
    </div>
  );
}
function mapStateToProps(store) {
  const { myInfo } = store.user;
  const { isLoading } = store.app;
  return { myInfo, isLoading };
}
export default connect(mapStateToProps, { ...user.actions })(PersonalInfomation);

