import React, { useEffect, useState } from 'react';
import './DialogGhiNhatKySX.scss';
import { Button, DatePicker, Form, Input, Modal, Steps } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import ClockIcon from '@components/Icons/ClockIcon';
import { formatTimeDate, toast } from '@app/common/functionCommons';
import DialogDeleteConfim from '@components/DialogDeleteConfim/DialogDeleteConfim';
import { CONSTANTS, TOAST_MESSAGE } from '@constants';
import UploadImage from '@components/UploadImage/UploadImage';
import TextArea from 'antd/lib/input/TextArea';
import moment from 'moment';
import {
  addNewAuditProcedure,
  editAuditHistoryProcedure,
  getAllHistoryByStep,
  removeHistoryByStep,
} from '@app/services/GhiNhatKySX';
import { connect } from 'react-redux';
import Loading from '@components/Loading';

DialogGhiNhatKySX.propTypes = {};

function DialogGhiNhatKySX({
                             visible,
                             dialogData,
                             onClose,
                             disabled,
                             isLoading,
                           }) {
  const [dataStep, setDataStep] = useState([]);
  const [activeStep, setActiveStep] = useState(null);
  const [handleVisibleRemove, setHandleVisibleRemove] = useState(false);
  const [dataRemove, setDataRemove] = useState(null);
  const [dataShowDescription, setDataShowDescription] = useState(null);
  const { Step } = Steps;
  const [form] = Form.useForm();
  const [image, changeImage] = useState([]);
  const [remove, setRemove] = useState([]);
  useEffect(() => {
    callAPI();
  }, [dialogData]);
  const pushNewData = (data) => {
    changeImage(data);
  };
  const removeData = (data) => {
    setRemove([...remove, data]);
  };
  let handleReset = false;
  const OpenRemove = (data) => {
    setHandleVisibleRemove(true);
    setDataRemove(data);
  };
  const closeRemove = () => {
    setHandleVisibleRemove(false);
    setDataRemove(null);
  };
  const handleRemove = async () => {
    setActiveStep(null);
    setDataShowDescription(null);
    if (dataRemove?.new == true) {
      let newData = dataStep;
      var index = newData.indexOf(dataRemove);
      if (index !== -1) {
        newData.splice(index, 1);
      }
      setDataStep(newData);
    } else {
      const response = await removeHistoryByStep(dataRemove._id);
      if (response) {
        toast(CONSTANTS.SUCCESS, TOAST_MESSAGE.AUDIT.REMOVE);
        callAPI();
      }
    }

    closeRemove();
  };
  const callAPI = async () => {
    if (dialogData) {
      const response = await getAllHistoryByStep(dialogData._id);
      setDataStep(response);
    }
  };
  const handleAddStep = async () => {
    setActiveStep(0);
    form.resetFields();
    const dataAdd = {
      title: 'Thêm mới nhật ký',
      createdAt: new Date(),
      new: true,
      _id: Math.random(),
    };
    let dataOwn = [dataAdd, ...dataStep];
    setDataStep(dataOwn);
    setDataShowDescription({ ...dataAdd, stepActive: 0 });
    changeImage([]);
    setRemove([]);
    setActiveStep(0);
  };
  const onChangeStep = (e) => {
    if (handleReset) {
      setDataShowDescription(null);
      handleReset = false;
      return;
    }

    setDataShowDescription({ ...dataStep[e], stepActive: e });
    if (dataStep[e] && activeStep != e) {
      form.setFieldsValue({
        title: dataStep[e]?.new ? '' : dataStep[e].title,
        time_start: dataStep[e]?.timeStart
          ? moment(dataStep[e]?.timeStart, 'YYYY-MM-DD')
          : null,
        time_end: dataStep[e]?.timeEnd
          ? moment(dataStep[e]?.timeEnd, 'YYYY-MM-DD')
          : null,
        description: dataStep[e]?.description,
      });
      if (dataStep[e]?.medias) changeImage(dataStep[e]?.medias);
      else changeImage([]);
    }
    setActiveStep(e);
  };
  const huyTT = () => {
    if (dataShowDescription?.new == true) {
      let newData = dataStep;
      if (dataShowDescription?.stepActive !== -1) {
        newData.splice(dataShowDescription?.stepActive, 1);
      }
      setDataStep(newData);
    }
    form.resetFields();
    handleReset = true;
    setActiveStep(null);
    setDataShowDescription(null);
  };

  const formSubmit = async (e) => {
    if (dataShowDescription?.new && dialogData) {
      const response = await addNewAuditProcedure(
        { ...e, image },
        dialogData._id,
      );
      if (response) {
        toast(CONSTANTS.SUCCESS, TOAST_MESSAGE.AUDIT.CREATE_NEW);
      }
    } else if (dialogData && dataShowDescription) {
      const response = await editAuditHistoryProcedure(
        { ...e, image },
        dataShowDescription?._id,
        remove,
      );
      if (response) {
        toast(CONSTANTS.SUCCESS, TOAST_MESSAGE.AUDIT.EDIT);
        console.log(response);
      }
    }
    setDataShowDescription(null);
    setActiveStep(-1);
    callAPI();
  };
  return (
    <Loading active={isLoading}>
      <div>
        <Modal
          visible={visible}
          title={`Ghi nhật ký sản xuất cho bước ${dialogData?.name}`}
          width={1000}
          footer={null}
          onCancel={onClose}
          className="dialog-write-history-sx"
        >
          <div
            className={
              dataStep?.length == 0 ? 'btn-add-new-notfound' : 'btn-add-new'
            }
          >
            {dataStep?.length == 0 && disabled && (
              <span className="not-found-history">
                Không có nhật ký sản xuất, vui lòng thêm mới
              </span>
            )}
            {dataStep?.length == 0 && !disabled && (
              <span className="not-found-history">
                Không có nhật ký sản xuất cho bước này
              </span>
            )}
            {disabled && (
              <Button
                type="primary"
                className="button_reverse btn-reverse"
                icon={<PlusOutlined/>}
                onClick={handleAddStep}
              >
                Thêm mới
              </Button>
            )}
          </div>

          <Steps
            direction="vertical"
            current={dataStep?.length}
            className="steps-action"
            onChange={onChangeStep}
          >
            {dataStep.map((res, index) => {
              return (
                <Step
                  key={index}
                  title={
                    <div className="NKKD-btnAction">
                      <div
                        className={activeStep == index ? 'title-active' : ''}
                      >
                        {res?.title}
                      </div>
                      <Button
                        className="btn-footer btn-cancel"
                        size="medium"
                        type="default"
                        onClick={() => OpenRemove(res)}
                      >
                        Xoá nhật ký
                      </Button>
                    </div>
                  }
                  icon={<ClockIcon/>}
                  description={
                    <div>
                      <div>{formatTimeDate(res?.createdAt)}</div>
                      {dataShowDescription?.stepActive == index &&
                        activeStep == index && (
                          <div className="content-bg">
                            <Form
                              form={form}
                              labelCol={{ span: 6 }}
                              wrapperCol={{ span: 18 }}
                              onFinish={formSubmit}
                            >
                              <Form.Item
                                label="Chủ đề"
                                name="title"
                                rules={[
                                  {
                                    required: true,
                                    message: 'Chủ đề không thể để trống',
                                  },
                                ]}
                              >
                                <Input
                                  placeholder="Nhập chủ đề"
                                  size="large"
                                  style={{
                                    backgroundColor: disabled
                                      ? '#FFFFFF'
                                      : 'F5F5F5',
                                  }}
                                  disabled={!disabled}
                                />
                              </Form.Item>

                              <Form.Item label="Ngày bắt đầu" name="time_start">
                                <DatePicker
                                  style={{ width: '100%' }}
                                  placeholder="Ngày bắt đầu"
                                  format="DD/MM/YYYY"
                                  size="large"
                                  disabled={!disabled}
                                />
                              </Form.Item>
                              <Form.Item
                                label="Ngày kết thúc"
                                name="time_end"
                                rules={[
                                  ({ getFieldValue }) => ({
                                    validator(_, value) {
                                      const fromDate = getFieldValue(
                                        'time_start',
                                      );
                                      if (
                                        !value ||
                                        !fromDate ||
                                        fromDate <= value
                                      ) {
                                        return Promise.resolve();
                                      }
                                      return Promise.reject(
                                        new Error(
                                          'Ngày kết thúc không được trước ngày bắt đầu!',
                                        ),
                                      );
                                    },
                                  }),
                                ]}
                              >
                                <DatePicker
                                  style={{ width: '100%' }}
                                  placeholder="Ngày kết thúc"
                                  format="DD/MM/YYYY"
                                  size="large"
                                  disabled={!disabled}
                                />
                              </Form.Item>
                              <Form.Item label="Mô tả" name="description">
                                <TextArea
                                  rows={5}
                                  style={{
                                    backgroundColor: disabled
                                      ? '#FFFFFF'
                                      : 'F5F5F5',
                                  }}
                                  size="large"
                                  disabled={!disabled}
                                ></TextArea>
                              </Form.Item>
                              <Form.Item
                                label="Hình ảnh nhật ký"
                                name="img_history"
                              >
                                {image && image.length == 0 && !disabled && (
                                  <span>Nhật ký không có hình ảnh</span>
                                )}
                                <UploadImage
                                  data={image}
                                  disabled={!disabled}
                                  onChange={pushNewData}
                                  onRemove={removeData}
                                />
                              </Form.Item>

                              {res?.new && (
                                <div className="btn_action">
                                  <Button className="btn-huytt" onClick={huyTT}>
                                    Huỷ thao tác
                                  </Button>
                                  <Button type="primary" htmlType="submit">
                                    Thêm mới nhật ký
                                  </Button>
                                </div>
                              )}
                              {!res?.new && disabled && (
                                <div className="btn_action">
                                  <Button className="btn-huytt" onClick={huyTT}>
                                    Huỷ thao tác
                                  </Button>
                                  <Button type="primary" htmlType="submit">
                                    Cập nhật nhật ký
                                  </Button>
                                </div>
                              )}
                            </Form>
                          </div>
                        )}
                    </div>
                  }
                ></Step>
              );
            })}
          </Steps>
          <DialogDeleteConfim
            visible={handleVisibleRemove}
            onCancel={closeRemove}
            onOK={handleRemove}
          />
        </Modal>
      </div>
    </Loading>
  );
}

function mapStateToProps(store) {
  const { isLoading } = store.app;
  return { isLoading };
}

export default connect(mapStateToProps)(DialogGhiNhatKySX);
