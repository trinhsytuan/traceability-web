import { DownOutlined, PlusOutlined, UpOutlined } from '@ant-design/icons';
import { formatDate } from '@app/common/functionCommons';
import UploadImage from '@components/UploadImage/UploadImage';
import { Button, Col, Form, Input, InputNumber, Modal, Row } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState } from 'react';
import './ModalKiemDinh.scss';
import NhatKyKiemDinh from './NhatKyKiemDinh';
import { getMediaAuditBaseStep } from '@app/services/ThemMoiSanPham';
import { useParams } from 'react-router-dom/cjs/react-router-dom.min';
import { createImageAudit, deleteImageAudit } from '@app/services/NhatKyKiemDinh';
import { connect } from 'react-redux';
import Loading from '@components/Loading';

ModalKiemDinh.propTypes = {
  handleEdit: PropTypes.bool,
};
ModalKiemDinh.defaultProps = {
  handleEdit: true,
};
function ModalKiemDinh({ onVisible, onChangeVisible, handleEdit, data, isLoading }) {
  const componentOneRef = useRef();
  const { id } = useParams();
  const [arrowDown, setArrowDown] = useState(false);
  const [formFields] = Form.useForm();
  const [image, setImage] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [reloadImage, setReloadImage] = useState(null);
  const pushNewData = async (datas) => {
    await createImageAudit(datas, data._id);
    setReloadImage(new Date());
  };
  const removeImage = async (data) => {
    await deleteImageAudit([data]);
    setReloadImage(new Date());
  };
  const changeDownArrow = () => {
    setArrowDown(!arrowDown);
  };
  const resetFormAndClose = () => {
    formFields.resetFields();
    setArrowDown(false);
    onChangeVisible();
  };
  useEffect(() => {
    if (!data) return;
    getMediaAuditBaseStep(data?._id).then((res) => {
      setImage(res);
    });
  }, [data, reloadImage]);
  useEffect(() => {
    formFields.setFieldsValue({
      name: data?.name,
      stepIndex: data?.stepIndex,
      describe: data?.describe,
      startDate: formatDate(data?.from_date),
      endDate: formatDate(data?.to_date),
    });
  }, [onVisible]);
  const addAudit = async () => {
    setArrowDown(true);
    setShowForm(new Date());
  };
  return (
    <div className="modal_kiem_dinh">
      <Modal visible={onVisible} onCancel={resetFormAndClose} footer={null} width={1000} title={`Quy trình sản xuất`}>
        <Loading active={isLoading}>
          <div className="modal-content">
            <Form
              form={formFields}
              name="basic"
              labelCol={{ span: 6 }}
              wrapperCol={{ span: 19 }}
              style={{ maxWidth: 1000 }}
            >
              <Form.Item label="Tên quy trình con" name="name">
                <Input readOnly />
              </Form.Item>

              <Form.Item label="Thứ tự bước thực hiện" name="stepIndex">
                <InputNumber readOnly style={{ width: "50%" }} />
              </Form.Item>
              <Form.Item label="Mô tả nội dung thực hiện" name="describe">
                <TextArea rows={4} readOnly></TextArea>
              </Form.Item>
              <Form.Item label="Ngày bắt đầu" name="startDate" format="DD/MM/YYYY">
                <Input readOnly></Input>
              </Form.Item>
              <Form.Item label="Ngày kết thúc" name="endDate" format="DD/MM/YYYY">
                <Input readOnly></Input>
              </Form.Item>
              <Form.Item label="Hình ảnh, video sản phẩm">
                <UploadImage data={data?.image} disabled={true} />
              </Form.Item>
            </Form>
            <div className="div_hr"></div>
            <div className="nhat-ky-kiem-dinh">
              <div className="nhat-ky-kiem-dinh--title">
                <div className="nhat-ky-kiem-dinh--title__top">
                  <span>Nhật ký kiểm định</span>
                  <div className="nhat-ky-kiem-dinh--title__icon">
                    {arrowDown ? <UpOutlined onClick={changeDownArrow} /> : <DownOutlined onClick={changeDownArrow} />}
                  </div>
                </div>
                {handleEdit && (
                  <Button
                    type="primary"
                    className="button_reverse"
                    icon={<PlusOutlined></PlusOutlined>}
                    onClick={addAudit}
                  >
                    Thêm nhật ký
                  </Button>
                )}
              </div>

              {arrowDown && (
                <div className="arrowDownKD">
                  <div className="div_hr" />
                  <div className="arrow_down">
                    <NhatKyKiemDinh
                      showForm={showForm}
                      id={data._id}
                      refs={componentOneRef}
                      edit={handleEdit}
                      removeShowForm={setShowForm}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="div_hr"></div>
            <div className="img_certifice">
              <Row gutter={16}>
                <Col className="gutter-row" gutter={{ xs: 6, sm: 8, md: 12, lg: 14 }}>
                  <span>
                    Hình ảnh chứng nhận: {!handleEdit && image && image.length == 0 && "Chưa có hình ảnh nào"}
                  </span>
                </Col>
                <Col className="gutter-row" span={18}>
                  <UploadImage data={image} disabled={!handleEdit} onChange={pushNewData} onRemove={removeImage} />
                </Col>
              </Row>
            </div>
          </div>
        </Loading>
      </Modal>
    </div>
  );
}
function mapStateToProps(store) {
  const { isLoading } = store.app;
  return { isLoading };
}

export default connect(mapStateToProps)(ModalKiemDinh);





