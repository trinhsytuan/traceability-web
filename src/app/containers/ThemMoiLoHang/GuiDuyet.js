import ChoKiemDinh from '@assets/icons/chokiemdinh-icon.svg';
import DangTao from '@assets/icons/dangtao-icon.svg';
import HoanTatKiemDinh from '@assets/icons/hoantatkiemdinh-icon.svg';
import TuChoiKiemDinh from '@assets/icons/tuchoikiemdinh-icon.svg';
import { BROWSING_COLOR, CONSTANTS, RESULT_SENDING, STATUS_PARCEL_ENDORSER, TOAST_MESSAGE } from '@constants';
import { Button, Checkbox, Col, Form, Input, Row, Select, Tooltip } from 'antd';
import Modal from 'antd/lib/modal/Modal';
import React, { useEffect, useState } from 'react';
import './GuiDuyet.scss';
import { GetListUser, sendtoBrowser } from '@app/services/GuiDuyet';
import { toast } from '@app/common/functionCommons';
import Loading from '@components/Loading';
import { connect } from 'react-redux';

GuiDuyet.propTypes = {};

function GuiDuyet({ onVisible, changeVisible, data, maLo, isLoading, update, idParcel, updateCP }) {
  const [form] = Form.useForm();
  const [checkboxes, setCheckboxes] = useState({});
  const [user, setUser] = useState(null);
  const [checkedsAll, setCheckedAll] = useState(false);

  const formSubmit = async (values) => {
    let isDuyet = true;
    let dataPush = [];
    const valueKeys = Object.keys(checkboxes);
    for (let i = 0; i < Object.keys(checkboxes).length; i++) {
      if (!checkboxes[valueKeys[i]] && !data[valueKeys[i]].status_producer) continue;
      if (checkboxes[valueKeys[i]] == true) {
        if (
          data[valueKeys[i]].status_producer &&
          data[valueKeys[i]].status_producer === STATUS_PARCEL_ENDORSER.BROWSING &&
          data[valueKeys[i]].browser_producer === values[`select_user${valueKeys[i]}`]
        )
          continue;
        if (
          data[valueKeys[i]].status_producer &&
          data[valueKeys[i]].status_producer != STATUS_PARCEL_ENDORSER.CREATING &&
          data[valueKeys[i]].status_producer != STATUS_PARCEL_ENDORSER.BROWSING &&
          data[valueKeys[i]].status_producer != RESULT_SENDING.DENIED
        )
          continue;

        dataPush.push({
          browser_producer: values[`select_user${valueKeys[i]}`],
          status_producer: STATUS_PARCEL_ENDORSER.BROWSING,
          _id: data[valueKeys[i]]._id,
        });
      } else {
        if (data[valueKeys[i]].status_producer && data[valueKeys[i]].status_producer != STATUS_PARCEL_ENDORSER.BROWSING)
          continue;
        dataPush.push({
          browser_producer: values[`select_user${valueKeys[i]}`],
          status_producer: STATUS_PARCEL_ENDORSER.CREATING,
          _id: data[valueKeys[i]]._id,
        });
        isDuyet = false;
      }
    }
    if (dataPush.length == 0) {
      toast(CONSTANTS.ERROR, TOAST_MESSAGE.PARCEL.EMPTY_GUI_DUYET);
      return;
    }
    const response = await sendtoBrowser(dataPush, idParcel);
    if (response) {
      if (isDuyet) toast(CONSTANTS.SUCCESS, TOAST_MESSAGE.PARCEL.SENT_TO_ENDORSER);
      else toast(CONSTANTS.SUCCESS, TOAST_MESSAGE.PARCEL.EDIT_SENT_TO_ENDORSER);
      update();
    }
    onCancel();
  };
  const onCancel = () => {
    update();
    form.setFieldsValue();
    setCheckboxes({});
    setCheckedAll(false);
    changeVisible();
  };

  const handleCheckboxChange = (index) => {
    setCheckboxes((prevCheckboxes) => ({
      ...prevCheckboxes,
      [index]: !prevCheckboxes[index],
    }));
  };

  const handleSelectAllChange = (e) => {
    const checked = e.target.checked;
    const updatedCheckboxes = {};
    data.forEach((res, index) => {
      if (
        !res.status_producer ||
        res.status_producer == STATUS_PARCEL_ENDORSER.CREATING ||
        res.status_producer == STATUS_PARCEL_ENDORSER.BROWSING
      ) {
        updatedCheckboxes[index] = checked;
      } else {
        updatedCheckboxes[index] = checkboxes[index] || false;
      }
    });
    setCheckboxes(updatedCheckboxes);
  };

  const checkedAll = (e) => {
    handleSelectAllChange(e);
    setCheckedAll(e.target.checked);
  };

  const handleEdit = (values) => {
    if (
      !values?.status_producer ||
      values?.status_producer === STATUS_PARCEL_ENDORSER.CREATING ||
      values?.status_producer === STATUS_PARCEL_ENDORSER.BROWSING ||
      values?.status_producer === RESULT_SENDING.DENIED
    )
      return false;
    else return true;
  };

  useEffect(() => {
    if (onVisible == false) return;
    setCheckboxes({});
    GetListUser().then((data) => {
      setUser(data);
    });
    setCheckedAll(true);
    for (let i = 0; i < data.length; i++) {
      if (!data[i].status || data[i]?.status == STATUS_PARCEL_ENDORSER.CREATING) {
        setCheckedAll(false);
        break;
      }
    }
  }, [onVisible, updateCP]);
  useEffect(() => {
    if (!data || data.length <= 0 || Object.keys(checkboxes).length < data.length) setCheckedAll(false);
    else {
      const allChecked = Object.values(checkboxes).every((checkbox) => checkbox);
      setCheckedAll(allChecked);
    }
  }, [checkboxes]);
  return (
    <div>
      <Modal
        visible={onVisible}
        onCancel={onCancel}
        title={`Gửi duyệt quy trình sản xuất cho lô hàng ${maLo}`}
        footer={null}
        width={800}
      >
        <Loading active={isLoading}>
          <Form form={form} onFinish={formSubmit}>
            <div className="modal-guiduyet-container">
              <div className="DanhSachSanPham__details">
                <div className="ct_details">
                  <img src={DangTao}/>
                  <span>Đang tạo</span>
                </div>
                <div className="ct_details">
                  <img src={ChoKiemDinh}/>
                  <span>Chờ duyệt</span>
                </div>
                <div className="ct_details">
                  <img src={TuChoiKiemDinh}/>
                  <span>Từ chối duyệt</span>
                </div>
                <div className="ct_details">
                  <img src={HoanTatKiemDinh}/>
                  <span>Hoàn tất duyệt</span>
                </div>
              </div>
              <div className="modal-guiduyet-checkboxAll">
                <Form.Item name="cb-all">
                  <Row>
                    <Checkbox name="cb_selectAll" className="cb_selectAll" onClick={checkedAll} checked={checkedsAll}>
                      Chọn tất cả
                    </Checkbox>
                  </Row>
                </Form.Item>
              </div>
              <div className="modal-guiduyet-item">
                {data.map((res, index) => {
                  let userAction = null;
                  if (
                    checkboxes[index] == undefined &&
                    res.status_producer != undefined &&
                    res.status_producer != STATUS_PARCEL_ENDORSER.CREATING
                  ) {
                    handleCheckboxChange(index);
                  }
                  if (res.browser_producer && res.status_producer != STATUS_PARCEL_ENDORSER.CREATING)
                    userAction = res.browser_producer;
                  return (
                    <Row className="modal-guiduyet-row" gutter={[8, 8]} key={index}>
                      <Form.Item name={`cb_item${index}`} valuePropName="checked">
                        <Col xxl={1} xl={1} lg={1} md={1} sm={2} xs={2}>
                          <Checkbox
                            name={`cb_item${index}`}
                            checked={checkboxes[index]}
                            disabled={handleEdit(res)}
                            onChange={() => handleCheckboxChange(index)}
                          ></Checkbox>
                        </Col>
                      </Form.Item>
                      <Col xxl={8} xl={8} lg={7} md={7} sm={11} xs={11} className="row-text-status">
                        <Form.Item>
                          <Tooltip placement="top" title={`Bước ${res.stepIndex}: ${res.name}`}>
                            <Input
                              style={BROWSING_COLOR[res.status_producer]}
                              value={`Bước ${res.stepIndex}: ${res.name}`}
                              readOnly
                              disabled={handleEdit(res)}
                            ></Input>
                          </Tooltip>
                        </Form.Item>
                      </Col>
                      <Col xxl={15} xl={15} lg={16} md={16} sm={11} xs={11}>
                        <Form.Item
                          name={`select_user${index}`}
                          initialValue={userAction}
                          rules={
                            checkboxes[index] && !handleEdit(res)
                              ? [
                                {
                                  required: true,
                                  message: 'Bạn cần chọn một người!',
                                },
                              ]
                              : null
                          }
                        >
                          <Select
                            placeholder="Chọn người phụ trách"
                            style={{ width: '100%' }}
                            filterOption={(inputValue, option) =>
                              option.label.toLowerCase().indexOf(inputValue.toLowerCase()) !== -1
                            }
                            disabled={handleEdit(res)}
                          >
                            {user &&
                              user.map((data, index) => (
                                <Select.Option key={index} value={data._id}>
                                  {data?.name || data?.email}
                                </Select.Option>
                              ))}
                          </Select>
                        </Form.Item>
                      </Col>
                    </Row>
                  );
                })}
              </div>
              <div className="btn_submitForm">
                <Button className="btn-cancel" onClick={onCancel}>
                  Huỷ thao tác
                </Button>
                <Button type="primary" htmlType="submit" className="btn_submit">
                  Gửi duyệt
                </Button>
              </div>
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

export default connect(mapStateToProps)(GuiDuyet);


