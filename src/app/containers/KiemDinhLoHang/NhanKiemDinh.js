import React, { useEffect } from "react";
import PropTypes from "prop-types";
import Modal from "antd/lib/modal/Modal";
import { Button, Form, Input } from "antd";
import "./NhanKiemDinh.scss";
import TextArea from "antd/lib/input/TextArea";
import { changeStatusReception } from "@app/services/NhatKyKiemDinh";
import { CONSTANTS, RESULT_SENDING, TOAST_MESSAGE } from "@constants";
import { toast, validateSpaceNull } from "@app/common/functionCommons";
NhanKiemDinh.propTypes = {};

function NhanKiemDinh({ dataStep, dataParcel, visible, onChange, status, reload }) {
  const [form] = Form.useForm();
  useEffect(() => {
    form.setFieldsValue({
      account: dataStep?.endorser?.name,
      productname: dataParcel?.product?.name,
      productcode: dataParcel?.name,
      inspectioncontent: dataStep?.step?.name,
    });
  }, [dataStep, dataParcel]);
  const formSubmit = async (e) => {
    let response = null;
    if (status == "decline") {
      response = await changeStatusReception(dataStep._id, {
        result_reception: RESULT_SENDING.REFUSED,
        description_response_reception: e.descriptionResponse,
      });
    } else {
      response = await changeStatusReception(dataStep._id, {
        result_reception: RESULT_SENDING.RECEIVED,
      });
    }
    if (response) {
      toast(CONSTANTS.SUCCESS, TOAST_MESSAGE.SUCCESS.DEFAULT);
      reload();
    }
    form.resetFields();
    onChange();
  };
  return (
    <div className="dialog_xd_nsx">
      <Modal
        visible={visible}
        onCancel={onChange}
        footer={null}
        className="dialog_xd"
        width={750}
        title={`${status === "accept" ? "Tiếp nhận kiểm định" : "Từ chối kiểm định"}`}
      >
        <Form
          name="basic"
          form={form}
          size="large"
          labelCol={{ span: 7 }}
          wrapperCol={{ span: 17 }}
          onFinish={formSubmit}
          className="form_xetduyet"
        >
          <Form.Item label="Tài khoản nhận kiểm định:" name="account">
            <Input readOnly />
          </Form.Item>
          <Form.Item label="Tên sản phẩm:" name="productname">
            <Input readOnly />
          </Form.Item>
          <Form.Item label="Mã lô sản phẩm:" name="productcode">
            <Input readOnly />
          </Form.Item>
          <Form.Item label="Nội dung kiểm định:" name="inspectioncontent">
            <Input readOnly />
          </Form.Item>
          {status == "decline" && (
            <div>
              <Form.Item
                label="Lý do từ chối:"
                name="descriptionResponse"
                rules={[{ required: true, message: "Bạn phải nhập lý do từ chối" }, { validator: validateSpaceNull }]}
              >
                <TextArea rows={4} />
              </Form.Item>
            </div>
          )}
          <div className="btn_submit_form_dialogxd">
            <Button className="btn_cancel" onClick={onChange} size="medium">
              Huỷ thao tác
            </Button>
            <Button type="primary" size="medium" htmlType="submit">
              {status == "accept" ? "Tiếp nhận kiểm định" : "Từ chối kiểm định"}
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
}

export default NhanKiemDinh;
