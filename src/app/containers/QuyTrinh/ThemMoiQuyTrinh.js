import { EditOutlined, LeftOutlined, PlusOutlined } from '@ant-design/icons';
import { toast } from '@app/common/functionCommons';
import {
  CreateNewProductAndProcedure,
  EditProduct,
  getStepTemplateProcedureStepByOrg,
  getTempleteProcedureByID,
} from '@app/services/MauQuyTrinh';
import ProcedureIcon from '@assets/icons/procedure-step-icon.svg';
import BaseContent from '@components/BaseContent';
import DeleteIcon from '@components/Icons/DeleteIcon';
import Editable from '@components/Icons/Editable';
import VisibleIcon from '@components/Icons/VisibleIcon';
import Loading from '@components/Loading';
import { CONSTANTS, TOAST_MESSAGE } from '@constants';
import { URL } from '@url';
import { Button, Col, Form, Input, Row, Select, Tooltip } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom/cjs/react-router-dom.min';
import AddProgressProcedure from './AddProgressProcedure';
import DeleteConfim from './DeleteConfim';
import './ThemMoiQuyTrinh.scss';

ThemMoiQuyTrinh.propTypes = {
  isLoading: PropTypes.bool,
};

function ThemMoiQuyTrinh({ isLoading, myPermission }) {
  const { id } = useParams();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [form2] = Form.useForm();
  const [enableForm, setenableForm] = useState(false);
  const [data, setData] = useState();
  const [view, handleView] = useState(null);
  const [openModal, handleOpenModal] = useState(false);
  const [modalOpenDelete, setOpenDelete] = useState(false);
  const [edit, handleEdit] = useState(null);
  const [createProcedure, setCreateProcedure] = useState([]);
  const [editProcedure, setEditProcedure] = useState([]);
  const history = useHistory();
  const tentrang = "quan-ly-quy-trinh";
  const handleOpenAdd = () => {
    handleOpenModal(!openModal);
    if (openModal) {
      handleEdit(null);
      handleView(null);
      form2.resetFields();
    }
  };
  const deleteProcedure = () => {
    if (form.getFieldValue("active") == "true") {
      toast(CONSTANTS.ERROR, TOAST_MESSAGE.ERROR.NOT_DELETE_ACTIVE);
    } else {
      setOpenDelete(true);
    }
  };
  const handleFormSubmit = async (e, valueOld) => {
    setLoading(true);
    let foundItem = false;
    if (data != null) {
      foundItem = data.find((item) => item.stepIndex === e.stepIndex);
    }
    if (foundItem && !valueOld) {
      toast(CONSTANTS.ERROR, "Thứ tự quy trình đã tồn tại", true);
      setLoading(false);
      return;
    }
    if (foundItem && valueOld) {
      if (e.stepIndex != valueOld.stepIndex) {
        toast(CONSTANTS.ERROR, "Thứ tự quy trình đã tồn tại", true);
        setLoading(false);
        return;
      }
    }
    if (!id) {
      if (!valueOld) {
        let newData = [];
        newData = data ? [...data, e] : [e];
        newData.sort((a, b) => a.stepIndex - b.stepIndex);
        setData(newData);
      } else {
        let newData = data;
        for (let i = 0; i < newData.length; i++) {
          if (newData[i].stepIndex === valueOld.stepIndex) {
            newData[i] = e;
            break;
          }
        }
        newData.sort((a, b) => a.stepIndex - b.stepIndex);
        setData(newData);
      }
    } else if ((data, edit)) {
      const newEdit = editProcedure;
      for (let i = 0; i < data.length; i++) {
        if (data[i]._id === edit._id) {
          data[i] = {
            ...data[i],
            name: e.name,
            stepIndex: e.stepIndex,
            describe: e.describe,
            _id: data[i]._id,
          };
          newEdit.push(data[i]);
          break;
        }
      }
      data.sort((a, b) => a.stepIndex - b.stepIndex);
      setEditProcedure(newEdit);
      setData(data);
    } else {
      if (foundItem) {
        toast(CONSTANTS.ERROR, "Thứ tự quy trình đã tồn tại", true);
        return;
      }
      let newData = [];
      let newCreate = createProcedure;
      newData = data ? [...data, e] : [e];
      newData.sort((a, b) => a.stepIndex - b.stepIndex);
      newCreate.push({ ...e, procedure: id });
      setCreateProcedure(newCreate);
      setData(newData);
    }
    handleOpenAdd();
    form2.resetFields();
    setLoading(false);
  };
  const submitForm = async (e) => {
    setLoading(true);
    if (id) {
      const response = await EditProduct(e, id, editProcedure, createProcedure);
      if (response) {
        toast(CONSTANTS.SUCCESS, "Đã sửa quy trình thành công");
        setenableForm(true);
      }
    } else {
      const response = await CreateNewProductAndProcedure(e, data);
      if (response) {
        toast(CONSTANTS.SUCCESS, "Đã tạo quy trình mới thành công");
        history.push(URL.CHI_TIET_QUY_TRINH_ID.format(response._id));
        setenableForm(false);
      } else {
        toast(CONSTANTS.ERROR, TOAST_MESSAGE.ERROR);
        history.goBack();
      }
    }
    setLoading(false);
  };
  const handleGoBack = () => {
    history.goBack();
  };
  const setEnableForm = () => {
    setenableForm(false);
  };
  const handleEditContent = (e) => {
    handleEdit(e);
    handleOpenAdd();
  };
  const handleViewContent = (e) => {
    handleView(e);
    handleOpenAdd();
  };
  useEffect(() => {
    setLoading(true);
    if (id) {
      setenableForm(true);
      getTempleteProcedureByID(id)
        .then((value) => {
          form.setFieldsValue({
            name: value.name,
            active: String(value.active),
            describe: value.describe,
          });
        })
        .catch((e) => {
          toast(CONSTANTS.ERROR, TOAST_MESSAGE.ERROR);
          handleGoBack();
        });
      getStepTemplateProcedureStepByOrg(id)
        .then((value) => {
          value.docs.sort((a, b) => a.stepIndex - b.stepIndex);
          setData(value.docs);
        })
        .catch((e) => {
          toast(CONSTANTS.ERROR, TOAST_MESSAGE.ERROR);
          handleGoBack();
        });
    }
    setLoading(false);
  }, []);
  return (
    <BaseContent>
      <Loading active={loading}>
        <div className="ThemMoiQuyTrinh">
          <div className="header">
            <div className="header_root">
              <div className="header_root__left">
                <LeftOutlined onClick={handleGoBack} />
                <span className="header_root__text">Thông tin mẫu quy trình</span>
              </div>
              {id && (
                <div className="header_root__icon">
                  {enableForm && (myPermission?.[tentrang]?.sua || myPermission?.is_admin) && (
                    <Button
                      icon={<EditOutlined />}
                      type="ghost"
                      onClick={setEnableForm}
                      style={{
                        color: "#FF811E",
                        backgroundColor: "#FFE9D8",
                        border: 0,
                      }}
                    >
                      Chỉnh sửa
                    </Button>
                  )}
                  {(myPermission?.[tentrang]?.xoa || myPermission?.is_admin) && (
                    <Button
                      className="btn_delete"
                      icon={<DeleteIcon />}
                      type="ghost"
                      onClick={deleteProcedure}
                      style={{
                        color: "red",
                        backgroundColor: "#FFEFEF",
                        border: 0,
                      }}
                    >
                      Xoá
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
          <div className="hr_divider" />
          <Form layout="vertical" disabled={enableForm} form={form} onFinish={submitForm}>
            <div className="content">
              <div className="form_item">
                <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                  <Col className="gutter-row" xs={24} sm={24} md={12} lg={12}>
                    <Form.Item
                      label="Tên quy trình sản xuất"
                      name="name"
                      rules={[
                        {
                          required: true,
                          message: "Tên quy trình không thể để trống",
                        },
                      ]}
                    >
                      <Input placeholder="Nhập tên quy trình sản xuất" />
                    </Form.Item>
                  </Col>
                  <Col className="gutter-row" xs={24} sm={24} md={12} lg={9}>
                    <Form.Item
                      label="Trạng thái"
                      name="active"
                      rules={[
                        {
                          required: true,
                          message: "Trạng thái mẫu quy trình không thể để trống",
                        },
                      ]}
                      initialValue={"true"}
                    >
                      <Select placeholder="Trạng thái mẫu quy trình" allowClear>
                        <Select.Option value="true">Đang hoạt động</Select.Option>
                        <Select.Option value="false">Dừng hoạt động</Select.Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col className="gutter-row" span={24}>
                    <Form.Item
                      label="Mô tả nội dung thực hiện"
                      name="describe"
                      rules={[
                        {
                          required: true,
                          message: "Mô tả nội dung thực hiện không thể để trống",
                        },
                      ]}
                    >
                      <TextArea placeholder="Mô tả nội dung thực hiện" rows={4} />
                    </Form.Item>
                  </Col>
                </Row>
              </div>
            </div>
            <div className="progress_sx">
              <div className="progress_sx_header">
                <span>Quy trình sản xuất</span>
                {enableForm == false && (
                  <Button
                    className="btn_addProcedure"
                    type="primary"
                    onClick={handleOpenAdd}
                    icon={
                      <PlusOutlined
                        style={{
                          marginLeft: 7,
                          fontFamily: "NotoSans-Bold",
                          fontSize: 14,
                        }}
                      />
                    }
                  >
                    Thêm quy trình con
                  </Button>
                )}
              </div>
              <div className="hr_divider" />
              <div className="step_procedure">
                {data &&
                  data.map((value, index) => {
                    return (
                      <div key={index}>
                        <div className="step_procedure__step" key={index}>
                          <div className="step_procedure_icon">
                            <img src={ProcedureIcon} />
                          </div>
                          <div className="step_procedure__body">
                            <div className="step_procedure__title">
                              <span>
                                Bước {value.stepIndex}: {value.name}
                              </span>
                              {!enableForm && (
                                <div className="step_procedure__btn">
                                  <div className="conmat">
                                    <Tooltip placement="top" title="Xem chi tiết" color="#179a6b">
                                      <Button
                                        icon={<VisibleIcon />}
                                        style={{ border: 0 }}
                                        onClick={() => {
                                          handleViewContent(value);
                                        }}
                                      />
                                    </Tooltip>
                                    <Tooltip placement="top" title="Sửa quy trình" color="#FF811E">
                                      <Button
                                        icon={<Editable />}
                                        style={{ border: 0 }}
                                        onClick={() => {
                                          handleEditContent(value);
                                        }}
                                      />
                                    </Tooltip>
                                  </div>
                                </div>
                              )}
                            </div>
                            <div className="step_procedure__describe">Mô tả: {value.describe}</div>
                          </div>
                        </div>
                        {index + 1 != data.length && <div className="div_hr" />}
                      </div>
                    );
                  })}
              </div>
            </div>
            <div className="btn_create">
              {!id && (
                <Button type="primary" htmlType="submit">
                  Tạo mới mẫu quy trình
                </Button>
              )}
              {enableForm == false && id && (
                <Button type="primary" htmlType="submit">
                  Lưu quy trình
                </Button>
              )}
            </div>
            <AddProgressProcedure
              open={openModal}
              data={edit ? edit : view}
              view={view ? false : true}
              submitForm={handleFormSubmit}
              form={form2}
              formClose={handleOpenAdd}
              clearEdit={edit ? handleEdit : handleView}
            />
          </Form>
          <DeleteConfim id={id} isOpen={modalOpenDelete} handleClose={setOpenDelete} />
        </div>
      </Loading>
    </BaseContent>
  );
}

function mapStatetoProps(store) {
  const { isLoading } = store.app;
  const { myInfo } = store.user;
  return { isLoading, myPermission: myInfo?.userPermissions };
}

export default connect(mapStatetoProps)(ThemMoiQuyTrinh);
