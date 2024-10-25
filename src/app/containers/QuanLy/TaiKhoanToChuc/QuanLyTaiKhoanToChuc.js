import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import BaseContent from "@components/BaseContent";
import Loading from "@components/Loading";
import { CONSTANTS, PAGINATION_CONFIG, RULES, STATUS_ACCOUNT, TYPE_ORG } from "@constants";
import { Button, Col, Form, Input, Modal, Popconfirm, Row, Select, Table, Tooltip } from "antd";
import React, { useEffect, useState } from "react";
import "./QuanLyTaiKhoanToChuc.scss";
import { deleteById, getInactiveOrgs, getMyOrgeRoles, issueAccountOrg, updateById } from "@app/services/NhanVien";

import queryString from "query-string";
import SearchBar from "@components/SearchBar";
import { stringify } from "qs";
import { useHistory, useLocation } from "react-router-dom";
import { connect } from "react-redux";
import { formatSTT, getChangeFormSearch, isUsernameValid, toast, validateSpaceNull } from "@app/common/functionCommons";
import { getListOrg } from "@app/services/QuanLyToChuc";

QuanLyTaiKhoanToChuc.propTypes = {};

function QuanLyTaiKhoanToChuc(props) {
  let { myPermission } = props;
  let { myInfo } = props;
  const [form] = Form.useForm();
  const [data, setData] = useState(null);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [totalDocs, setTotalDocs] = useState(0);
  const [isLoading, setLoading] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [org, setListOrg] = useState([]);
  const location = useLocation();
  const history = useHistory();
  const [typeOrgEdit, setTypeOrgEdit] = useState(null);
  const thisUrl = "quan-ly-nhan-vien";

  useEffect(() => {
    const getInitData = async () => {
      const res = await getMyOrgeRoles();
      if (res) {
        const options = res.map((value) => {
          return {
            value: value._id,
            label: value.tenvaitro,
          };
        });
      }
    };
    getInitData();
  }, []);

  useEffect(() => {
    getDataFilter();
  }, [location.search]);
  useEffect(() => {
    handleRefresh({}, true);
  }, [page, limit]);
  const ColumnsThemMoiSanPham = [
    {
      title: "STT",
      render: (v1, v2, value) => formatSTT(limit, page, value),
      align: "center",
      width: 60,
    },
    { title: "Họ và tên", dataIndex: "name", key: "name" },
    { title: "Tài khoản", dataIndex: "username", key: "username" },
    {
      title: "Tên tổ chức",
      dataIndex: "org",
      key: "org",
      render: (value) => value?.name,
    },
    {
      title: "Thông tin",
      key: "info",
      align: "center",
      render: (_, value) => (
        <>
          <div>Điện thoại: {value.phone}</div>
          <div>Email: {value.email}</div>
        </>
      ),
    },
    {
      title: "Loại tổ chức",
      key: "type",
      align: "center",
      render: (_, value) => {
        if (value?.org?.type === TYPE_ORG.SYSTEM) {
          return <span>Hệ thống</span>;
        } else if (value?.org?.type === TYPE_ORG.ENDORSER) {
          return <span>Kiểm định</span>;
        } else if (value?.org?.type === TYPE_ORG.PRODUCER) {
          return <span>Sản xuất</span>;
        }
        return <span>Người dùng</span>;
      },
    },
    {
      title: "Trạng thái",
      key: "trangthai",
      align: "center",
      render: (_, value) => {
        if (value.active) {
          return <span className="status-user-active">Đã kích hoạt</span>;
        }
        return <span className="status-user-inactive">Chưa kích hoạt</span>;
      },
    },
    {
      title: "Tác vụ",
      key: "action",
      align: "center",
      className: "titleTable",
      width: 100,
      render: (_, value) => formatActionCell(value),
    },
  ];
  const handleDelete = async (value) => {
    if (myInfo._id == value) {
      toast(CONSTANTS.ERROR, "Bạn không thể tự xoá chính mình");
      return;
    }
    const res = await deleteById(value);
    if (res) {
      getDataFilter();
      form.setFieldsValue({ id: value });
    }
  };
  const handleEdit = async (value) => {
    toggleModalVaiTro();
    setTypeOrgEdit(value);
    form.setFieldsValue({ ...value, id: value._id, org: value?.org?._id });
  };
  const formatActionCell = (value) => {
    if (value.vaitro?.is_admin) {
      return;
    }
    return (
      <>
        {(myPermission?.[thisUrl]?.sua || myPermission?.is_admin) && (
          <Tooltip placement="left" title="Chỉnh sửa thông tin tài khoản" color="#FF811E">
            <Button
              icon={<EditOutlined />}
              size="small"
              type="primary"
              className="mr-1"
              style={{ backgroundColor: "#FF811E", borderColor: "#FF811E" }}
              onClick={() => handleEdit(value)}
            ></Button>
          </Tooltip>
        )}
        {(myPermission?.[thisUrl]?.xoa || myPermission?.is_admin) && (
          <Popconfirm
            key={value._id}
            title="Bạn chắc chắn muốn xoá?"
            onConfirm={() => handleDelete(value._id)}
            okText="Xoá"
            cancelText="Huỷ"
            okButtonProps={{ type: "danger" }}
          >
            <Tooltip placement="right" title="Xóa dữ liệu" color="#FF0000">
              <Button
                icon={<DeleteOutlined />}
                type="danger"
                style={{ backgroundColor: "#FF0000" }}
                size="small"
                className="mr-1"
              />
            </Tooltip>
          </Popconfirm>
        )}
      </>
    );
  };
  const typeOrgs = [
    {
      name: "Hệ thống",
      value: TYPE_ORG.SYSTEM,
    },
    {
      name: "Kiểm định",
      value: TYPE_ORG.ENDORSER,
    },
    {
      name: "Sản xuất",
      value: TYPE_ORG.PRODUCER,
    },
    {
      name: "Người dùng",
      value: TYPE_ORG.CONSUMER,
    },
  ];
  const dataSearch = [
    {
      name: "username",
      label: "Tài khoản",
      type: "text",
      operation: "like",
    },
    {
      name: "name",
      label: "Tên tổ chức",
      type: "text",
      operation: "like",
    },
    {
      type: "select",
      name: "type",
      label: "Loại tổ chức",
      options: typeOrgs,
      key: "value",
      value: "name",
    },
    {
      type: "select",
      name: "active",
      label: "Trạng thái",
      options: STATUS_ACCOUNT,
      key: "value",
      value: "name",
    },
  ];
  const getDataFilter = async () => {
    const search = queryString.parse(props.location.search);
    const page = parseInt(search.page ? search.page : page);
    const limit = parseInt(search.limit ? search.limit : limit);
    let queryStr = "";
    queryStr += `${search.username ? "&username[like]={0}".format(search.username) : ""}`;
    queryStr += `${search.name ? "&name[like]={0}".format(search.name) : ""}`;
    queryStr += `${search.type ? "&type={0}".format(search.type) : ""}`;
    queryStr += `${search.active ? "&active={0}".format(search.active) : ""}`;
    setLoading(true);
    const apiResponse = await getInactiveOrgs(page, limit, queryStr);
    if (apiResponse) {
      const dataRes = apiResponse.docs;
      setData(dataRes);
      setLimit(apiResponse.limit);
      setPage(apiResponse.page);
      setTotalDocs(apiResponse.totalDocs);
    }
    const getAllToChuc = await getListOrg(1, 0, "");
    setListOrg(getAllToChuc);
    setLoading(false);
  };
  const handleRefresh = (newQuery, changeTable) => {
    const { pathname } = location;
    let objFilterTable = { page, limit };
    if (changeTable) {
      newQuery = queryString.parse(location.search);
      delete newQuery.page;
      delete newQuery.limit;
    }
    if (getChangeFormSearch(newQuery, queryString.parse(location.search))) {
      objFilterTable.page = 1;
    }
    newQuery = Object.assign(objFilterTable, newQuery);
    history.push({
      pathname,
      search: stringify({ ...newQuery }, { arrayFormat: "repeat" }),
    });
  };
  const onChangeTable = (page) => {
    setLimit(page.pageSize);
    setPage(page.current);
  };
  const toggleModal = () => {
    setShowModal(!showModal);
    form.resetFields();
  };
  const toggleModalVaiTro = () => {
    setShowModal(true);
    setTypeOrgEdit({ org: true });
    form.setFieldsValue({ active: true });
  };
  const onFinish = async (values) => {
    let newValues = values;
    newValues.username = newValues?.username?.toLowerCase();
    newValues.email = newValues?.email?.toLowerCase();
    if (values.id) {
      const res = await updateById(newValues?.id, newValues);
      if (res) {
        getDataFilter();
        toggleModal();
      }
    } else {
      const apiRes = await issueAccountOrg(newValues);
      if (apiRes) {
        getDataFilter();
        toggleModal();
      }
    }
  };
  return (
    <BaseContent>
      <div className="QuanLyTaiKhoanToChuc">
        <div className="QuanLyTaiKhoanToChuc__title">
          <span>Danh sách tài khoản tổ chức</span>
        </div>

        <SearchBar
          onFilterChange={handleRefresh}
          dataSearch={dataSearch}
          buttonHeader={(myPermission?.[thisUrl]?.them || myPermission?.is_admin) && true}
          labelButtonHeader={(myPermission?.[thisUrl]?.them || myPermission?.is_admin) && "Thêm tài khoản"}
          handleBtnHeader={toggleModalVaiTro}
        />

        <div className="table_dssp">
          {isLoading && <Loading />}
          {data && !isLoading && (
            <Table
              bordered
              className="table"
              showHeader={true}
              columns={ColumnsThemMoiSanPham}
              dataSource={data}
              scroll={{ x: 900 }}
              pagination={{
                ...PAGINATION_CONFIG,
                current: page,
                pageSize: limit,
                total: totalDocs,
              }}
              onChange={onChangeTable}
            />
          )}
        </div>
        <Modal
          title={
            <span className="modal-role__tile">
              {form.getFieldValue("id") ? "Chỉnh sửa tài khoản tổ chức" : "Thêm mới tài khoản tổ chức"}
            </span>
          }
          className="modal-width-50"
          style={{ top: " 50px" }}
          visible={showModal}
          forceRender={true}
          onCancel={props.loading ? () => null : toggleModal}
          footer={null}
        >
          <Form
            form={form}
            layout="horizontal"
            id="formModal"
            name="form-nhan-vien"
            requiredMark={false}
            className="custom-form"
            onFinish={onFinish}
          >
            <Row gutter={10}>
              <Form.Item name="id" hidden>
                <Input />
              </Form.Item>
              <Col span={24}>
                <Form.Item
                  label={
                    <span>
                      Họ và tên <span className="form-item-remark">*</span>{" "}
                    </span>
                  }
                  name="name"
                  rules={[
                    {
                      required: true,
                      message: "Họ và tên người dùng không được bỏ trống",
                    },
                    {validator: validateSpaceNull}
                  ]}
                  className="form-item-container"
                  labelCol={{ xl: 4, md: 7, sm: 24 }}
                  wrapperCol={{
                    xl: { span: 18, offset: 3 },
                    md: { span: 15, offset: 6 },
                    sm: { span: 24, offset: 0 },
                  }}
                ><Input size="small" placeholder="Nhập họ và tên người dùng" className="form-item__input" /></Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  label={
                    <span>
                      Tên tài khoản <span className="form-item-remark">*</span>{" "}
                    </span>
                  }
                  name="username"
                  rules={[
                    {
                      required: true,
                      message: "Tên tài khoản không được bỏ trống",
                    },
                    { validator: isUsernameValid },
                  ]}
                  className="form-item-container"
                  labelCol={{ xl: 4, md: 7, sm: 24 }}
                  wrapperCol={{
                    xl: { span: 18, offset: 3 },
                    md: { span: 15, offset: 6 },
                    sm: { span: 24, offset: 0 },
                  }}
                >
                  <Input size="small" placeholder="Nhập tên tài khoản" className="form-item__input" />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  label={
                    <span>
                      Email <span className="form-item-remark">*</span>{" "}
                    </span>
                  }
                  name="email"
                  rules={[
                    {
                      required: true,
                      type: "email",
                      message: "Email không hợp lệ!",
                    },
                  ]}
                  className="form-item-container"
                  labelCol={{ xl: 4, md: 7, sm: 24 }}
                  wrapperCol={{
                    xl: { span: 18, offset: 3 },
                    md: { span: 15, offset: 6 },
                    sm: { span: 24, offset: 0 },
                  }}
                >
                  <Input size="small" placeholder="Nhập email" className="form-item__input" />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  label={
                    <span>
                      Số điện thoại <span className="form-item-remark">*</span>{" "}
                    </span>
                  }
                  name="phone"
                  rules={[
                    RULES.PHONE_NUMBER,
                    {
                      required: true,
                      message: "Số điện thoại không được bỏ trống!",
                    },
                  ]}
                  className="form-item-container"
                  labelCol={{ xl: 4, md: 7, sm: 24 }}
                  wrapperCol={{
                    xl: { span: 18, offset: 3 },
                    md: { span: 15, offset: 6 },
                    sm: { span: 24, offset: 0 },
                  }}
                >
                  <Input size="small" placeholder="Nhập số điện thoại" className="form-item__input" />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  label={<span>Địa chỉ </span>}
                  name="address"
                  className="form-item-container"
                  labelCol={{ xl: 4, md: 7, sm: 24 }}
                  wrapperCol={{
                    xl: { span: 18, offset: 3 },
                    md: { span: 15, offset: 6 },
                    sm: { span: 24, offset: 0 },
                  }}
                >
                  <Input size="small" placeholder="Nhập địa chỉ" className="form-item__input" />
                </Form.Item>
              </Col>
              {typeOrgEdit?.org && (
                <Col span={24}>
                  <Form.Item
                    label={
                      <span>
                        Tổ chức<span className="form-item-remark">*</span>
                      </span>
                    }
                    name="org"
                    className="form-item-container"
                    rules={[
                      {
                        required: true,
                        message: "Tổ chức không được bỏ trống",
                      },
                    ]}
                    labelCol={{ xl: 4, md: 7, sm: 24 }}
                    wrapperCol={{
                      xl: { span: 18, offset: 3 },
                      md: { span: 15, offset: 6 },
                      sm: { span: 24, offset: 0 },
                    }}
                  >
                    <Select
                      showSearch
                      placeholder="Vui lòng chọn tổ chức"
                      filterOption={(inputValue, option) =>
                        option.label.toLowerCase().indexOf(inputValue.toLowerCase()) !== -1
                      }
                    >
                      {org &&
                        org.map((option) => (
                          <Select.Option key={option._id} value={option._id} label={option.name}>
                            {option.name}
                          </Select.Option>
                        ))}
                    </Select>
                  </Form.Item>
                </Col>
              )}
              <Col span={24}>
                <Form.Item
                  label={<span>Trạng thái</span>}
                  name="active"
                  className="form-item-container"
                  labelCol={{ xl: 4, md: 7, sm: 24 }}
                  wrapperCol={{
                    xl: { span: 18, offset: 3 },
                    md: { span: 15, offset: 6 },
                    sm: { span: 24, offset: 0 },
                  }}
                >
                  <Select
                    placeholder="Chọn trạng thái tài khoản"
                    defaultValue={form.getFieldValue("active") ? form.getFieldValue("active") : true}
                  >
                    <Select.Option value={true}>Đã kích hoạt</Select.Option>
                    <Select.Option value={false}>Chưa kích hoạt</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={24} className="form-footer">
                <Button size="small" onClick={toggleModal} disabled={props.loading} className="btn-footer btn-cancel">
                  Huỷ thao tác
                </Button>

                <Button
                  size="small"
                  htmlType="submit"
                  loading={props.loading}
                  form="formModal"
                  className="btn-footer btn-submit"
                >
                  {form.getFieldValue("id") ? "Lưu thông tin" : "Thêm mới"}
                </Button>
              </Col>
            </Row>
          </Form>
        </Modal>
      </div>
    </BaseContent>
  );
}
function mapStateToProps(store) {
  const { token } = store.app;
  const { myInfo } = store.user;
  const { isLoading } = store.app;

  return {
    token,
    myPermission: myInfo?.userPermissions,
    loading: isLoading,
    myInfo,
  };
}

const withConnect = connect(mapStateToProps);

export default withConnect(QuanLyTaiKhoanToChuc);
