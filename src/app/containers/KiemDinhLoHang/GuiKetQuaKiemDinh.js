import { CONSTANTS, RESULT_SENDING, TOAST_MESSAGE } from '@constants';
import { Button, Checkbox, Col, Form, Input, Modal, Row, Select, Tooltip } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import './GuiKetQuaKiemDinh.scss';
import TextArea from 'antd/lib/input/TextArea';
import { toast, validateSpaceNull } from '@app/common/functionCommons';

function GuiKetQuaKiemDinh({ onVisible, setVisible, infoProduct, newData, myInfo, onSubmit }) {
  const [form] = Form.useForm();
  const [form2] = Form.useForm();
  const [infoOrg, setInfoOrg] = useState(null);
  const [showNotKD, setShowNotKD] = useState([]);
  const [showTextArea, setShowTextArea] = useState([]);
  const [checkboxes, setCheckboxes] = useState({});
  const [checkedAll, setCheckedAll] = useState(false);
  useEffect(() => {
    if (onVisible) {
      callAPI();
    }
  }, [infoProduct, onVisible]);
  const callAPI = async () => {
    form.setFieldsValue({
      nameProduct: infoProduct?.product?.name,
      codeProduct: infoProduct?.name,
      username: infoProduct?.org?.name,
    });
  };

  const handleCheckboxChange = useCallback((index) => {
    setCheckboxes((prevCheckboxes) => ({
      ...prevCheckboxes,
      [index]: !prevCheckboxes[index],
    }));
  }, []);

  const handleEdit = (res) => {
    // if (!res.status || res.status == RESULT_SENDING.DENIED || res.status !== RESULT_SENDING.ACCEPTED) return true;
    return false;
  };

  const handleCloseForm = () => {
    form.resetFields();
    form2.resetFields();
    setVisible();
  };

  const handleSelectChange = (e, index) => {
    setShowNotKD((prevShowNotKD) => {
      const updatedShowNotKD = [...prevShowNotKD];
      updatedShowNotKD[index] = e;
      return updatedShowNotKD;
    });

    setShowTextArea((prevShowTextArea) => {
      const updatedShowTextArea = [...prevShowTextArea];
      updatedShowTextArea[index] = e === RESULT_SENDING.REJECT; // Fix the condition here
      return updatedShowTextArea;
    });
  };

  const formSubmit = async (values) => {
    const keys = Object.keys(checkboxes);
    let dataPush = [];
    for (let i = 0; i < keys.length; i++) {
      if (!checkboxes[keys[i]] && !newData[keys[i]]?.result_inspection) continue;
      dataPush.push({
        _id: newData[keys[i]]._id,
        result_inspection: values[`select_status${keys[i]}`],
        description_response_inspection: !values[`desciption${[keys[i]]}`]
          ? "Đã chấp nhận"
          : values[`desciption${[keys[i]]}`],
      });
    }
    if (dataPush.length == 0) {
      toast(CONSTANTS.ERROR, TOAST_MESSAGE.PARCEL.EMPTY_GUI_KET_QUA);
      return;
    }
    onSubmit(dataPush);
    handleCloseForm();
  };
  const selectCheckBoxAll = (e) => {
    const { checked } = e.target;
    const updatedCheckbox = {};
    newData.forEach((item, index) => {
      updatedCheckbox[index] = checked;
    });
    setCheckedAll(checked);
    setCheckboxes(updatedCheckbox);
  };
  useEffect(() => {
    if (!newData || newData.length <= 0 || Object.keys(checkboxes).length < newData.length) setCheckedAll(false);
    else {
      const allChecked = Object.values(checkboxes).every((checkbox) => checkbox);
      setCheckedAll(allChecked);
    }
  }, [checkboxes]);

  return (
    <div className="form-guikq-kiemdinh">
      <Modal
        title="Gửi kết quả kiểm định"
        footer={null}
        width={700}
        onCancel={handleCloseForm}
        visible={onVisible}
        className="form-guikd-kiemdinh-modal"
      >
        <div className="form-kiem-dinh-content">
          <Form
            id="form-kiem-dinh"
            className="form-kiem-dinh"
            form={form}
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
          >
            <Form.Item label="Tổ chức sản xuất" name="username">
              <Input readOnly className="input-lg" />
            </Form.Item>
            <Form.Item label="Tên sản phẩm" name="nameProduct">
              <Input readOnly className="input-lg" />
            </Form.Item>
            <Form.Item label="Mã lô sản phẩm" name="codeProduct">
              <Input readOnly className="input-lg" />
            </Form.Item>
          </Form>
          <Form onFinish={formSubmit}>
            <Col xxl={24} xl={24} lg={24} md={24} sm={24} xs={24}>
              <Checkbox checked={checkedAll} onChange={selectCheckBoxAll} className="all_selected">
                Chọn tất cả
              </Checkbox>
            </Col>
            {newData.map((res, index) => {
              let status = null;
              if (
                checkboxes[index] === undefined &&
                (res.status_endorser === RESULT_SENDING.ENDORSED || res.status_endorser === RESULT_SENDING.DENIED)
              ) {
                handleCheckboxChange(index);
              }
              if (res.status_endorser === RESULT_SENDING.ENDORSED) {
                status = RESULT_SENDING.ENDORSED;
              } else if (res.status_endorser === RESULT_SENDING.DENIED) {
                status = RESULT_SENDING.DENIED;
              }

              return (
                <div key={index} className="guikd-map">
                  <Row className="modal-GuiKQKiemDinh-row" gutter={[8, 8]} key={index}>
                    <Col xxl={1} xl={1} lg={1} md={1} sm={2} xs={2}>
                      <Form.Item name={`checkbox_guikq${index}`}>
                        <Checkbox
                          checked={checkboxes[index]}
                          disabled={handleEdit(res)}
                          onChange={() => handleCheckboxChange(index)}
                        />
                      </Form.Item>
                    </Col>
                    <Col xxl={8} xl={8} lg={7} md={7} sm={11} xs={11} className="row-text-status">
                      <Form.Item>
                        <Tooltip placement="top" title={`Bước ${res.stepIndex}: ${res.name}`}>
                          <Input value={`Bước ${res.stepIndex}: ${res.name}`} readOnly disabled={handleEdit(res)} />
                        </Tooltip>
                      </Form.Item>
                    </Col>
                    <Col xxl={15} xl={15} lg={16} md={16} sm={11} xs={11}>
                      <Form.Item
                        name={`select_status${index}`}
                        rules={
                          checkboxes[index] && [{ required: true, message: "Bạn cần chọn một kết quả kiểm định!" }]
                        }
                        initialValue={status}
                      >
                        <Select
                          placeholder="Chọn kết quả kiểm định"
                          style={{ width: "100%" }}
                          onChange={(e) => handleSelectChange(e, index)}
                          disabled={handleEdit(res)}
                        >
                          <Select.Option value={RESULT_SENDING.ENDORSED}>Hoàn tất kiểm định</Select.Option>
                          <Select.Option value={RESULT_SENDING.REJECT}>Chưa đạt yêu cầu kiểm định</Select.Option>
                        </Select>
                      </Form.Item>
                    </Col>
                    {showTextArea[index] && (
                      <Col span={24}>
                        <Form.Item
                          name={`desciption${index}`}
                          className="description-cancel-kd"
                          label={
                            <span>
                              Nhập lý do chưa đạt yêu cầu <span style={{ color: "red" }}>(*)</span>
                            </span>
                          }
                          rules={[
                            { required: true, message: "Bạn cần nhập lý do chưa đạt yêu cầu!" },
                            { validator: validateSpaceNull },
                          ]}
                        >
                          <TextArea rows={4} placeholder="Nhập lý do chưa đạt yêu cầu" disabled={handleEdit(res)} />
                        </Form.Item>
                      </Col>
                    )}
                  </Row>
                </div>
              );
            })}
            <div className="btn_action-gkqkd">
              <Button className="btn-cancel" onClick={handleCloseForm}>
                Huỷ thao tác
              </Button>
              <Button type="primary" htmlType="submit">
                Gửi kết quả
              </Button>
            </div>
          </Form>
        </div>
      </Modal>
    </div>
  );
}

function mapStateToProps(store) {
  const { myInfo } = store.user;
  return { myInfo };
}

export default connect(mapStateToProps)(GuiKetQuaKiemDinh);
