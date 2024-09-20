import React from 'react';
import './ChangePassword.scss';
import { Button, Col, Form, Input, Row } from 'antd';
import { CONSTANTS, RULES, TOAST_MESSAGE } from '@constants';
import { changePassword } from '@app/services/User';
import { toast } from '@app/common/functionCommons';
import { connect } from 'react-redux';
import Loading from '@app/components/Loading';

ChangePassword.propTypes = {};

function ChangePassword({ isLoading }) {
  const formSubmit = async (e) => {
    const status = await changePassword(e);
    if (status == true) {
      toast(CONSTANTS.SUCCESS, TOAST_MESSAGE.SUCCESS.DEFAULT);
    }
  };
  return (
    <div className="divChangePassword">
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <div className="title">
            <span>Cài đặt mật khẩu</span>
          </div>
          <div className="formInput">
            <Form layout="vertical" onFinish={formSubmit}>
              <Row gutter={16}>
                <Col xs={24} sm={24} md={8}>
                  <Form.Item
                    label="Mật khẩu cũ"
                    name="old_password"
                    rules={[{ required: true, message: "Vui lòng nhập mật khẩu cũ" }]}
                  >
                    <Input.Password placeholder="Nhập mật khẩu cũ" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={8}>
                  <Form.Item
                    label="Mật khẩu mới"
                    name="new_password"
                    rules={[{ required: true, message: "Vui lòng nhập mật khẩu mới" }, RULES.PASSWORD_FORMAT]}
                  >
                    <Input.Password placeholder="Nhập mật khẩu mới" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={8}>
                  <Form.Item
                    label="Nhập lại mật khẩu mới"
                    name="renew_password"
                    rules={[
                      RULES.REQUIRED,
                      ({ getFieldValue }) => ({
                        validator(rule, value) {
                          if (!value || getFieldValue("new_password") === value) {
                            return Promise.resolve();
                          }
                          return Promise.reject("Nhập lại mật khẩu không trùng khớp");
                        },
                      }),
                    ]}
                  >
                    <Input.Password placeholder="Nhập lại mật khẩu mới" />
                  </Form.Item>
                </Col>
              </Row>
              <div className="btn_submit_changePassword">
                <Button type="primary" htmlType="submit">
                  Lưu thay đổi
                </Button>
              </div>
            </Form>
          </div>
        </>
      )}
    </div>
  );
}
function mapStateToProps(store) {
  const { isLoading } = store.app;
  return { isLoading };
}
export default connect(mapStateToProps)(ChangePassword);

