import { Button, DatePicker, Form, Input, InputNumber, Modal } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import './DialogThemMoi.scss';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import UploadImage from '@components/UploadImage/UploadImage';
import { formatDatetrike, toast, validateSpaceNull } from '@app/common/functionCommons';
import { CONSTANTS, TOAST_MESSAGE } from '@constants';
import NhatKyKiemDinh from '@containers/KiemDinhLoHang/NhatKyKiemDinh';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import { getStepAudit } from '@app/services/NhatKyKiemDinh';
import { updateStepAndDeleteImage } from '@app/services/ThemMoiQuyTrinh';

DialogChinhSua.propTypes = {};

function DialogChinhSua({ visible, onCancel, data, dialogData, viewDialog, getData }) {
  const [form] = Form.useForm();
  const [image, changeImage] = useState([]);
  const [arrowDown, setArrowDown] = useState(false);
  const [dataKD, setDataKD] = useState(null);
  const [removeImg, setRemoveImage] = useState([]);


  const callAPIKD = async () => {
    if (!dialogData?._id) return;
    const response = await getStepAudit(dialogData._id);
    setDataKD(response);
  };

  const pushNewData = (data) => {
    changeImage(data);
  };
  const changeDownArrow = () => {
    setArrowDown(!arrowDown);
  };
  const removeData = (data) => {

    setRemoveImage([...removeImg, data]);
  };
  const onClose = () => {
    form.resetFields();
    setArrowDown(false);
    onCancel();
    changeImage([]);
  };
  const handleSubmit = async (e) => {
    const index = data.indexOf(dialogData);
    const dataSubmit = {
      ...e,
      from_date: formatDatetrike(e.from_date),
      to_date: formatDatetrike(e.to_date),
      image,
    };

    let foundItem = false;
    if (data != null) {
      foundItem = data.find((item) => item.stepIndex === dataSubmit.stepIndex && item._id !== dataSubmit._id);
    }
    if (foundItem) toast(CONSTANTS.ERROR, TOAST_MESSAGE.PARCEL.DUPLICATE_STEP);
    else {

      const result = await updateStepAndDeleteImage(dataSubmit, removeImg);
      if (result) {
        toast(CONSTANTS.SUCCESS, TOAST_MESSAGE.STEP.EDIT_SUCCESS);
        await getData();
      } else {
        toast(CONSTANTS.ERROR, TOAST_MESSAGE.STEP.EDIT_ERROR);

      }
      onClose();
    }
  };
  useEffect(() => {
    if (dialogData?.image) changeImage(dialogData.image);
    if (dialogData) {
      form.setFieldsValue({
        _id: dialogData._id,
        name: dialogData.name,
        stepIndex: dialogData.stepIndex,
        describe: dialogData.describe,
        from_date: dialogData.from_date ? moment(dialogData.from_date, 'YYYY-MM-DD') : null,
        to_date: dialogData.to_date ? moment(dialogData.to_date, 'YYYY-MM-DD') : null,
      });
    }
    callAPIKD();
  }, [dialogData]);

  return (
    <div className="dialog-create-procedure">
      <Modal
        visible={visible}
        onCancel={onClose}
        footer={null}
        title="Quy trình sản xuất"
        width={800}
        className="dialogShowModalCreateProcedure"
      >
        <Form
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          initialValues={{ remember: true }}
          form={form}
          onFinish={handleSubmit}
          disabled={!viewDialog}
          autoComplete="off"
        >
          <Form.Item
            name="_id"
            hidden
          >
            <Input/>
          </Form.Item>
          <Form.Item
            label="Tên quy trình con"
            name="name"
            rules={[{ required: true, message: 'Vui lòng nhập tên quy trình con' }, { validator: validateSpaceNull }]}
          >
            <Input placeholder="Vui lòng nhập tên quy trình con" readOnly={!viewDialog}/>
          </Form.Item>

          <Form.Item
            label="Thứ tự của quy trình con"
            name="stepIndex"
            rules={[{ required: true, message: 'Vui lòng nhập thứ tự của quy trình con' }]}
          >
            <InputNumber min={1} placeholder="Vui lòng nhập thứ tự" style={{ width: '40%' }} readOnly={!viewDialog}/>
          </Form.Item>
          <Form.Item
            label="Mô tả nội dung thực hiện"
            name="describe"
            rules={[{
              required: true,
              message: 'Vui lòng nhập mô tả nội dung thực hiện',
            }, { validator: validateSpaceNull }]}
          >
            <TextArea rows={4} placeholder="Vui lòng nhập mô tả" readOnly={!viewDialog}/>
          </Form.Item>
          <Form.Item
            label="Ngày bắt đầu"
            name="from_date"
            rules={[{ required: true, message: 'Vui lòng nhập ngày bắt đầu' }]}
          >
            <DatePicker
              picker="day"
              style={{ width: '100%' }}
              placeholder="Chọn ngày bắt đầu"
              format="DD/MM/YYYY"
              disabled={!viewDialog}
            />
          </Form.Item>
          <Form.Item
            label="Ngày kết thúc"
            name="to_date"
            rules={[
              { required: true, message: 'Vui lòng nhập ngày kết thúc!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  const fromDate = getFieldValue('from_date');
                  if (!value || !fromDate || fromDate <= value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Ngày kết thúc không được trước ngày bắt đầu!'));
                },
              }),
            ]}
          >
            <DatePicker
              picker="day"
              style={{ width: '100%' }}
              placeholder="Chọn ngày kết thúc"
              format="DD/MM/YYYY"
              disabled={!viewDialog}
            />
          </Form.Item>
          <Form.Item label="Hình ảnh, video sản phẩm" name="handleImage">
            <UploadImage
              onChange={pushNewData}
              data={image}
              onRemove={removeData}

              disabled={!viewDialog}
              format="DD/MM/YYYY"
            />
          </Form.Item>

          {dialogData && dataKD && dataKD.length > 0 && (
            <>
              <div className="div_hr"></div>
              <div className="DialogKiemDinh-LoHang-container">
                <div className="nhat-ky-kiem-dinh--title__top">
                  <span>Nhật ký kiểm định</span>
                  <div className="nhat-ky-kiem-dinh--title__icon">
                    {arrowDown ? <UpOutlined onClick={changeDownArrow}/> : <DownOutlined onClick={changeDownArrow}/>}
                  </div>
                </div>
                <div className="div_hr"></div>
                {arrowDown && (
                  <div className="NhatKyKiemDinh">
                    <NhatKyKiemDinh id={dialogData._id}/>
                  </div>
                )}
              </div>
            </>
          )}
          {viewDialog && (
            <div className="btn_confim_dialogThemMoi">
              <Button className="btn_cancel" onClick={onClose}>
                Huỷ thao tác
              </Button>
              <Button type="primary" htmlType="submit">
                Lưu quy trình
              </Button>
            </div>
          )}
        </Form>
      </Modal>
    </div>
  );
}

export default DialogChinhSua;



