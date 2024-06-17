import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import "./FormNhatKy.scss";
import { Button, DatePicker, Form, Input, Select } from "antd";
import TextArea from "antd/lib/input/TextArea";
import moment from "moment";
import { addNewAudit, deleteAudit, editAuditHistory } from "@app/services/NhatKyKiemDinh";
import { toast } from "@app/common/functionCommons";
import { CONSTANTS, RESULT_SENDING, TOAST_MESSAGE } from "@constants";
import UploadImage from "@components/UploadImage/UploadImage";
import DialogDeleteConfim from "@components/DialogDeleteConfim/DialogDeleteConfim";
import { sendFeedbackAudit } from "@app/services/QLKiemDinh";
FormNhatKy.propTypes = {};

function FormNhatKy({ dataForm, cancel, id, refresh, edit, closeForm, dialogConfim }) {
  const [image, changeImage] = useState([]);
  const [remove, setRemove] = useState([]);

  const [enableReadOnly, setEnableReadOnly] = useState(false);
  const [enableInput, setEnableInput] = useState(true);

  const pushNewData = (data) => {
    changeImage(data);
  };
  const removeData = (data) => {
    setRemove([...remove, data]);
  };
  const [form2] = Form.useForm();
  useEffect(() => {
    changeImage(dataForm.medias ? dataForm.medias : []);
    if (dataForm.new == true) setEnableInput(false);
    else setEnableInput(true);
    form2.setFieldsValue({
      title: dataForm?.title == "Thêm mới nhật ký" ? null : dataForm?.title,
      time_start: dataForm?.timeStart ? moment(dataForm.timeStart, "YYYY-MM-DD") : null,
      time_end: dataForm?.timeEnd ? moment(dataForm.timeEnd, "YYYY-MM-DD") : null,
      description: dataForm?.description,
      result: dataForm?.result,
    });
    if (edit && dataForm?._id && typeof dataForm?._id == "string") setEnableReadOnly(true);
    else setEnableReadOnly(false);
  }, [dataForm]);
  const formSubmit = async (e) => {
    if (edit && dataForm?._id && typeof dataForm?._id == "string") {
      editAudit(e);
      return;
    }
    const newPost = {
      ...e,
      step: id,
      image,
    };
    const response = await addNewAudit(newPost);
    if (response) {
      toast(CONSTANTS.SUCCESS, TOAST_MESSAGE.AUDIT.CREATE_NEW);
      refresh();
    }
    setEnableReadOnly(false);
    setEnableInput(true);
  };
  const editAudit = async (e) => {
    const newPost = {
      ...e,
      step: id,
      image,
    };
    const response = await editAuditHistory(newPost, dataForm?._id, remove);
    if (response) {
      toast(CONSTANTS.SUCCESS, TOAST_MESSAGE.AUDIT.EDIT);
      refresh();
    }
    setEnableReadOnly(true);
    setEnableInput(true);
  };
  const enableEdit = () => {
    setEnableReadOnly(false);
    setEnableInput(false);
  };
  const onSendFeedbackAudit = (id) => {
    dialogConfim(id);
  };
  return (
    <div className="form_nhat_ky" style={{ backgroundColor: "#F5F5F5" }}>
      <Form form={form2} labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} onFinish={formSubmit}>
        <Form.Item label="Chủ đề" name="title" rules={[{ required: true, message: "Chủ đề không thể để trống" }]}>
          <Input placeholder="Nhập chủ đề" size="large" disabled={enableInput} />
        </Form.Item>

        <Form.Item label="Ngày bắt đầu" name="time_start">
          <DatePicker
            style={{ width: "100%" }}
            placeholder="Ngày bắt đầu"
            format="DD/MM/YYYY"
            size="large"
            disabled={enableInput}
          />
        </Form.Item>
        <Form.Item
          label="Ngày kết thúc"
          name="time_end"
          rules={[
            ({ getFieldValue }) => ({
              validator(_, value) {
                const fromDate = getFieldValue("time_start");
                if (!value || !fromDate || fromDate <= value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error("Ngày kết thúc không được trước ngày bắt đầu!"));
              },
            }),
          ]}
        >
          <DatePicker
            style={{ width: "100%" }}
            placeholder="Ngày kết thúc"
            format="DD/MM/YYYY"
            size="large"
            disabled={enableInput}
          />
        </Form.Item>
        <Form.Item label="Mô tả" name="description">
          <TextArea
            rows={5}
            className={`textArea${enableInput ? "-disabled" : ""}`}
            size="large"
            disabled={enableInput}
          ></TextArea>
        </Form.Item>
        <Form.Item label="Kết quả kiểm định" name="result">
          <Select placeholder="Vui lòng chọn kết quả kiểm định" allowClear size="large" disabled={enableInput}>
            <Select.Option value={RESULT_SENDING.ENDORSED}>Hoàn tất kiểm định</Select.Option>
            <Select.Option value={RESULT_SENDING.REJECT}>Chưa đạt yêu cầu kiểm định</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label="Hình ảnh nhật ký" name="img_history">
          <UploadImage data={image} disabled={enableInput} onChange={pushNewData} onRemove={removeData} />
        </Form.Item>

        {edit && dataForm?.new && (
          <div className="btn_action">
            <Button className="btn-footer btn-huytt" onClick={() => cancel(dataForm)}>
              Huỷ thao tác
            </Button>
            <Button type="primary" htmlType="submit">
              Lưu nhật ký
            </Button>
          </div>
        )}
        {!enableReadOnly && edit && dataForm?._id && typeof dataForm?._id == "string" && (
          <div className="btn_action">
            <Button className="btn-footer btn-huytt" onClick={() => cancel(dataForm)}>
              Huỷ thao tác
            </Button>{" "}
            <Button type="primary" htmlType="submit" size="medium">
              Lưu nhật ký
            </Button>
          </div>
        )}
      </Form>
      {enableReadOnly && edit && dataForm?._id && typeof dataForm?._id == "string" && (
        <div className="btn_action">
          <Button className="btn-footer btn-huytt" onClick={closeForm}>
            Huỷ thao tác
          </Button>
          <Button type="primary" htmlType="submit" size="medium" onClick={enableEdit}>
            Chỉnh sửa nhật ký
          </Button>
          <Button
            type="primary"
            style={{ marginLeft: "10px", backgroundColor: "#1890ff", border: 0 }}
            size="medium"
            onClick={() => onSendFeedbackAudit(dataForm?._id)}
          >
            Gửi phản hồi
          </Button>
        </div>
      )}
    </div>
  );
}

export default FormNhatKy;

