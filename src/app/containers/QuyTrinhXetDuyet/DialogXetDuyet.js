import React, { useEffect } from 'react';
import Modal from 'antd/lib/modal/Modal';
import { Button, Form, Input } from 'antd';
import './DialogXetDuyet.scss';
import TextArea from 'antd/lib/input/TextArea';
import { RESULT_SENDING } from '@constants';
import { validateSpaceNull } from '@app/common/functionCommons';

DialogXetDuyet.propTypes = {};

function DialogXetDuyet({ dataStep, dataParcel, visible, onChange, status, onConfim }) {
  const [form] = Form.useForm();
  useEffect(() => {
    form.setFieldsValue({
      account: dataStep?.assignee?.name,
      productname: dataParcel?.product?.name,
      productcode: dataParcel?.name,
      inspectioncontent: dataStep?.step?.name,
    });
  }, [dataStep, dataParcel]);
  const formSubmit = async (e) => {
    let response = null;
    if (status == 'decline') {
      response = {
        result: RESULT_SENDING.DENIED,
        description_response: e.descriptionResponse,
        id: dataStep._id,
      };
    } else {
      response = {
        result: RESULT_SENDING.ACCEPTED,
        id: dataStep._id,
      };
    }
    onConfim(response);
    onChange();
    form.resetFields();
  };
  return (
    <div className="dialog_xd_nsx">
      <Modal
        visible={visible}
        onCancel={onChange}
        footer={null}
        className="dialog_xd"
        width={700}
        title={`${status === 'accept' ? 'Tiếp nhận duyệt' : 'Từ chối duyệt'}`}
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
          <Form.Item label="Tài khoản duyệt:" name="account">
            <Input readOnly/>
          </Form.Item>
          <Form.Item label="Tên sản phẩm:" name="productname">
            <Input readOnly/>
          </Form.Item>
          <Form.Item label="Mã lô sản phẩm:" name="productcode">
            <Input readOnly/>
          </Form.Item>
          <Form.Item label="Nội dung yêu cầu duyệt:" name="inspectioncontent">
            <Input readOnly/>
          </Form.Item>
          {status == 'decline' && (
            <div>
              <Form.Item
                label="Lý do từ chối:"
                name="descriptionResponse"
                rules={[{ required: true, message: 'Bạn phải nhập lý do từ chối' }, { validator: validateSpaceNull }]}
              >
                <TextArea rows={4}/>
              </Form.Item>
            </div>
          )}
          <div className="btn_submit_form_dialogxd">
            <Button className="btn_cancel" onClick={onChange} size="medium">
              Huỷ thao tác
            </Button>
            <Button type="primary" size="medium" htmlType="submit">
              {status == 'accept' ? 'Tiếp nhận duyệt' : 'Từ chối duyệt'}
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
}

export default DialogXetDuyet;

