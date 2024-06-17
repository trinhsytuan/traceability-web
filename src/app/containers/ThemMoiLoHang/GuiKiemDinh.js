import { GetListBrowser } from '@app/services/GuiDuyet';
import ChoKiemDinh from '@assets/icons/chokiemdinh-icon.svg';
import DangTao from '@assets/icons/dangtao-icon.svg';
import TuChoiKiemDinh2 from '@assets/icons/tuchoikiemdinh-icon.svg';
import TuChoiKiemDinh from '@assets/icons/refused-icon.svg';
import Loading from '@components/Loading';
import { BROWSING_COLOR, CONSTANTS, STATUS_PARCEL_ENDORSER, TOAST_MESSAGE } from '@constants';
import { Button, Checkbox, Col, Form, Input, Row, Select, Tooltip } from 'antd';
import Modal from 'antd/lib/modal/Modal';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import './GuiKiemDinh.scss';
import { toast } from '@app/common/functionCommons';

GuiKiemDinh.propTypes = {};

function GuiKiemDinh({ onVisible, changeVisible, data, maLo, isLoading, update, submitProp, idParcel, updateCP }) {
  const [form] = Form.useForm();
  const [checkboxes, setCheckboxes] = useState({});
  const [user, setUser] = useState(null);
  const [checkedsAll, setCheckedAll] = useState(false);
  const formSubmit = async (values) => {
    let dataPush = [];
    const valueKeys = Object.keys(checkboxes);

    for (let i = 0; i < Object.keys(checkboxes).length; i++) {


      if (!checkboxes[valueKeys[i]] && !data[valueKeys[i]].status) continue;

      if (checkboxes[valueKeys[i]] == true) {


        if (
          data[valueKeys[i]].status === STATUS_PARCEL_ENDORSER.SENDING && data[valueKeys[i]]?.endorser?._id === values[`select_user${valueKeys[i]}`]
        )
          continue;

        dataPush.push({
          endorser: values[`select_user${valueKeys[i]}`],
          status: STATUS_PARCEL_ENDORSER.SENDING,
          _id: data[valueKeys[i]]._id,
        });
      } else {

        dataPush.push({
          endorser: values[`select_user${valueKeys[i]}`],
          status: STATUS_PARCEL_ENDORSER.CREATING,
          _id: data[valueKeys[i]]._id,
        });
      }
    }
    if (dataPush.length == 0) {
      toast(CONSTANTS.ERROR, TOAST_MESSAGE.PARCEL.EMPTY_GUI_KIEM_DINH);
      return;
    }
    submitProp(dataPush);

    onCancel();
  };
  const onCancel = () => {
    changeVisible();
    form.setFieldsValue();
    setCheckboxes({});
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
      updatedCheckboxes[index] = checked;
    });
    setCheckboxes(updatedCheckboxes);
  };
  const checkedAll = (e) => {
    handleSelectAllChange(e);
    setCheckedAll(e.target.checked);
  };

  const handleEdit = (values) => {
    return false;
  };
  useEffect(() => {
    setCheckboxes({});
    if (onVisible == false) return;
    GetListBrowser().then((data) => {
      setUser(data);
    });
    let checkedStatus = true;
    for (let i = 0; i < data.length; i++) {
      if (
        !data[i].status ||
        data[i]?.status == STATUS_PARCEL_ENDORSER.CREATING ||
        data[i]?.status == STATUS_PARCEL_ENDORSER.BROWSING
      ) {
        checkedStatus = false;
        break;
      }
    }
    setCheckedAll(checkedStatus);
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
        title={`Gửi kiểm định cho lô hàng ${maLo}`}
        footer={null}
        width={800}
      >
        <Loading active={isLoading}>
          <Form form={form} onFinish={formSubmit}>
            <div className="modal-GuiKiemDinh-container">
              <div className="DanhSachSanPham__details">
                <div className="ct_details">
                  <img src={DangTao}/>
                  <span>Chờ gửi kiểm định</span>
                </div>
                <div className="ct_details">
                  <img src={ChoKiemDinh}/>
                  <span>Đang kiểm định</span>
                </div>
                <div className="ct_details">
                  <img src={TuChoiKiemDinh}/>
                  <span>Từ chối yêu cầu kiểm định</span>
                </div>
                <div className="ct_details">
                  <img src={TuChoiKiemDinh2}/>
                  <span>Chưa đạt yêu cầu kiểm định</span>
                </div>
              </div>
              <div className="modal-GuiKiemDinh-checkboxAll">
                <Form.Item name="cb-all">
                  <Row>
                    <Checkbox name="cb_selectAll" className="cb_selectAll" onClick={checkedAll} checked={checkedsAll}>
                      Chọn tất cả
                    </Checkbox>
                  </Row>
                </Form.Item>
              </div>
              <div className="modal-GuiKiemDinh-item">
                {data.map((res, index) => {
                  let userAction = null;
                  if (
                    onVisible &&
                    checkboxes[index] == undefined &&
                    res.status != undefined &&
                    res?.status == STATUS_PARCEL_ENDORSER.SENDING
                  ) {
                    handleCheckboxChange(index);
                  }
                  if (
                    onVisible &&
                    res.endorser &&
                    res.status != undefined &&
                    res?.status == STATUS_PARCEL_ENDORSER.SENDING
                  )
                    userAction = res.endorser._id;
                  return (
                    <Row className="modal-GuiKiemDinh-row" gutter={[8, 8]} key={index}>
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
                          <Tooltip placement="top" title={`Bước ${res.stepIndex}: ${res.name}`}
                                   color={BROWSING_COLOR[res.status].color}>
                            <Input
                              className={`status-input-${res.status}`}
                              style={BROWSING_COLOR[res.status]}
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
                                  message: 'Bạn cần chọn một trung tâm kiểm định!',
                                },
                              ]
                              : null
                          }
                        >
                          <Select
                            placeholder="Chọn trung tâm kiểm định"
                            style={{ width: '100%' }}
                            disabled={handleEdit(res)}
                            filterOption={(inputValue, option) =>
                              option.label.toLowerCase().indexOf(inputValue.toLowerCase()) !== -1
                            }
                          >
                            {user &&
                              user.map((data, index) => (
                                <Select.Option key={index} value={data._id}>
                                  {data.name}
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
                  Gửi kiểm định
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
  const { myInfo } = store.user;
  return { isLoading, myInfo };
}

export default connect(mapStateToProps)(GuiKiemDinh);


