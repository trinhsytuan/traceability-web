import DangGuiDuyet from "@assets/icons/DangGuiDuyet-icon.svg";
import DangGan from "@assets/icons/DangGan-icon.svg";
import TuChoiKiemDinh from "@assets/icons/tuchoikiemdinh-icon.svg";
import {
  BROWSING_COLOR,
  CONSTANTS,
  RESULT_SENDING,
  STATUS_ENDORSER,
  STATUS_PARCEL_ENDORSER,
  STATUS_PRODUCER_KD,
  TOAST_MESSAGE,
} from "@constants";
import { Button, Checkbox, Col, Form, Input, Row, Select, Tooltip } from "antd";
import Modal from "antd/lib/modal/Modal";
import React, { useEffect, useState } from "react";
import "./GuiDuyetKiemDinh.scss";
import {
  GetListUser,
  sendToBrowserInEndorser,
  sendtoBrowser,
} from "@app/services/GuiDuyet";
import { toast } from "@app/common/functionCommons";
import Loading from "@components/Loading";
import { connect } from "react-redux";
GuiDuyetKiemDinh.propTypes = {};

function GuiDuyetKiemDinh({
  onVisible,
  changeVisible,
  data,
  maLo,
  isLoading,
  handleReload,
  idParcel,
  update,
}) {
  const [form] = Form.useForm();
  const [checkboxes, setCheckboxes] = useState({});
  const [user, setUser] = useState(null);
  const [checkedsAll, setCheckedAll] = useState(false);
  const formSubmit = async (values) => {
    let isDuyet = true;
    let dataPush = [];
    const valueKeys = Object.keys(checkboxes);
    for (let i = 0; i < Object.keys(checkboxes).length; i++) {
      if (!checkboxes[valueKeys[i]] && !data[valueKeys[i]].status_endorser)
        continue;
      if (
        checkboxes[valueKeys[i]] &&
        data[valueKeys[i]]?.status_endorser ==
          STATUS_PARCEL_ENDORSER.BROWSING &&
        data[valueKeys[i]]?.browser_endorser ==
          values[`select_user${valueKeys[i]}`]
      )
        continue;
      if (
        checkboxes[valueKeys[i]] == true &&
        !data[valueKeys[i]].result_reception
      ) {
        // if (
        //   data[valueKeys[i]].status_endorser &&
        //   data[valueKeys[i]].status_endorser != STATUS_PARCEL_ENDORSER.ASSIGNED &&
        //   data[valueKeys[i]].status_endorser != STATUS_PARCEL_ENDORSER.BROWSING
        // )
        //   continue;
        dataPush.push({
          browser_endorser: values[`select_user${valueKeys[i]}`],
          status_endorser: STATUS_PARCEL_ENDORSER.BROWSING,
          _id: data[valueKeys[i]]._id,
        });
      } else {
        // if (data[valueKeys[i]].status_endorser && data[valueKeys[i]].status_endorser != STATUS_PARCEL_ENDORSER.BROWSING)
        //   continue;
        dataPush.push({
          browser_endorser: values[`select_user${valueKeys[i]}`],
          status_endorser: STATUS_PARCEL_ENDORSER.ASSIGNED,
          _id: data[valueKeys[i]]._id,
        });
        isDuyet = false;
      }
    }
    if (dataPush.length == 0) {
      toast(CONSTANTS.ERROR, TOAST_MESSAGE.PARCEL.EMPTY_GUI_DUYET);
      return;
    }
    if (dataPush.length > 0) {
      const response = await sendToBrowserInEndorser(dataPush, idParcel);
      if (response) {
        if (isDuyet)
          toast(CONSTANTS.SUCCESS, TOAST_MESSAGE.PARCEL.SENT_TO_ENDORSER);
        else
          toast(CONSTANTS.SUCCESS, TOAST_MESSAGE.PARCEL.EDIT_SENT_TO_ENDORSER);
        update(new Date());
      }
    }
    onCancel();
  };
  const onCancel = () => {
    handleReload();
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
        res.status_endorser == STATUS_PARCEL_ENDORSER.CREATING ||
        res.status_endorser == STATUS_PARCEL_ENDORSER.BROWSING
      ) {
        updatedCheckboxes[index] = checked;
      } else {
        updatedCheckboxes[index] = checked;
      }
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
    if (onVisible == false) return;
    setCheckboxes({});
    GetListUser().then((data) => {
      setUser(data);
    });
    setCheckedAll(true);
    for (let i = 0; i < data.length; i++) {
      if (
        !data[i].status ||
        data[i]?.status != STATUS_PARCEL_ENDORSER.BROWSING
      ) {
        setCheckedAll(false);
        break;
      }
    }
  }, [onVisible]);
  useEffect(() => {
    if (
      !data ||
      data.length <= 0 ||
      Object.keys(checkboxes).length < data.length
    )
      setCheckedAll(false);
    else {
      const allChecked = Object.values(checkboxes).every(
        (checkbox) => checkbox
      );
      setCheckedAll(allChecked);
    }
  }, [checkboxes]);

  return (
    <div>
      <Modal
        visible={onVisible}
        onCancel={onCancel}
        title={`Gửi duyệt quy trình kiểm định cho lô hàng ${maLo}`}
        footer={null}
        width={800}
      >
        <Loading active={isLoading}>
          <Form form={form} onFinish={formSubmit}>
            <div className="modal-GuiDuyetKiemDinh-container">
              <div className="DanhSachSanPham__details">
                <div className="ct_details">
                  <img src={DangGan} />
                  <span>Đang gán</span>
                </div>
                <div className="ct_details">
                  <img src={DangGuiDuyet} />
                  <span>Đang gửi duyệt</span>
                </div>
                <div className="ct_details">
                  <img src={TuChoiKiemDinh} />
                  <span>Từ chối duyệt</span>
                </div>
              </div>
              <div className="modal-GuiDuyetKiemDinh-checkboxAll">
                <Form.Item name="cb-all">
                  <Row>
                    <Checkbox
                      name="cb_selectAll"
                      className="cb_selectAll"
                      onClick={checkedAll}
                      checked={checkedsAll}
                    >
                      Chọn tất cả
                    </Checkbox>
                  </Row>
                </Form.Item>
              </div>
              <div className="modal-GuiDuyetKiemDinh-item">
                {data.map((res, index) => {
                  let userAction = null;
                  if (
                    checkboxes[index] == undefined &&
                    res?.status_endorser != STATUS_PARCEL_ENDORSER.ASSIGNED
                  ) {
                    handleCheckboxChange(index);
                  }
                  if (
                    res.browser_endorser &&
                    res.status_endorser != STATUS_PARCEL_ENDORSER.ASSIGNED
                  )
                    userAction = res.browser_endorser;
                  return (
                    <Row
                      className="modal-GuiDuyetKiemDinh-row"
                      gutter={[8, 8]}
                      key={index}
                    >
                      <Form.Item
                        name={`cb_item${index}`}
                        valuePropName="checked"
                      >
                        <Col xxl={1} xl={1} lg={1} md={1} sm={2} xs={2}>
                          <Checkbox
                            name={`cb_item${index}`}
                            checked={checkboxes[index]}
                            disabled={handleEdit(res)}
                            onChange={() => handleCheckboxChange(index)}
                          ></Checkbox>
                        </Col>
                      </Form.Item>
                      <Col
                        xxl={8}
                        xl={8}
                        lg={7}
                        md={7}
                        sm={11}
                        xs={11}
                        className="row-text-status"
                      >
                        <Form.Item>
                          <Tooltip
                            placement="top"
                            title={`Bước ${res.stepIndex}: ${res.name}`}
                          >
                            <Input
                              style={BROWSING_COLOR[res.status_endorser]}
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
                                    message: "Bạn cần chọn một người!",
                                  },
                                ]
                              : null
                          }
                        >
                          <Select
                            placeholder="Chọn người phụ trách"
                            style={{ width: "100%" }}
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
  const { myInfo } = store.user;
  return { isLoading, myInfo };
}
export default connect(mapStateToProps)(GuiDuyetKiemDinh);
