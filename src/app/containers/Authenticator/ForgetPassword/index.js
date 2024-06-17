import React, { useState } from "react";
import { Link, useHistory, withRouter } from "react-router-dom";
import { Button, Form, Input, Row, Col } from "antd";

import AuthBase from "@containers/Authenticator/AuthBase";

import { requestForgetPassword } from "@app/services/User";
import { URL } from "@url";
import { CONSTANTS } from "@constants";
import { toast } from "@app/common/functionCommons";
import "./Forget.scss";
import { CustomAlert } from "@components/CustomAlert";
import MailIcon from "@components/Icons/MailIcon";

const FormItem = Form.Item;

function ForgetPassword() {
  let history = useHistory();
  const [resultLogin, setResultLogin] = useState(false);
  async function forgetPassword(values) {
    const response = await requestForgetPassword(values);
    if (response?.success) {
      setResultLogin(true);
    }
  }

  return (
    <AuthBase>
      <div className="forget-container">
        <Row className="">
          <Col xs={24} sm={12} md={12} lg={12} className="forget-password-left">
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
          <Col xs={24} sm={24} md={12} lg={12} className="forget-password-right">
            {resultLogin && (
              <>
                {" "}
                <CustomAlert
                  message="Thông tin đặt lại mật khẩu đã được gửi. Vui lòng kiểm tra email và làm theo hướng dẫn"
                  type={CONSTANTS.SUCCESS}
                  icon={<MailIcon />}
                />
              </>
            )}
            <div className="forget-password-right__form">
              <div className="form-title">Quên mật khẩu</div>
              <Form onFinish={forgetPassword}>
                <FormItem
                  name="email"
                  rules={[{ required: true, type: "email", message: "Email không hợp lệ!" }]}
                  hasFeedback
                  className="forget-password-right__form-item"
                >
                  <Input className="form-input" placeholder="Nhập tài khoản email" />
                </FormItem>
                <Row>
                  <Col span={24}>
                    {resultLogin ? (
                      <Link to={URL.LOGIN}>
                        <Button className="form-btn-submit" type="primary" htmlType="submit">
                          Quay về trước
                        </Button>
                      </Link>
                    ) : (
                      <Button className="form-btn-submit" type="primary" htmlType="submit">
                        Tiếp theo
                      </Button>
                    )}
                  </Col>
                </Row>
                {!resultLogin && (
                  <Row className="forget-password-right-footer">
                    <Col span={24} className="forget-password-right-footer__link">
                      <Link to={URL.LOGIN}>Quay về đăng nhập</Link>
                    </Col>
                  </Row>
                )}
              </Form>
            </div>
          </Col>
        </Row>
      </div>
    </AuthBase>
  );
}

export default withRouter(ForgetPassword);
