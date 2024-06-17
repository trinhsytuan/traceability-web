import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import "./UploadImage.scss";
import { PaperClipOutlined, UploadOutlined } from "@ant-design/icons";
import { CONSTANTS, TOAST_MESSAGE } from "@constants";
import { toast } from "@app/common/functionCommons";
import { Button, Form, Input, Modal, Radio, Typography } from "antd";
import CustomImage from "@components/CustomImage/CustomImage";
import CustomVideo from "@components/CustomVideo/CustomVideo";
import { API } from "@api";
import { checkIfLink } from "@app/common/dataConverter";
UploadImage.propTypes = {
  onChange: PropTypes.func,
};
UploadImage.defaultProps = {
  disabled: false,
};

function UploadImage({ onChange, data, disabled, onRemove }) {
  const [modal, setModal] = useState(false);
  const [typeUpload, setTypeUpload] = useState(1);
  const [typeSelect, setTypeSelect] = useState(1);
  const fileInputRef = useRef(null);
  const [form] = Form.useForm();
  const handleAdd = (newData) => {
    onChange([...data, newData]);
  };
  useEffect(() => {
    if (data.length >= 5) setModal(false);
  }, [data]);
  const handleButtonClick = () => {
    fileInputRef.current.click();
  };
  const handleSelect = (e) => {
    setTypeSelect(e.target.value);
  };
  const handleCancel = () => {
    setModal(!modal);
  };
  const changeTypeUpload = (e) => {
    setTypeUpload(e.target.value);
  };
  const typeUrl = (image) => {
    if (image instanceof Blob || image instanceof File) {
      return URL.createObjectURL(image);
    } else if (typeof image === "string") {
      return image;
    }
  };
  const imageUpLink = (e) => {
    handleAdd({
      file_name: "Video",
      type: "video",
      url: e.url,
      newUp: true,
    });
    form.resetFields();
    handleCancel();
  };
  const handleVideoChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      if (selectedFile.type.startsWith("video/")) {
        if (selectedFile.size <= 50 * 1024 * 1024) {
          handleAdd({
            file_name: selectedFile.name,
            type: "video",
            url: selectedFile,
            newUp: true,
          });
        } else {
          toast(CONSTANTS.ERROR, TOAST_MESSAGE.VIDEO_LARGE);
        }
      } else {
        toast(CONSTANTS.ERROR, TOAST_MESSAGE.NOT_VIDEO);
      }
    }
    handleCancel();
  };
  const ImageChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      if (selectedFile.type.startsWith("image/")) {
        if (selectedFile.size <= 25 * 1024 * 1024) {
          handleAdd({
            file_name: selectedFile.name,
            type: "image",
            url: selectedFile,
            newUp: true,
          });
        } else {
          toast(CONSTANTS.ERROR, TOAST_MESSAGE.IMAGE_LARGE);
        }
      } else {
        toast(CONSTANTS.ERROR, TOAST_MESSAGE.NOT_IMAGE);
      }
    }
    handleCancel();
  };
  const handleRemove = (e) => {
    const newData = [...data];

    if (newData[e].newUp === true) {
      newData.splice(e, 1);
      onChange(newData);
    } else {
      onRemove(newData[e]);
      newData.splice(e, 1);
      onChange(newData);
    }
  };
  function addPreviewPathToURL(url) {
    if (url && !url.startsWith(API.DOWNLOAD_FILE) && !url.startsWith("blob:") && checkIfLink(url)) {
      url = API.DOWNLOAD_FILE + "/" + url;
    }
    return url;
  }

  return (
    <div className="upload-image-container">
      {data && (
        <div className="upload-image-preview-image">
          {data.map((image, index) => {
            const urlImage = typeUrl(image.url);
            return (
              <div key={index}>
                {image.type == "image" && (
                  <CustomImage
                    name={image.file_name ? image.file_name : image.fileName}
                    src={addPreviewPathToURL(urlImage)}
                    idImage={index}
                    disabled={disabled}
                    remove={handleRemove}
                  ></CustomImage>
                )}
                {image.type == "video" && (
                  <CustomVideo
                    name={image.file_name ? image.file_name : image.fileName}
                    key={index}
                    src={addPreviewPathToURL(urlImage)}
                    idVideo={index}
                    disabled={disabled}
                    remove={handleRemove}
                  ></CustomVideo>
                )}
              </div>
            );
          })}
        </div>
      )}
      {(!data || data.length <= 4) && !disabled && (
        <label className="upload-image-btnUpload" onClick={handleCancel}>
          <UploadOutlined className="icon-upload" />
          <span>Tải tệp lên</span>
        </label>
      )}
      <Modal title="Tải tệp lên" visible={modal} onCancel={handleCancel} footer={null}>
        <div className="modal_upload_image">
          <div className="modal_upload_image--title">Vui lòng chọn loại tập tin</div>
          <div className="modal_upload_image--content">
            <Radio.Group onChange={changeTypeUpload} defaultValue={typeUpload}>
              <Radio value={1}>Hình ảnh</Radio>
              <Radio value={2}>Video</Radio>
            </Radio.Group>
            {typeUpload == 1 && (
              <div className="modal_upload_image--type">
                <Typography>Chọn tập tin từ máy tính:</Typography>
                <Button icon={<PaperClipOutlined />} type="primary" onClick={handleButtonClick}>
                  Chọn tập tin
                </Button>
                <input
                  type="file"
                  accept="image/*"
                  onChange={ImageChange}
                  style={{ display: "none" }}
                  ref={fileInputRef}
                />
              </div>
            )}
            {typeUpload == 2 && (
              <div className="modal_upload_image--type">
                <Form form={form} layout="vertical" onFinish={imageUpLink}>
                  <Typography>Bạn có thể upload video từ máy tính của bạn hoặc nhập từ URL</Typography>
                  <Radio.Group onChange={handleSelect} defaultValue={typeSelect}>
                    <Radio value={1}>Từ máy tính</Radio>
                    <Radio value={2}>URL</Radio>
                  </Radio.Group>
                  <div className="modal_upload_video--type">
                    {typeSelect == 1 && (
                      <>
                        <Typography>Chọn tập tin từ máy tính:</Typography>
                        <Button icon={<PaperClipOutlined />} type="primary" onClick={handleButtonClick}>
                          Chọn tập tin
                        </Button>
                        <input
                          type="file"
                          accept="video/*"
                          onChange={handleVideoChange}
                          style={{ display: "none" }}
                          ref={fileInputRef}
                        />
                      </>
                    )}
                    {typeSelect == 2 && (
                      <div className="upload_url">
                        <Form.Item label="Địa chỉ url" name="url">
                          <Input placeholder="Nhập địa chỉ url" />
                        </Form.Item>
                        <div className="btn_submit_upload">
                          <Button type="primary" htmlType="submit">
                            Lưu
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </Form>
              </div>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default UploadImage;



