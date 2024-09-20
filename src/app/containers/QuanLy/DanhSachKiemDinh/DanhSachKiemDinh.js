import BaseContent from '@components/BaseContent';
import VisibleIcon from '@components/Icons/VisibleIcon';
import Loading from '@components/Loading';
import { connect } from 'react-redux';
import {
  BROWSING_COLOR,
  CONSTANTS,
  PAGINATION_CONFIG,
  RESULT_SENDING,
  STATUS_STEP_OPTIONS_SEARCH,
  TOAST_MESSAGE,
  VI_STATUS_STEP,
} from '@constants';
import { URL } from '@url';
import { Button, Col, Form, Input, Modal, Row, Select, Space, Table, Tooltip } from 'antd';
import React, { useEffect, useState } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import queryString from 'query-string';
import { formatSTT, getChangeFormSearch, toast } from '@app/common/functionCommons';
import './DanhSachKiemDinh.scss';
import EndorserIcon from '@components/Icons/EndorserIcon';
import { changeInspectorAll, getMyOrgInspectByParcel } from '@app/services/QLKiemDinh';
import SearchBar from '@components/SearchBar';
import { stringify } from 'qs';
import { getAll as getAllMyOrgUser } from '@app/services/NhanVien';

DanhSachKiemDinh.propTypes = {};

