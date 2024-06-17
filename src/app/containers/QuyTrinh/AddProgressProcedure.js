import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Button, Form, Input, InputNumber, Modal } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import './AddProgressProcedure.scss';

AddProgressProcedure.propTypes = {
  open: PropTypes.bool,
  handleSet: PropTypes.func,
  submitForm: PropTypes.func,
  clearEdit: PropTypes.func,
};

function AddProgressProcedure({ open, data, view, submitForm, form, formClose, clearEdit }) {
  const resetForm = () => {
    clearEdit(null);
  };
  const handleFormSubmit = (e) => {
    resetForm();
    submitForm(e, data);
    clearEdit(null);
  };
  useEffect(() => {
    if (data) {
      form.setFieldsValue({
        name: data.name,
        stepIndex: data.stepIndex,
        describe: data.describe,
      });
    }
  }, [data]);
  return (
    <Modal visible={open} title="Quy trình sản xuất" onCancel={formClose} footer={null} width={850}>
      <Form
        form={form}
        onFinish={handleFormSubmit}
        name="basic"
        labelCol={{
          span: 8,
        }}
        wrapperCol={{
          span: 16,
        }}
        layout="horizontal"
        className="modal_add_progress"
      >
        <Form.Item
          label="Tên quy trình con"
          name="name"
          className="form_item_add"
          rules={[{ required: true, message: 'Tên bước không thể để trống' }]}
        >
          <Input placeholder="Nhập tên quy trình con" readOnly={view ? false : true}/>
        </Form.Item>

        <Form.Item
          label="Thứ tự của quy trình con"
          name="stepIndex"
          className="form_item_add"
          rules={[{ required: true, message: 'Thứ tự của quy trình con không thể để trống' }]}
        >
          <InputNumber min={1} placeholder="Chọn thứ tự" style={{ width: '50%' }} readOnly={view ? false : true}/>
        </Form.Item>
        <Form.Item label="Mô tả nội dung thực hiện" name="describe" className="form_item_add">
          <TextArea rows={4} placeholder="Nhập mô tả" readOnly={view ? false : true}/>
        </Form.Item>
        {view && (
          <div className="form_item_submit">
            <div className="form_item_submit__btn">
              <Button
                className="form_item_submit__btn_cancel"
                onClick={formClose}

              >
                Huỷ thao tác
              </Button>
              <Button type="primary" htmlType="submit">
                Lưu thông tin
              </Button>
            </div>
          </div>
        )}
      </Form>
    </Modal>
  );
}

export default AddProgressProcedure;

