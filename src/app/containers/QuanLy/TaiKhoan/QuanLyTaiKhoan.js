import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { deleteById, getAll, getMyOrgeRoles, issueAccount, updateById } from '@app/services/NhanVien';
import BaseContent from '@components/BaseContent';
import Loading from '@components/Loading';
import { PAGINATION_CONFIG, RULES, STATUS_ACCOUNT } from '@constants';
import { Button, Col, Form, Input, Modal, Popconfirm, Row, Select, Table, Tooltip } from 'antd';
import React, { useEffect, useState } from 'react';
import './QuanLyTaiKhoan.scss';

import { formatSTT, getChangeFormSearch, isUsernameValid, validateSpaceNull } from '@app/common/functionCommons';
import SearchBar from '@components/SearchBar';
import { stringify } from 'qs';
import queryString from 'query-string';
import { connect } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';

QuanLyTaiKhoan.propTypes = {};

function QuanLyTaiKhoan(props) {
  const [form] = Form.useForm();
  const [data, setData] = useState(null);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [totalDocs, setTotalDocs] = useState(0);
  const [isLoading, setLoading] = useState(null);
  const [myOrgRoles, setMyOrgRoles] = useState([]);
  const [roleOptions, setRoleOptions] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const location = useLocation();
  const history = useHistory();
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
        setRoleOptions(options);
        setMyOrgRoles(res);
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
    { title: "Tài khoản", dataIndex: "username", key: "username" },
    { title: "Tên nhân viên", dataIndex: "name", key: "name" },
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
    { title: "Vai trò", key: "tenvaitro", align: "center", render: (_, value) => value.access_role?.tenvaitro },
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
    const res = await deleteById(value);
    if (res) {
      getDataFilter();
      form.setFieldsValue({ id: value });
    }
  };
  const handleEdit = async (value) => {
    toggleModalVaiTro();
    form.setFieldsValue({ ...value, id: value?._id, access_role: value.access_role?._id });
  };
  const formatActionCell = (value) => {
    let { myPermission } = props;
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
  const dataSearch = [
    {
      name: "username",
      label: "Tài khoản",
      type: "text",
      operation: "like",
    },
    {
      name: "name",
      label: "Tên nhân viên",
      type: "text",
      operation: "like",
    },
    {
      type: "select",
      name: "access_role",
      label: "Vai trò",
      options: myOrgRoles,
      key: "_id",
      value: "tenvaitro",
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
    const pages = parseInt(search.page ? search.page : page);
    const limits = parseInt(search.limit ? search.limit : limit);
    let queryStr = "";
    queryStr += `${search.username ? "&username[like]={0}".format(search.username) : ""}`;
    queryStr += `${search.name ? "&name[like]={0}".format(search.name) : ""}`;
    queryStr += `${search.access_role ? "&access_role={0}".format(search.access_role) : ""}`;
    queryStr += `${search.active ? "&active={0}".format(search.active) : ""}`;
    setLoading(true);
    const apiResponse = await getAll(pages, limits, queryStr);
    if (apiResponse) {
      const dataRes = apiResponse.docs;
      setData(dataRes);
      setLimit(apiResponse.limit);
      setPage(apiResponse.page);
      setTotalDocs(apiResponse.totalDocs);
    }
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
    history.push({ pathname, search: stringify({ ...newQuery }, { arrayFormat: "repeat" }) });
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
      const apiRes = await issueAccount(newValues);
      if (apiRes) {
        getDataFilter();
        toggleModal();
      }
    }
  };
  let { myPermission } = props;

  return (
    <BaseContent>
      <div className="QuanLyTaiKhoan">
        <div className="QuanLyTaiKhoan__title">
          <span>Danh sách nhân viên</span>
        </div>

        <SearchBar
          onFilterChange={handleRefresh}
          dataSearch={dataSearch}
          buttonHeader={myPermission?.[thisUrl]?.them || myPermission?.is_admin}
          labelButtonHeader={myPermission?.[thisUrl]?.them || myPermission?.is_admin ? "Thêm nhân viên" : ""}
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
              {form.getFieldValue("id") ? "Cập nhật thông tin nhân viên" : "Thêm mới nhân viên"}
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
                      Tên tài khoản <span className="form-item-remark">*</span>{" "}
                    </span>
                  }
                  name="username"
                  rules={[
                    { required: true, message: "Tên tài khoản không được bỏ trống" },
                    { validator: isUsernameValid },
                  ]}
                  className="form-item-container"
                  labelCol={{ xl: 4, md: 7, sm: 24 }}
                  wrapperCol={{ xl: { span: 18, offset: 3 }, md: { span: 15, offset: 6 }, sm: { span: 24, offset: 0 } }}
                >
                  <Input
                    size="small"
                    placeholder="Nhập tên tài khoản"
                    className="form-item__input"
                    disabled={form.getFieldValue("id") ? true : false}
                  />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  label={
                    <span>
                      Họ và tên <span className="form-item-remark">*</span>{" "}
                    </span>
                  }
                  name="name"
                  className="form-item-container"
                  labelCol={{ xl: 4, md: 7, sm: 24 }}
                  rules={[
                    { required: true, message: "Tên tài khoản không được bỏ trống" },
                    { validator: validateSpaceNull },
                  ]}
                  wrapperCol={{ xl: { span: 18, offset: 3 }, md: { span: 15, offset: 6 }, sm: { span: 24, offset: 0 } }}
                >
                  <Input size="small" placeholder="Nhập họ tên đầy đủ" className="form-item__input" />
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
                  rules={[{ required: true, type: "email", message: "Email không hợp lệ!" }]}
                  className="form-item-container"
                  labelCol={{ xl: 4, md: 7, sm: 24 }}
                  wrapperCol={{ xl: { span: 18, offset: 3 }, md: { span: 15, offset: 6 }, sm: { span: 24, offset: 0 } }}
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
                  rules={[RULES.PHONE_NUMBER, { required: true, message: "Số điện thoại không được bỏ trống!" }]}
                  className="form-item-container"
                  labelCol={{ xl: 4, md: 7, sm: 24 }}
                  wrapperCol={{ xl: { span: 18, offset: 3 }, md: { span: 15, offset: 6 }, sm: { span: 24, offset: 0 } }}
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
                  wrapperCol={{ xl: { span: 18, offset: 3 }, md: { span: 15, offset: 6 }, sm: { span: 24, offset: 0 } }}
                >
                  <Input size="small" placeholder="Nhập địa chỉ" className="form-item__input" />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  label={
                    <span>
                      Vai trò<span className="form-item-remark">*</span>{" "}
                    </span>
                  }
                  name="access_role"
                  className="form-item-container"
                  labelCol={{ xl: 4, md: 7, sm: 24 }}
                  wrapperCol={{ xl: { span: 18, offset: 3 }, md: { span: 15, offset: 6 }, sm: { span: 24, offset: 0 } }}
                  rules={[{ required: true, message: "Vai trò không được bỏ trống" }]}
                >
                  <Select
                    notFoundContent="Không tồn tại vai trò!"
                    showSearch
                    placeholder="Chọn vai trò nhân viên"
                    optionFilterProp="children"
                    filterOption={(input, option) => (option?.label ?? "").includes(input)}
                    filterSort={(optionA, optionB) =>
                      (optionA?.label ?? "").toLowerCase().localeCompare((optionB?.label ?? "").toLowerCase())
                    }
                    options={roleOptions}
                  />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  label={<span>Trạng thái</span>}
                  name="active"
                  className="form-item-container"
                  labelCol={{ xl: 4, md: 7, sm: 24 }}
                  wrapperCol={{ xl: { span: 18, offset: 3 }, md: { span: 15, offset: 6 }, sm: { span: 24, offset: 0 } }}
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

  return { token, myPermission: myInfo?.userPermissions, loading: isLoading };
}

const withConnect = connect(mapStateToProps);

export default withConnect(QuanLyTaiKhoan);

