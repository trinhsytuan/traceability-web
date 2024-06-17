import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Modal from "antd/lib/modal/Modal";
import { connect } from "react-redux";
import { Button, Col, Form, Input, Row, Select } from "antd";
import { getAll as getAllMyOrgUser } from "@app/services/NhanVien";
import { changeInspector } from "@app/services/QLKiemDinh";
PhanCongKiemDinhStep.propTypes = {};

function PhanCongKiemDinhStep({ data, visible, onChangeVisible, isLoading }) {
  const [form] = Form.useForm();
  const [myOrgUsers, setMyOrgUsers] = useState([]);
  useEffect(() => {
    const getInitData = async () => {
      const res = await getAllMyOrgUser();
      if (res) {
        const options = res?.docs?.map((value) => {
          return {
            value: value._id,
            label: value.name,
          };
        });
        setMyOrgUsers(options);
      }
    };
    getInitData();
  }, []);
  const onFinish = async (values) => {
    if (values.inspector) {
      const res = await changeInspector(data._id, values);
      if (res) {
        onChangeVisible();
      }
    }
  };
  return (
    <div>
      <Modal
        visible={visible}
        onCancel={onChangeVisible}
        width={800}
        footer={null}
        title={`Phân công nhân viên cho quy trình ${data?.name}`}
      >
        <Form
          form={form}
          layout="horizontal"
          id="formModal"
          name="form-nhan-vien"
          requiredMark={false}
          className="custom-form"
          onFinish={onFinish}
        >
          <Row gutter={10}>
            <Form.Item name="id" hidden>
              <Input />
            </Form.Item>

            <Col span={24}>
              <Form.Item
                label={
                  <span>
                    Nhân viên kiểm định<span className="form-item-remark">*</span>{" "}
                  </span>
                }
                name="inspector"
                className="form-item-container"
                labelCol={{ xl: 6, md: 8, sm: 24 }}
                wrapperCol={{ xl: { span: 17, offset: 1 }, md: { span: 15, offset: 3 }, sm: { span: 24, offset: 0 } }}
                rules={[{ required: true, message: "Nhân viên kiểm định không được bỏ trống" }]}
                initialValue={data?.inspector?._id}
              >
                <Select
                  notFoundContent="Không tồn tại nhân viên!"
                  showSearch
                  placeholder="Chọn nhân viên kiểm định"
                  optionFilterProp="children"
                  filterOption={(input, option) => (option?.label ?? "").includes(input)}
                  filterSort={(optionA, optionB) =>
                    (optionA?.label ?? "").toLowerCase().localeCompare((optionB?.label ?? "").toLowerCase())
                  }
                  options={myOrgUsers}
                />
              </Form.Item>
            </Col>

            <Col span={24} className="form-footer">
              <Button size="small" onClick={onChangeVisible} disabled={isLoading} className="btn-footer btn-cancel">
                Huỷ thao tác
              </Button>

              <Button
                size="small"
                htmlType="submit"
                loading={isLoading}
                form="formModal"
                className="btn-footer btn-submit"
              >
                Gửi yêu cầu
              </Button>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
}
function mapStateToProps(store) {
  const { isLoading } = store.app;
  return { isLoading };
}

export default connect(mapStateToProps)(PhanCongKiemDinhStep);

