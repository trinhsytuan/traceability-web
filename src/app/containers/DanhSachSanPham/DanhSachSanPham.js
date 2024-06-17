import {
  DownOutlined,
  PlusOutlined,
  SearchOutlined,
  UpOutlined,
} from "@ant-design/icons";
import { getParcelSelectByMyOrg, getProductByID } from "@app/services/TruyXuat";
import CongKhai from "@assets/icons/congkhai-icon.svg";
import DangTao from "@assets/icons/dangtao-icon.svg";
import HoanTatKiemDinh from "@assets/icons/hoantatkiemdinh-icon.svg";
import TuChoiKiemDinh from "@assets/icons/tuchoikiemdinh-icon.svg";
import DangKiemDinh from "@assets/icons/DangKiemDinh-icon.svg";
import SendingIcon from "@assets/icons/sending-icon.svg";
import BaseContent from "@components/BaseContent";
import VisibleIcon from "@components/Icons/VisibleIcon";
import Loading from "@components/Loading";
import { PAGINATION_CONFIG, STATUS_PARCEL_ENDORSER } from "@constants";
import { URL } from "@url";
import { Button, Col, Form, Input, Row, Select, Table, Tooltip } from "antd";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import "./DanhSachSanPham.scss";
import queryString, { stringify } from "query-string";
import LoHang from "./LoHang";
import { connect } from "react-redux";
import SearchBar from "@components/SearchBar";
DanhSachSanPham.propTypes = {};

