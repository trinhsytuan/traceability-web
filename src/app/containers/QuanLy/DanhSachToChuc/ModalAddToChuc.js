import { toast, validateSpaceNull } from '@app/common/functionCommons';
import { createOrg, editOrg } from '@app/services/QuanLyToChuc';
import Loading from '@components/Loading';
import { CONSTANTS, RULES, SELECT_ROLE_CREATE_ORG, TOAST_MESSAGE } from '@constants';
import { Button, Form, Input, Modal, Select } from 'antd';
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import './ModalAddToChuc.scss';

ModalAddToChuc.propTypes = {
  data: PropTypes.object,
};
ModalAddToChuc.defaultProps = {
  data: null,
};

function ModalAddToChuc({ visibled, onChangeVisibled, data, isLoading, callAPI }) {
  const [form] = Form.useForm();
  const onCloseDialog = () => {
    onChangeVisibled();
    form.resetFields();
    
  };
  useEffect(() => {
    if (data) {
      form.setFieldsValue(data);
    }
  }, [data]);
  const formSubmit = async (dataForm) => {
    let newValues = values;
    newValues?.email = newValues?.email?.toLowerCase();
    if (data) {
      const response = await editOrg(data?._id, newValues);
      if (response) {
        toast(CONSTANTS.SUCCESS, TOAST_MESSAGE.ORG.EDIT);
        callAPI();
        onCloseDialog();
      }
    } else {
      const response = await createOrg(newValues);
      if (response) {
        toast(CONSTANTS.SUCCESS, TOAST_MESSAGE.ORG.CREATE);
        callAPI();
        onCloseDialog();
      }
    }
  };
  return (
    <div>
      <Modal
        visible={visibled}
        onCancel={onCloseDialog}
        footer={null}
        className="modal-add-org"
        title={data ? "Chỉnh sửa tổ chức" : "Thêm mới tổ chức"}
        width={700}
      >
        <Loading active={isLoading}>
          <Form form={form} labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} onFinish={formSubmit} size="default">
            <Form.Item
              label="Tên tổ chức"
              name="name"
              className="input-large"
              rules={[{ required: true, message: "Tên tổ chức không thể để trống" }, { validator: validateSpaceNull }]}
            >
              <Input placeholder="Vui lòng nhập tên tổ chức" />
            </Form.Item>
            <Form.Item
              label="Email tổ chức"
              name="email"
              rules={[
                { required: true, message: "Email không thể để trống" },
                { validator: validateSpaceNull },
                RULES.EMAIL,
              ]}
              className="input-large"
            >
              <Input placeholder="Vui lòng nhập email tổ chức"></Input>
            </Form.Item>
            <Form.Item
              label="Địa chỉ"
              name="address"
              className="input-large"
              rules={[{ required: true, message: "Địa chỉ không thể để trống" }, { validator: validateSpaceNull }]}
            >
              <Input placeholder="Vui lòng nhập địa chỉ" />
            </Form.Item>
            <Form.Item
              label="Số điện thoại"
              name="phone"
              className="input-large"
              rules={[{ required: true, message: "Số điện thoại không thể để trống" }, RULES.PHONE_NUMBER]}
            >
              <Input placeholder="Vui lòng nhập số điện thoại" />
            </Form.Item>
            <Form.Item
              label="Loại tổ chức"
              name="type"
              className="input-large"
              rules={[{ required: true, message: "Loại tổ chức không thể để trống" }]}
            >
              <Select placeholder="Loại tổ chức" allowClear>
                {SELECT_ROLE_CREATE_ORG.map((res, index) => (
                  <Select.Option value={res.value} key={index}>
                    {res.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <div className="btn_action">
             
              <Button className="btn_cancel" onClick={onCloseDialog}>
                Huỷ thao tác
              </Button>
              <Button type="primary" htmlType="submit">
                {data ? "Lưu thông tin" : "Tạo mới"}
              </Button>
            </div>
          </Form>
          
        </Loading>
      </Modal>
    </div>
  );
}
function mapStateToProps(store) {
  const { isLoading } = store.app;
  return { isLoading };
}
export default connect(mapStateToProps)(ModalAddToChuc);






