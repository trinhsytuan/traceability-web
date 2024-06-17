import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import BaseContent from "@components/BaseContent";
import { CloseOutlined, EditOutlined, LeftOutlined } from "@ant-design/icons";
import "./ThemMoiSanPham.scss";
import { useHistory, useParams } from "react-router-dom";
import { URL } from "@url";
import { Button, Col, DatePicker, Form, Input, Row, Select } from "antd";
import { getAllUserByOrg, getListOrgUnitByOrgID, getListProcedure } from "@app/services/Manager";
import TextArea from "antd/lib/input/TextArea";
import UploadImage from "@components/UploadImage/UploadImage";

import {
  createProduct,
  deleteProduct,
  getInfoProduct,
  getMediaBase,
  updateProduct,
} from "@app/services/ThemMoiSanPham";
import { formatFormDataExtra, toast, validateSpaceNull } from "@app/common/functionCommons";
import { CONSTANTS, TOAST_MESSAGE } from "@constants";
import { connect } from "react-redux";
import { API } from "@api";
import DialogDeleteConfim from "@components/DialogDeleteConfim/DialogDeleteConfim";
import DanhSachLoHang from "@containers/LoHang/DanhSachLoHang";
import DeleteIcon from "@components/Icons/DeleteIcon";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import Loading from "@components/Loading";
import moment from "moment";

