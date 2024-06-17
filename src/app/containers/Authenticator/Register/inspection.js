import React from "react";
import { Button, Form, Input, Row, Col, Checkbox, Alert } from "antd";
import { URL } from "@url";
import { Link } from "react-router-dom";
import { isUsernameValid } from "@app/common/functionCommons";
import { RULES, TYPE_ORG } from "@constants";

const FormItem = Form.Item;

export const Inspection = ({ handleRegister }) => {
  const [formInspection] = Form.useForm();

  return (
    <>
      <Form id="form-123" form={formInspection} layout="vertical" onFinish={handleRegister}>
        <FormItem name="type" hidden initialValue={TYPE_ORG.ENDORSER}>
          <Input />
        </FormItem>
        <FormItem
          name="name"
          label="Tên đơn vị kiểm định"
          rules={[{ required: true, message: "Không được để trống" }]}
          hasFeedback
          className="register-container__form-item"
          required
          validateTrigger={["onChange", "onBlur"]}
        >
          <Input className="form-input" placeholder="Nhập tên đơn vị kiểm định" />
        </FormItem>
        <FormItem
          name="email"
          label="Email đơn vị kiểm định"
          rules={[{ required: true, type: "email", message: "Email không hợp lệ!" }]}
          hasFeedback
          className="register-container__form-item"
          required
          validateTrigger={["onChange", "onBlur"]}
        >
          <Input className="form-input" placeholder="Nhập email đơn vị kiểm định" />
        </FormItem>
        <FormItem
          name="phone"
          label="Số điện thoại đơn vị kiểm định"
          rules={[{ required: true, message: "Số điện thoại không được bỏ trống!" }, RULES.PHONE_NUMBER]}
          hasFeedback
          className="register-container__form-item"
          required
          validateTrigger={["onChange", "onBlur"]}
        >
          <Input className="form-input" placeholder="Nhập số điện thoại đơn vị kiểm định" />
        </FormItem>
        <FormItem
          name="website"
          label="Website đơn vị kiểm định"
          rules={[{ type: "url", message: "Địa chỉ website không hợp lệ!" }]}
          hasFeedback
          className="register-container__form-item"
        >
          <Input className="form-input" placeholder="Nhập website đơn vị kiểm định" />
        </FormItem>
        <FormItem
          name="username"
          label="Tên tài khoản đơn vị kiểm định"
          rules={[{ required: true, message: "Không được để trống" }, { validator: isUsernameValid }]}
          hasFeedback
          className="register-container__form-item"
          required
          validateTrigger={["onChange", "onBlur"]}
        >
          <Input className="form-input" placeholder="Nhập tên tài khoản đơn vị kiểm định. Ví dụ: kiemdinhA.com" />
        </FormItem>
        <FormItem
          name="password"
          label="Mật khẩu"
          rules={[{ required: true, message: "Không được để trống" }, RULES.PASSWORD_FORMAT]}
          hasFeedback
          className="register-container__form-item"
          required
          validateTrigger={["onChange", "onBlur"]}
        >
          <Input.Password className="form-input" placeholder="Mật khẩu" />
        </FormItem>
        <FormItem
          name="repassword"
          label="Nhập lại mật khẩu"
          rules={[
            {
              required: true,
              message: "Không được để trống nhập lại mật khẩu!",
            },
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
          className="register-container__form-item"
          required
        >
          <Input.Password className="form-input" placeholder="Nhập lại mật khẩu" />
        </FormItem>
        <Row>
          <Col span={24}>
            <Button className="form-btn-submit" type="primary" htmlType="submit">
              Đăng ký
            </Button>
          </Col>
        </Row>
      </Form>
      <Row className="register-container-footer">
        <Col span={24} className="register-container-footer__link">
          <Link to={URL.LOGIN}>Quay về đăng nhập</Link>
        </Col>
      </Row>
    </>
  );
};




