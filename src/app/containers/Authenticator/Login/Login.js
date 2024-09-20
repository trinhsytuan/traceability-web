import React from 'react';
import { Button, Checkbox, Col, Form, Input, Row } from 'antd';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import AuthBase from '@containers/Authenticator/AuthBase';
import { URL } from '@url';

import * as app from '@app/store/ducks/app.duck';
import './Login.scss';
import { CustomAlert } from '../../../components/CustomAlert';
import { isUsernameValid } from '@app/common/functionCommons';

const FormItem = Form.Item;

function Login({ history, isLoading, resultLogin, showErrorLogin, ...props }) {
  function handleLogin(value) {
    props.login({...value, username: value?.username.toString().toLowerCase()}, history);
  }
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
            {showErrorLogin && (
              <>
                <div className="message">
                  {" "}
                  <CustomAlert message="Vui lòng kiểm tra lại thông tin đăng nhập!" />
                </div>
              </>
            )}
            <div className="login-right__form">
              <div className="form-title">Đăng nhập</div>
              <Form onFinish={handleLogin}>
                <FormItem
                  name="username"
                  rules={[{ required: true, message: "Không được để trống" }, { validator: isUsernameValid }]}
                  hasFeedback
                  className="login-right__form-item"
                >
                  <Input className="form-input" placeholder="Tài khoản" disabled={isLoading} />
                </FormItem>
                <FormItem
                  name="password"
                  rules={[{ required: true, message: "Không được để trống" }]}
                  hasFeedback
                  className="login-right__form-item"
                >
                  <Input.Password className="form-input" placeholder="Mật khẩu" disabled={isLoading} />
                </FormItem>
                <Row>
                  <Col span={24}>
                    <Button className="form-btn-submit" type="primary" htmlType="submit" loading={isLoading}>
                      Đăng nhập
                    </Button>
                  </Col>
                </Row>
                <Row>
                  <Col span={24} className="form-footer">
                    <Checkbox className="check-box-remember">Ghi nhớ thông tin</Checkbox>
                    <Link to={URL.FORGET_PASSWORD} className="link-forget">
                      Quên mật khẩu
                    </Link>
                  </Col>
                </Row>
                <Row className="login-right-footer">
                  <Col span={24} className="login-right-footer__link">
                    <Link to={URL.REGISTER}>Đăng ký tài khoản mới</Link>
                  </Col>
                </Row>
                <Row className="txout-right-footer" style={{ marginTop: 30 }}>
                  <Col span={24} className="txout-right-footer__link">
                    <Link to={URL.MENU.TRUY_XUAT_SAN_PHAM}>Truy xuất sản phẩm</Link>
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
  return { isLoading, resultLogin, showErrorLogin };
}

export default connect(mapStateToProps, app.actions)(Login);