function ThemMoiSanPham({ isLoading, myInfo, myPermission }) {
  const { id } = useParams();
  const formRef = useRef(null);
  const [procedure, setProcedure] = useState(null);
  const [image, changeImage] = useState([]);
  const [removeVisible, setRemoveVisible] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [remove, setRemove] = useState([]);
  const [phutrach, setNguoiPhuTrach] = useState(null);
  const [listOrg, setOrgUnit] = useState(null);
  const [form] = Form.useForm();
  const tentrang = "quan-ly-san-pham";
  const URLPattern = new RegExp(
    "^(https?:\\/\\/)?" + // protocol
      "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
      "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
      "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
      "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
      "(\\#[-a-z\\d_]*)?$",
    "i"
  ); // fragment locator
  const pathURL = (urls) => {
    var newUrls = urls.map(function (urlLink) {
      return {
        ...urlLink,
        url: API.DOWNLOAD_FILE + "/" + urlLink.url,
        origin: urlLink.url,
      };
    });
    return newUrls;
  };
  const handleRemove = async () => {
    if (id) {
      const response = await deleteProduct(id);
      toast(CONSTANTS.SUCCESS, TOAST_MESSAGE.PRODUCT.DELETE_PRODUCT);
      history.push(URL.MENU.DANH_SACH_SAN_PHAM);
    }
  };
  const onCancelRemove = () => {
    setRemoveVisible(!removeVisible);
  };
  useEffect(() => {
    callAPI();
  }, [id]);
  const callAPI = async () => {
    const responseProcedure = await getListProcedure("limit=0&active=true");
    setProcedure(responseProcedure);
    const orgUnit = await getListOrgUnitByOrgID(myInfo?.org?._id);
    setOrgUnit(orgUnit.docs);
    getAllUserByOrg().then((data) => setNguoiPhuTrach(data));
    if (id) {
      disableForm();
      getInfoProduct(id).then((res) => {
        form.setFieldsValue({
          name: res?.name,
          code: res?.code,
          procedure: res?.procedure,
          org_unit: res?.orgUnit,
          url: res?.url,
          address: res?.address,
          describe: res?.describe,
          user_id: res?.userId,
          require_inspect: res?.requireInspect,
          national_standard: res?.nationalStandard,
          manufacture_date: res?.manufactureDate ? moment(res?.manufactureDate, "YYYY-MM-DD") : null,
        });
      });
      getMediaBase(id).then((res) => changeImage(pathURL(res)));
    }
  };
  const history = useHistory();
  const handleBackButton = () => {
    history.push(URL.MENU.DANH_SACH_SAN_PHAM);
  };
  const disableForm = () => {
    setDisabled(!disabled);
  };

  const pushNewData = (data) => {
    changeImage(data);
  };
  const removeData = (data) => {
    setRemove([...remove, data]);
  };
  const onFinish = async (values) => {
    if (id) {
      const dataUpload = {
        ...values,
        image: image,
        remove: remove,
      };
      const response = await updateProduct(dataUpload, id);
      if (response) {
        callAPI();
        toast(CONSTANTS.SUCCESS, TOAST_MESSAGE.PRODUCT.EDIT_PRODUCT);
        disableForm();
      }
    } else {
      const dataUpload = {
        ...values,
        image: image,
        remove: remove,
      };
      const response = await createProduct(dataUpload);
      if (response) {
        toast(CONSTANTS.SUCCESS, TOAST_MESSAGE.PRODUCT.ADD_PRODUCT);
        disableForm();
        history.push(`${URL.CHI_TIET_SAN_PHAM_ID.format(response._id)}`);
      }
    }
  };
  const selectChange = (data) => {
    if (data == "createnew") history.push(URL.THEM_MOI_QUY_TRINH);
  };
  const cancelEdit = () => {
    callAPI();
    disableForm(true);
  };
  return (
    <>
      <Loading active={isLoading}>
        <BaseContent>
          <div className="add-product-container">
            <div className="add-product-header">
              <div className="add-product-header-left">
                <LeftOutlined onClick={handleBackButton} />
                <span>Thông tin sản phẩm</span>
              </div>
              {id && (
                <div className="add-product-header-right">
                  {disabled && (myPermission?.[tentrang]?.sua || myPermission?.is_admin) && (
                    <Button
                      icon={<EditOutlined />}
                      type="ghost"
                      onClick={disableForm}
                      style={{
                        color: "#FF811E",
                        backgroundColor: "#FFE9D8",
                        border: 0,
                      }}
                    >
                      Chỉnh sửa
                    </Button>
                  )}
                  {!disabled && (myPermission?.[tentrang]?.sua || myPermission?.is_admin) && (
                    <Button
                      icon={<CloseOutlined />}
                      type="ghost"
                      onClick={cancelEdit}
                      style={{
                        color: "#FF811E",
                        backgroundColor: "#FFE9D8",
                        border: 0,
                      }}
                    >
                      Huỷ chỉnh sửa
                    </Button>
                  )}
                  {(myPermission?.[tentrang]?.xoa || myPermission?.is_admin) && (
                    <Button
                      className="btn_delete"
                      icon={<DeleteIcon />}
                      type="ghost"
                      onClick={onCancelRemove}
                      style={{
                        color: "red",
                        backgroundColor: "#FFEFEF",
                        border: 0,
                      }}
                    >
                      Xoá
                    </Button>
                  )}
                  <DialogDeleteConfim visible={removeVisible} onCancel={onCancelRemove} onOK={handleRemove} />
                </div>
              )}
            </div>
            <div className="div-hr"></div>
            <div className="add-product-infoProduct">
              <Form layout="vertical" disabled={disabled} form={form} onFinish={onFinish} ref={formRef}>
                <Row gutter={18}>
                  <Col className="gutter-row" xs={24} sm={24} md={12} lg={6}>
                    <Form.Item
                      label="Tên sản phẩm"
                      name="name"
                      rules={[
                        {
                          required: true,
                          message: "Tên sản phẩm không thể để trống",
                        },
                        { validator: validateSpaceNull },
                      ]}
                    >
                      <Input placeholder="Nhập tên sản phẩm" />
                    </Form.Item>
                  </Col>
                  <Col className="gutter-row" xs={24} sm={24} md={12} lg={6}>
                    <Form.Item
                      label="Địa chỉ Website"
                      name="url"
                      rules={[
                        {
                          pattern: URLPattern,
                          message: "Vui lòng nhập một Website hợp lệ!",
                        },
                      ]}
                    >
                      <Input placeholder="Nhập địa chỉ url" />
                    </Form.Item>
                  </Col>
                  {/* <Col className="gutter-row" xs={24} sm={24} md={12} lg={6}>
                    <Form.Item
                      label="Mã sản phẩm"
                      name="code"
                      rules={[
                        { required: true, message: "Mã sản phẩm không thể để trống" },
                        { validator: validateSpaceNull },
                      ]}
                    >
                      <Input placeholder="Nhập mã sản phẩm" />
                    </Form.Item>
                  </Col> */}
                  <Col className="gutter-row" xs={24} sm={24} md={12} lg={6}>
                    <Form.Item label="Quy trình sản xuất" name="procedure">
                      <Select
                        showSearch
                        placeholder="Chọn quy trình sản xuất"
                        onChange={selectChange}
                        filterOption={(inputValue, option) =>
                          option.label.toLowerCase().indexOf(inputValue.toLowerCase()) !== -1
                        }
                      >
                        {procedure &&
                          procedure.docs.map((option) => (
                            <Select.Option key={option._id} value={option._id} label={option.name}>
                              {option.name}
                            </Select.Option>
                          ))}
                        <Select.Option key="createnew_procedure" value="createnew" label="Tạo mới quy trình">
                          <Link to={URL.THEM_MOI_QUY_TRINH}>
                            <span style={{ fontFamily: "NotoSans-Bold" }}>Tạo mới quy trình</span>
                          </Link>
                        </Select.Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col className="gutter-row" xs={24} sm={24} md={12} lg={6}>
                    <Form.Item
                      label="Cơ sở sản xuất"
                      name="org_unit"
                      rules={[
                        {
                          required: true,
                          message: "Cơ sở sản xuất không thể để trống",
                        },
                      ]}
                    >
                      <Select
                        showSearch
                        notFoundContent="Chưa có cơ sở sản xuất"
                        placeholder="Chọn cơ sở sản xuất"
                        filterOption={(inputValue, option) =>
                          option.label.toLowerCase().indexOf(inputValue.toLowerCase()) !== -1
                        }
                      >
                        {listOrg &&
                          listOrg?.map((option) => (
                            <Select.Option key={option._id} value={option._id} label={option.name}>
                              {option.name}
                            </Select.Option>
                          ))}
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={18}>
                  <Col className="gutter-row" xs={24} sm={24} md={24} lg={24}>
                    <Form.Item label="Các tiêu chuẩn quốc gia, quốc tế" name="national_standard">
                      <Input placeholder="Nhập các tiêu chuẩn quốc gia của sản phẩm nếu có" />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={18}>
                  {/* <Col className="gutter-row" xs={24} sm={24} md={12} lg={6}>
                    <Form.Item
                      label="Địa chỉ url"
                      name="url"
                      rules={[
                        {
                          pattern: URLPattern,
                          message: "Vui lòng nhập một URL hợp lệ!",
                        },
                      ]}
                    >
                      <Input placeholder="Nhập địa chỉ url" />
                    </Form.Item>
                  </Col> */}
                  <Col className="gutter-row" xs={24} sm={24} md={24} lg={24}>
                    <Form.Item
                      label="Địa chỉ"
                      name="address"
                      rules={[
                        {
                          required: true,
                          message: "Địa chỉ không thể bỏ trống",
                        },
                        { validator: validateSpaceNull },
                      ]}
                    >
                      <Input placeholder="Nhập địa chỉ" />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={18}>
                  <Col className="gutter-row" span={24}>
                    <Form.Item
                      label="Mô tả sản phẩm"
                      name="describe"
                      rules={[
                        {
                          required: true,
                          message: "Mô tả sản phẩm không thể bỏ trống",
                        },
                        { validator: validateSpaceNull },
                      ]}
                    >
                      <TextArea rows={3} placeholder="Mô tả sản phẩm" />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={18}>
                  <Col className="gutter-row" span={24}>
                    <Form.Item label="Hình ảnh, video sản phẩm" name="image">
                      <div className="imageProduct">
                        <UploadImage onChange={pushNewData} data={image} disabled={disabled} onRemove={removeData} />
                      </div>
                    </Form.Item>
                  </Col>
                </Row>

                <Col className="gutter-row nguoipt" xs={24} sm={24} md={12} lg={6}>
                  <Form.Item
                    label="Người phụ trách"
                    name="user_id"
                    rules={[
                      {
                        required: true,
                        message: "Người phụ trách không thể để trống",
                      },
                    ]}
                  >
                    <Select
                      showSearch
                      placeholder="Chọn người phụ trách"
                      className="nguoipt_content"
                      filterOption={(inputValue, option) =>
                        option.value.toLowerCase().indexOf(inputValue.toLowerCase()) !== -1
                      }
                    >
                      {phutrach &&
                        phutrach.map((option) => (
                          <Select.Option key={option._id} value={option._id}>
                            {option?.name || option?.email}
                          </Select.Option>
                        ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col className="gutter-row nguoipt" xs={24} sm={24} md={12} lg={6}>
                  <Form.Item label="Yêu cầu kiểm định" name="require_inspect" initialValue={true}>
                    <Select className="nguoipt_content">
                      <Select.Option value={true}>Yêu cầu</Select.Option>
                      <Select.Option value={false}>Không yêu cầu</Select.Option>
                    </Select>
                    {/* <Switch checkedChildren="Yêu cầu" unCheckedChildren="Không yêu cầu" defaultChecked /> */}
                  </Form.Item>
                </Col>
              </Form>
            </div>
          </div>
        </BaseContent>
        {!disabled && (
          <div className="btn_create_product">
            <Button
              type="primary"
              htmlType="submit"
              onClick={() => formRef.current.submit()}
              disabled={isLoading}
              loading={isLoading}
            >
              {id ? "Cập nhật sản phẩm" : "Tạo mới sản phẩm"}
            </Button>
          </div>
        )}
        <div className="them-moi-lo-hang">{id && <DanhSachLoHang id={id} />}</div>
      </Loading>
    </>
  );
}

ThemMoiSanPham.propTypes = {
  isLoading: PropTypes.bool,
};

function mapStatetoProps(store) {
  const { isLoading } = store.app;
  const { myInfo } = store.user;
  return { isLoading, myInfo, myPermission: myInfo?.userPermissions };
}

export default connect(mapStatetoProps)(ThemMoiSanPham);