function DanhSachSanPham({ myPermission }) {
  const [statusFilter, setStatusFilter] = useState(false);
  const [form] = Form.useForm();
  const tentrang = "quan-ly-san-pham";
  const [data, setData] = useState(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalDocs, setTotalDocs] = useState(0);
  const [isLoading, setLoading] = useState(null);
  const [dataSelectProcedure, setDataSelectProcedure] = useState([]);
  const history = useHistory();
  const handleFilter = () => {
    setStatusFilter(!statusFilter);
  };

  const formReset = () => {
    form.resetFields();
    setSearch({ name: null, parcel: null, status: null });
    const queryParams = new URLSearchParams();
    const queryString = queryParams.toString();
    history.push(`?${queryString}`);
  };
  const finishForm = (e) => {
    const queryParams = new URLSearchParams(location.search);
    if (e.name) {
      queryParams.set("name", e.name);
    }
    if (e.status) {
      queryParams.set("status", e.status);
    }
    if (e.parcel) {
      queryParams.set("parcel", e.parcel);
    }
    const queryString = queryParams.toString();
    history.push(`?${queryString}`);
  };
  const addProduct = () => {
    history.push(URL.THEM_MOI_SAN_PHAM);
  };
  useEffect(() => {
    initDataSelect();
    getDataFilter();
  }, [location.search]);
  useEffect(() => {
    handleRefresh({}, true);
  }, [page, limit]);
  const getDataFilter = async () => {
    setLoading(true);
    const search = queryString.parse(location.search);
    let queryStr = "";
    queryStr += `${
      search.procedure ? "&procedure={0}".format(search.procedure) : ""
    }`;
    queryStr += `${
      search.product ? "&name[like]={0}".format(search.product) : ""
    }`;
    queryStr += `${search.code ? "&code[like]={0}".format(search.code) : ""}`;
    const apiResponse = await getProductByID(page, limit, queryStr);
    if (apiResponse) {
      const dataRes = apiResponse.docs;
      setData(dataRes);
      setLimit(apiResponse.limit);
      setPage(apiResponse.page);
      setTotalDocs(apiResponse.totalDocs);
    }
    setLoading(false);
  };
  const tableChange = (page) => {
    setLimit(page.pageSize);
    setPage(page.current);
  };
  const ColumnsThemMoiSanPham = [
    {
      title: "STT",
      dataIndex: "key",
      key: "key",
      align: "center",
      width: 70,
      className: "titleTable",
      render: (_, values, index) => (
        <span>{index + 1 + (page - 1) * limit}</span>
      ),
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "name",
      key: "name",
      className: "titleTable",
      width: 200,
    },
    {
      title: "Quy trình sản xuất",
      dataIndex: "procedure",
      key: "procedure",
      width: 300,
      render: (value) => value?.name,
    },
    {
      title: (
        <span style={{ display: "flex", justifyContent: "center" }}>
          Mã lô hàng
        </span>
      ),
      dataIndex: "parcel",
      key: "parcel",
      width: "500px",
      render: (_, value) => (
        <div className="LoHang_More">
          <LoHang value={value} />
        </div>
      ),
    },
    {
      title: "Tác vụ",
      key: "action",
      align: "center",
      className: "titleTable",
      width: 80,
      render: (_, value) => (
        <>
          <Tooltip
            placement="left"
            title="Xem chi tiết sản phẩm"
            color="#179a6b"
          >
            <Button
              type="primary"
              icon={<VisibleIcon />}
              style={{ borderRadius: 0 }}
              onClick={() =>
                history.push(URL.CHI_TIET_SAN_PHAM_ID.format(value._id))
              }
            />
          </Tooltip>
        </>
      ),
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
    history.push({
      pathname,
      search: stringify({ ...newQuery }, { arrayFormat: "repeat" }),
    });
  };
  const initDataSelect = async () => {
    const response = await getParcelSelectByMyOrg();
    setDataSelectProcedure(response);
  };
  const dataSearch = [
    {
      name: "product",
      label: "Tên sản phẩm",
      type: "text",
      operation: "like",
    },
    {
      name: "code",
      label: "Mã sản phẩm",
      type: "text",
      operation: "like",
    },
    {
      type: "select",
      name: "procedure",
      label: "Quy trình sản xuất",
      options: dataSelectProcedure,
      key: "_id",
      value: "name",
    },
  ];
  return (
    <BaseContent>
      <div className="DanhSachSanPham">
        <div className="DanhSachSanPham__title">
          <span>Danh sách sản phẩm</span>
        </div>
        <div className="DanhSachSanPham__boxBtnFilter">
          <SearchBar
            onFilterChange={handleRefresh}
            dataSearch={dataSearch}
            buttonHeader={
              myPermission?.[tentrang]?.them || myPermission?.is_admin
            }
            labelButtonHeader={"Thêm sản phẩm"}
            handleBtnHeader={addProduct}
          />
        </div>
        {statusFilter && (
          <div className="filter">
            <Form layout="vertical" form={form} onFinish={finishForm}>
              <Row gutter={{ xs: 2, sm: 8, md: 8, lg: 12 }}>
                <Col className="gutter-row" xs={24} sm={8} md={8} lg={6} xl={6}>
                  <Form.Item label="Tên sản phẩm" name="name">
                    <Input placeholder="Tên sản phẩm" />
                  </Form.Item>
                </Col>
                <Col className="gutter-row" xs={24} sm={8} md={8} lg={6} xl={6}>
                  <Form.Item label="Mã lô hàng" name="parcel">
                    <Input placeholder="Mã lô hàng" />
                  </Form.Item>
                </Col>
                <Col className="gutter-row" xs={24} sm={8} md={8} lg={6} xl={6}>
                  <Form.Item name="status" label="Trạng thái">
                    <Select placeholder="Trạng thái" allowClear>
                      <Select.Option value={STATUS_PARCEL_ENDORSER.CREATING}>
                        Đang tạo
                      </Select.Option>
                      <Select.Option value={STATUS_PARCEL_ENDORSER.SENDING}>
                        Gửi thông tin cho ĐVKD
                      </Select.Option>
                      <Select.Option value={STATUS_PARCEL_ENDORSER.ENDORSING}>
                        Chờ kiểm định
                      </Select.Option>
                      <Select.Option value={STATUS_PARCEL_ENDORSER.REJECT}>
                        Từ chối kiểm định
                      </Select.Option>
                      <Select.Option value={STATUS_PARCEL_ENDORSER.ENDORSED}>
                        Hoàn tất kiểm định
                      </Select.Option>
                      <Select.Option value={STATUS_PARCEL_ENDORSER.PUBLISH}>
                        Công khai
                      </Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col className="gutter-row btn_col" span={6}>
                  <Button
                    icon={<SearchOutlined style={{ fontSize: 14 }} />}
                    type="primary"
                    htmlType="submit"
                  >
                    Tìm kiếm
                  </Button>
                  <Button
                    className="btn_clearFilter"
                    style={{
                      backgroundColor: "#FFE9D8",
                      borderColor: "#FFE9D8",
                      color: "#FF5C00",
                    }}
                    onClick={formReset}
                  >
                    Bỏ lọc
                  </Button>
                </Col>
              </Row>
            </Form>
          </div>
        )}
        <div className="DanhSachSanPham__details">
          <div className="ct_detailse">
            <img src={DangTao} />
            <span>Đang tạo</span>
          </div>
          <div className="ct_detailse">
            <img src={SendingIcon} />
            <span>Đang gửi kiểm định</span>
          </div>
          <div className="ct_detailse">
            <img src={DangKiemDinh} />
            <span>Đang kiểm định</span>
          </div>
          <div className="ct_detailse">
            <img src={TuChoiKiemDinh} />
            <span>Từ chối kiểm định</span>
          </div>
          <div className="ct_detailse">
            <img src={HoanTatKiemDinh} />
            <span>Hoàn tất kiểm định</span>
          </div>
          <div className="ct_detailse">
            <img src={CongKhai} />
            <span>Công khai</span>
          </div>
        </div>
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
              onChange={tableChange}
            />
          )}
        </div>
      </div>
    </BaseContent>
  );
}
function mapStateToProps(store) {
  const { myInfo } = store.user;

  return { myPermission: myInfo?.userPermissions };
}

export default connect(mapStateToProps)(DanhSachSanPham);