function DanhSachKiemDinh(props) {
  let { myPermission } = props;
  const [statusFilter, setStatusFilter] = useState(false);
  const [form] = Form.useForm();
  const [data, setData] = useState(null);
  const [search, setSearch] = useState({
    name: null,
    parcel: null,
    status: null,
  });
  const [isLoading, setLoading] = useState(null);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [totalDocs, setTotalDocs] = useState(0);
  const [myOrgUsers, setMyOrgUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [stepModal, setStepModal] = useState([]);
  let tentrang = "danh-sach-kiem-dinh";
  const location = useLocation();
  const history = useHistory();

  useEffect(() => {
    const getInitData = async () => {
      const res = await getAllMyOrgUser(1, 0, "");
      if (res) {
        const options = res?.docs?.map((value) => {
          return {
            value: value._id,
            label: value.name,
          };
        });
        setMyOrgUsers(options);
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

  const toggleModal = () => {
    setShowModal(!showModal);
    form.resetFields();
  };
  const toggleModalInspector = (value) => {
    setShowModal(true);
    setStepModal(value);
  };
  const onChange = (value) => {
    form.setFieldsValue({ inspector: value });
  };
  const ColumnsThemMoiSanPham = [
    {
      title: "STT",
      render: (v1, v2, value) => formatSTT(limit, page, value),
      align: "center",
      width: 70,
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "product",
      render: (value) => value?.name,
      key: "name",
      width: 300,
    },
    {
      title: "Quy trình sản xuất",
      dataIndex: "procedure",
      key: "procedure",
      render: (value) => value?.name,
      width: 300,
    },
    {
      title: "Mã lô hàng",
      dataIndex: "name",
      key: "parcel",
      align: "center",
      width: 120,
    },

    {
      title: "Bước kiểm định",
      key: "steps",
      dataIndex: "steps",
      render: (values, row, index) => {
        const rows = values?.map((value) => {
          return (
            <div className="cell-row-mutil__item cell-item-300">
              {value?.name}
            </div>
          );
        });
        return <div className="cell-row-mutil">{rows}</div>;
      },
      className: "col-table-parent",
    },
    {
      title: "Nhân viên kiểm định",
      key: "user",
      dataIndex: "steps",
      render: (values, row, index) => {
        const rows = values?.map((value) => {
          return (
            <div className="cell-row-mutil__item">{value?.inspector?.name}</div>
          );
        });
        return <div className="cell-row-mutil">{rows}</div>;
      },
      width: 120,
    },
    {
      title: "Trạng thái",
      key: "status",
      dataIndex: "steps",
      align: "center",
      render: (values, row, index) => {
        const rows = values?.map((value, index) => {
          return (
            <div key={index} className="cell-row-mutil__item">
              {value?.status && (
                <span
                  className={`status`}
                  style={BROWSING_COLOR[value?.status_endorser]}
                >
                  {VI_STATUS_STEP[value?.status_endorser]}
                </span>
              )}
            </div>
          );
        });
        return <div className="cell-row-mutil">{rows}</div>;
      },
      width: 120,
    },
    {
      title: "Tác vụ",
      key: "action",
      align: "center",
      dataIndex: "steps",

      width: 100,
      render: (values, row, index) => {
        let isShow = false;
        values.map((res) => {
          if (res.status_endorser != RESULT_SENDING.COMPLETED) isShow = true;
        });
        return (
          <div className="cell-row-mutil__item">
            <Space size={[8, 16]}>
              <Link to={`${URL.KIEM_DINH_LO_HANG_ID}`.format(row?._id)}>
                <Tooltip
                  placement="left"
                  title="Xem chi tiết thông tin lô hàng"
                  color="#179a6b"
                >
                  <Button
                    type="primary"
                    icon={<VisibleIcon />}
                    style={{ borderRadius: 0 }}
                  />
                </Tooltip>
              </Link>
              {myPermission?.is_admin && isShow && (
                <Tooltip
                  placement="left"
                  title="Phân công nhân viên kiểm định lô hàng"
                  color="#1890FF"
                >
                  <Button
                    type="primary"
                    icon={<EndorserIcon />}
                    style={{
                      borderRadius: 0,
                      backgroundColor: "#1890FF",
                      border: "none",
                    }}
                    onClick={() => toggleModalInspector(values)}
                  />
                </Tooltip>
              )}
            </Space>
          </div>
        );
      },
    },
  ];
  const getDataFilter = async () => {
    const search = queryString.parse(props.location.search);
    const pages = parseInt(search.page ? search.page : page);
    const limits = parseInt(search.limit ? search.limit : limit);
    let queryStr = "";
    queryStr += `${
      search.product_name ? "&product_name[like]={0}".format(search.product_name) : ""
    }`;
    queryStr += `${
      search.step_status ? "&step_status={0}".format(search.step_status) : ""
    }`;
    queryStr += `${
      search.step_inspector
        ? "&step_inspector={0}".format(search.step_inspector)
        : ""
    }`;
    // queryStr += `${search.active ? "&active={0}".format(search.active) : ""}`;
    setLoading(true);
    const apiResponse = await getMyOrgInspectByParcel(pages, limits, queryStr);
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
    history.push({
      pathname,
      search: stringify({ ...newQuery }, { arrayFormat: "repeat" }),
    });
  };
  const onChangeTable = (page) => {
    setLimit(page.pageSize);
    setPage(page.current);
  };
  const dataSearch = [
    {
      name: "product_name",
      label: "Tên sản phẩm",
      type: "text",
      operation: "like",
    },

    {
      type: "select",
      name: "step_inspector",
      label: "Nhân viên kiểm định",
      options: myOrgUsers,
      key: "value",
      value: "label",
    },
    {
      type: "select",
      name: "step_status",
      label: "Trạng thái",
      options: STATUS_STEP_OPTIONS_SEARCH,
      key: "value",
      value: "name",
    },
  ];
  const onFinish = async (values) => {
    let steps = [];
    let dataPush = null;
    let parcel = null;
    if (values.inspector) {
      for (let i = 0; i < stepModal.length; i++) {
        steps.push(stepModal[i]._id);
        parcel = stepModal[i].parcel;
      }
      if (steps) {
        dataPush = {
          inspector: values.inspector,
          steps,
          parcel,
        };
      } else toast(CONSTANTS.ERROR, TOAST_MESSAGE.PARCEL.EMPTY_PHAN_CONG);
      if (dataPush) {
        const res = await changeInspectorAll(dataPush);
        if (res) {
          getDataFilter();
          toggleModal();
        }
      }
    }
  };

  return (
    <BaseContent>
      <div className="DanhSachKiemDinh">
        <div className="DanhSachKiemDinh__title">
          <span>Danh sách kiểm định</span>
        </div>
        <SearchBar
          onFilterChange={handleRefresh}
          dataSearch={dataSearch}
          buttonHeader={false}
          // labelButtonHeader="Thêm nhân viên"
          // handleBtnHeader={}
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
              scroll={{ x: 1300 }}
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
          title={<span className="modal-role__tile">Phân công kiểm định</span>}
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
                      Nhân viên kiểm định
                      <span className="form-item-remark">*</span>{" "}
                    </span>
                  }
                  name="inspector"
                  className="form-item-container"
                  labelCol={{ xl: 6, md: 8, sm: 24 }}
                  wrapperCol={{
                    xl: { span: 17, offset: 1 },
                    md: { span: 15, offset: 3 },
                    sm: { span: 24, offset: 0 },
                  }}
                  rules={[
                    {
                      required: true,
                      message: "Nhân viên kiểm định không được bỏ trống",
                    },
                  ]}
                >
                  <Select
                    notFoundContent="Không tồn tại nhân viên!"
                    showSearch
                    placeholder="Chọn nhân viên kiểm định"
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      (option?.label ?? "").includes(input)
                    }
                    filterSort={(optionA, optionB) =>
                      (optionA?.label ?? "")
                        .toLowerCase()
                        .localeCompare((optionB?.label ?? "").toLowerCase())
                    }
                    options={myOrgUsers}
                  />
                </Form.Item>
              </Col>

              <Col span={24} className="form-footer">
                <Button
                  size="small"
                  onClick={toggleModal}
                  disabled={props.loading}
                  className="btn-footer btn-cancel"
                >
                  Huỷ thao tác
                </Button>

                <Button
                  size="small"
                  htmlType="submit"
                  loading={props.loading}
                  form="formModal"
                  className="btn-footer btn-submit"
                >
                  Gửi yêu cầu
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

export default withConnect(DanhSachKiemDinh);
