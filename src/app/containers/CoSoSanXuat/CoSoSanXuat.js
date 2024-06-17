import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import "./CoSoSanXuat.scss";
import { connect } from "react-redux";
import BaseContent from "@components/BaseContent";
import Loading from "@components/Loading";
import SearchBar from "@components/SearchBar";
import queryString, { stringify } from "query-string";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { addNewFacture, deleteFacture, editFacture, getManufactureAllPagination } from "@app/services/Manufacture";
import { CONSTANTS, PAGINATION_CONFIG, RULES, TOAST_MESSAGE } from "@constants";
import { Button, Form, Input, Modal, Table, Tooltip } from "antd";
import { formatSTT, toast, validateSpaceNull } from "@app/common/functionCommons";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import DialogDeleteConfim from "@components/DialogDeleteConfim/DialogDeleteConfim";
CoSoSanXuat.propTypes = {};

function CoSoSanXuat({ token, myPermission, loading, myInfo, ...props }) {
  const [form] = Form.useForm();
  const history = useHistory();
  let tentrang = "co-so-san-xuat";
  const [data, setData] = useState(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalDocs, setTotalDocs] = useState(0);
  const [modalVisible, handleVisibleModal] = useState(false);
  const [edit, setEdit] = useState(false);
  const [visibleRemove, setRemove] = useState(false);
  const [dataRemove, setDataRemove] = useState(null);
  useEffect(() => {
    getDataFilter();
  }, [location.search]);
  useEffect(() => {
    handleRefresh({}, true);
  }, [page, limit]);
  const getDataFilter = async () => {
    const search = queryString.parse(props.location.search);
    const pages = parseInt(search.page ? search.page : page);
    const limits = parseInt(search.limit ? search.limit : limit);
    let queryStr = "";
    queryStr += `${search.name ? "&name[like]={0}".format(search.name) : ""}`;
    // queryStr += `${search.active ? "&active={0}".format(search.active) : ""}`;
    const apiResponse = await getManufactureAllPagination(myInfo.org._id, pages, limits, queryStr);
    if (apiResponse) {
      const dataRes = apiResponse.docs;
      setData(dataRes);
      setLimit(apiResponse.limit);
      setPage(apiResponse.page);
      setTotalDocs(apiResponse.totalDocs);
    }
  };
  const dataSearch = [
    {
      name: "name",
      label: "Tên cơ sở",
      key: "name",
      type: "text",
      operation: "like",
    },
  ];
  const handleRefresh = (newQuery, changeTable) => {
    const { pathname } = location;
    let objFilterTable = { page, limit };
    if (changeTable) {
      newQuery = queryString.parse(location.search);
      delete newQuery.page;
      delete newQuery.limit;
    }
    newQuery = Object.assign(objFilterTable, newQuery);
    history.push({ pathname, search: stringify({ ...newQuery }, { arrayFormat: "repeat" }) });
  };
  const btnEdit = (data) => {
    setEdit(data);
    form.setFieldsValue(data);
    handleVisibleModal(true);
  };
  const remove = (data) => {
    setRemove(true);
    setDataRemove(data);
  };
  const ColumnCoSoSanXuat = [
    {
      title: "STT",
      render: (v1, v2, value) => formatSTT(limit, page, value),
      key: "STT",
      align: "center",
      width: 60,
    },
    { title: "Tên cơ sở", dataIndex: "name", key: "name" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Địa chỉ", dataIndex: "address", key: "address" },
    { title: "Điện thoại", dataIndex: "phone", key: "phone" },
    {
      title: "Tác vụ",
      key: "action",
      align: "center",
      className: "titleTable",
      width: 100,
      render: (_, value, index) => {
        return (
          <div className="btn-action-table">
            {(myPermission?.[tentrang]?.sua || myPermission?.is_admin) && (
              <Tooltip placement="left" title="Chỉnh sửa thông tin cơ sở" color="#FF811E">
                <Button
                  icon={<EditOutlined />}
                  size="small"
                  type="primary"
                  className="mr-1"
                  style={{ backgroundColor: "#FF811E", borderColor: "#FF811E" }}
                  onClick={() => btnEdit(value)}
                ></Button>
              </Tooltip>
            )}
            {(myPermission?.[tentrang]?.xoa || myPermission?.is_admin) && (
              <Tooltip placement="top" title="Xoá thông tin" color="#FF0000">
                <Button
                  icon={<DeleteOutlined />}
                  size="small"
                  type="primary"
                  className="mr-1"
                  style={{ backgroundColor: "#FF0000", borderColor: "#FF0000" }}
                  onClick={() => remove(value)}
                ></Button>
              </Tooltip>
            )}
          </div>
        );
      },
    },
  ];
  const onChangeTable = (page) => {
    setLimit(page.pageSize);
    setPage(page.current);
  };
  const addFacture = () => {
    handleVisibleModal(!modalVisible);
    setEdit(false);
    form.resetFields();
  };
  const onSubmitForm = async (e) => {
    if (edit) {
      const response = await editFacture(edit._id, e);
      if (response) {
        toast(CONSTANTS.SUCCESS, TOAST_MESSAGE.SUCCESS.UPDATE_FACTURE);
        getDataFilter();
        handleVisibleModal(false);
        form.resetFields();
      }
    } else {
      const response = await addNewFacture(myInfo.org._id, e);
      if (response) {
        toast(CONSTANTS.SUCCESS, TOAST_MESSAGE.SUCCESS.CREATE_FACTURE);
        getDataFilter();
        handleVisibleModal(false);
        form.resetFields();
      }
    }
  };
  const onCloseRemove = () => {
    setRemove(false);
    setDataRemove(null);
  };
  const agreeRemove = async () => {
    const response = await deleteFacture(dataRemove._id);
    if (response) {
      toast(CONSTANTS.SUCCESS, TOAST_MESSAGE.SUCCESS.DELETE_FACTURE);
      getDataFilter();
      onCloseRemove();
    }
  };
  return (
    <>
      <BaseContent>
        <Loading active={loading}>
          <div className="manufacture-container">
            <div className="title">
              <span>Danh sách cơ sở sản xuất</span>
            </div>
            <div className="search-bar">
              <SearchBar
                onFilterChange={handleRefresh}
                dataSearch={dataSearch}
                buttonHeader={myPermission?.[tentrang]?.sua || myPermission?.is_admin ? true : false}
                labelButtonHeader={"Thêm cơ sở"}
                handleBtnHeader={addFacture}
              />
            </div>
            <div className="table-show-info">
              {data && !loading && (
                <Table
                  bordered
                  className="table"
                  showHeader={true}
                  columns={ColumnCoSoSanXuat}
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
          </div>
        </Loading>
      </BaseContent>
      <Modal
        visible={modalVisible}
        footer={null}
        onCancel={addFacture}
        title={edit ? "Chỉnh sửa cơ sở sản xuất" : "Thêm mới cơ sở sản xuất"}
        className="modal-add-new"
        width={700}
      >
        <Form
          className="form-register"
          labelCol={{
            span: 8,
          }}
          wrapperCol={{
            span: 16,
          }}
          initialValues={{
            remember: true,
          }}
          onFinish={onSubmitForm}
          autoComplete="off"
          form={form}
        >
          <Form.Item
            label="Tên cơ sở sản xuất"
            name="name"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập tên cơ sở sản xuất",
              },
              { validator: validateSpaceNull },
            ]}
          >
            <Input placeholder="Nhập tên cơ sở sản xuất" />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập email cơ sở sản xuất",
              },
              RULES.EMAIL,
            ]}
          >
            <Input placeholder="Nhập email cơ sở sản xuất" />
          </Form.Item>
          <Form.Item
            label="Địa chỉ"
            name="address"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập địa chỉ cơ sở sản xuất",
              },
              { validator: validateSpaceNull },
            ]}
          >
            <Input placeholder="Nhập địa chỉ cơ sở sản xuất" />
          </Form.Item>
          <Form.Item
            label="Số điện thoại"
            name="phone"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập địa chỉ cơ sở sản xuất",
              },
              RULES.PHONE_NUMBER,
            ]}
          >
            <Input placeholder="Nhập số điện thoại cơ sở sản xuất" />
          </Form.Item>
          <div className="btn-action">
            <Button className="btn-cancel" onClick={addFacture}>
              Huỷ thao tác
            </Button>
            <Button type="primary" htmlType="submit">
              {edit ? "Lưu thông tin" : "Thêm mới"}
            </Button>
          </div>
        </Form>
      </Modal>
      <DialogDeleteConfim visible={visibleRemove} onCancel={onCloseRemove} onOK={agreeRemove} />
    </>
  );
}
function mapStateToProps(store) {
  const { token } = store.app;
  const { myInfo } = store.user;
  const { isLoading } = store.app;

  return { token, myPermission: myInfo?.userPermissions, loading: isLoading, myInfo };
}

export default connect(mapStateToProps)(CoSoSanXuat);





