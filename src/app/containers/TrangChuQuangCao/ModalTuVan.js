import React from "react";
import PropTypes from "prop-types";
import { Button, Form, Input, Modal } from "antd";
import { CONSTANTS, RULES } from "@constants";
import { toast } from "@app/common/functionCommons";

ModalTuVan.propTypes = {};

function ModalTuVan({ onOpen, setIsOpen }) {
  const [form] = Form.useForm();

  const finishForm = (e) => {
    form.resetFields();
    toast(CONSTANTS.SUCCESS, "Đăng ký tư vấn thành công, chúng tôi sẽ liên hệ cho bạn!!")
    setIsOpen();
  };
  
  return (
    <Modal title="Đăng ký tư vấn" visible={onOpen} onCancel={setIsOpen} footer={null}>
      <Form size="normal" labelCol={{ span: 7 }} wrapperCol={{ span: 17 }} onFinish={finishForm} form={form}>
        <Form.Item label="Tên của bạn" name="name" rules={[{ required: true, message: "Vui lòng điền tên của bạn!" }]}>
          <Input />
        </Form.Item>
        <Form.Item label="SĐT của bạn" name="phone" rules={[{ required: true, message: "Vui lòng điền tên của bạn!" }, RULES.PHONE_NUMBER]}>
          <Input />
        </Form.Item>
        <div className="btn-actions" style={{display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center", gap: "18px"}}>
          <Button type="white" onClick={setIsOpen}>Huỷ</Button>
          <Button type="primary" htmlType="submit">Liên hệ</Button>
        </div>
      </Form>
    </Modal>
  );
}

export default ModalTuVan;
