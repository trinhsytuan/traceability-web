import React from "react";
import * as app from "@app/store/ducks/app.duck";
import * as user from "@app/store/ducks/user.duck";
import AuthBase from "@containers/Authenticator/AuthBase";
import { Button, Col, Form, Input, Row } from "antd";
import queryString from "query-string";

import { connect } from "react-redux";
import { Link, useHistory } from "react-router-dom";

import { toast } from "@app/common/functionCommons";
import { requestResetPassword } from "@app/services/User";
import { CONSTANTS, RULES } from "@constants";
import { URL } from "@url";
import "./ResetPassword.scss";

function ResetPassword({ isLoading, ...props }) {
  let history = useHistory();
  const { search } = useHistory()?.location;
  const { token } = queryString.parseUrl(search)?.query;

  const resetPassword = async (values) => {
    const response = await requestResetPassword(token, { password: values.password });
    if (response && response.success) {
      toast(CONSTANTS.SUCCESS, "Thay đổi mật khẩu thành công");
      props.clearToken(history);
      history.push("/");
    }
  };
  const FormItem = Form.Item;
  return (
    <AuthBase>
      <div className="login-container">
        <Row>
          <Col xs={24} sm={24} md={12} lg={12} className="login-left">
            <div className="web-describe">
              <p className="title">Hệ thống truy xuất nguồn gốc sản phẩm</p>
              <p className="sub-title">
                Chúng tôi lấy cái gốc không phải là công nghệ mà là quy trình và sự am hiểu về nông nghiệp Việt Nam để
                đem đến công cụ công nghệ thông tin phù hợp nhất, dễ triển khai và đáp ứng được mong muốn của doanh
                nghiệp và yêu cầu của thị trường trong nước, quốc tế. Mong muốn của chúng tôi là kết nối và xây dựng
                cộng đồng để thực phẩm Việt sạch hơn, cạnh tranh tốt hơn và phát triển vững mạnh.
              </p>
            </div>
          </Col>
          <Col xs={24} sm={24} md={12} lg={12} className="login-right">
            <div className="login-right__form">
              <div className="form-title">Đổi mật khẩu</div>
              <Form onFinish={resetPassword}>
                <FormItem
                  name="password"
                  rules={[{ required: true, message: "Không được để trống" }, RULES.PASSWORD_FORMAT]}
                  hasFeedback
                  className="login-right__form-item"
                >
                  <Input.Password className="form-input" placeholder="Nhập mật khẩu" disabled={isLoading} />
                </FormItem>
                <FormItem
                  name="new_password"
                  rules={[
                    { required: true, message: "Không được để trống" },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue("password") === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(new Error("Mật khẩu không khớp!"));
                      },
                    }),
                  ]}
                  hasFeedback
                  className="login-right__form-item"
                >
                  <Input.Password className="form-input" placeholder="Nhập lại mật khẩu" disabled={isLoading} />
                </FormItem>
                <Row>
                  <Col span={24}>
                    <Button className="form-btn-submit" type="primary" htmlType="submit" loading={isLoading}>
                      Cập nhật
                    </Button>
                  </Col>
                </Row>
                <Row className="forget-password-right-footer">
                  <Col span={24} className="forget-password-right-footer__link">
                    <Link to={URL.LOGIN}>Đăng nhập trở lại</Link>
                  </Col>
                </Row>
              </Form>
            </div>
          </Col>
        </Row>
      </div>
    </AuthBase>
  );
}
function mapStateToProps(store) {
  const { isLoading, resultLogin, showErrorLogin } = store.app;
  const { clearToken } = store.user;
  return { isLoading, resultLogin, showErrorLogin, clearToken };
}
export default connect(mapStateToProps, { ...app.actions, ...user.actions })(ResetPassword);

