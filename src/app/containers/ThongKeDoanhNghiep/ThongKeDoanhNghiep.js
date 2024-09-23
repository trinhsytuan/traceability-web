import { getListOrg } from "@app/services/QuanLyToChuc";
import { getAllProductByOrg } from "@app/services/ThemMoiSanPham";
import BaseContent from "@components/BaseContent";
import VisibleIcon from "@components/Icons/VisibleIcon";
import SearchBar from "@components/SearchBar";
import { PAGINATION_CONFIG } from "@constants";
import { Button, Table, Tooltip } from "antd";
import queryString, { stringify } from "query-string";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import React from "react";
import "./ThongKeDoanhNghiep.scss";
import { connect } from "react-redux";
import Loading from "@components/Loading";
import { URL } from "@url";
ThongKeDoanhNghiep.propTypes = {};

function ThongKeDoanhNghiep({ isLoading }) {
  const history = useHistory();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [allOrg, setAllOrg] = useState([]);
  const [dataSource, setData] = useState([]);
  const [totalDocs, setTotalDocs] = useState(0);
  useEffect(() => {
    getAPI();
  }, []);
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
  useEffect(() => {
    handleRefresh({}, true);
  }, [page, limit]);
  useEffect(() => {
    getDataFilter();
  }, [location.search]);
  const getDataFilter = async () => {
    const search = queryString.parse(location.search);
    let queryStr = "";
    queryStr += `${search.org ? "&org={0}".format(search.org) : ""}`;

    const apiResponse = await getAllProductByOrg(page, limit, queryStr);
    if (apiResponse) {
      const dataRes = apiResponse.docs;
      setData(dataRes);
      setLimit(apiResponse.limit);
      setPage(apiResponse.page);
      setTotalDocs(apiResponse.totalDocs);
    }
  };
  const getAPI = async () => {
    const apiResponse = await getListOrg(1, 0, "type=producer");
    if (apiResponse) {
      setAllOrg(apiResponse);
    }
  };
  const handleClickShowProduct = (values) => {
    
    history.push(URL.THONG_KE_SAN_PHAM_ID.format(values?._id));
  }
  const dataSearch = [
    {
      name: "org",
      label: "Tên doanh nghiệp",
      key: "_id",
      type: "select",
      options: allOrg,
      value: "name",
    },
  ];
  const ColumnDanhSachDoanhNghiep = [
    {
      title: "STT",
      dataIndex: "key",
      key: "key",
      align: "center",
      width: 100,
      className: "titleTable",
      render: (_, value, index) => (
        <div key={index}>
          <span>{index + 1 + (page - 1) * limit}</span>
        </div>
      ),
    },
    {
      title: "Tên tổ chức",
      dataIndex: "name",
      key: "name",
      className: "titleTable",
      render: (_, value, index) => (
        <div key={index}>
          <span>{value.name}</span>
        </div>
      ),
    },
    {
      title: "Tổng số lượng sản phẩm",
      dataIndex: "totalProduct",
      key: "totalProduct",
      className: "totalProduct",
      width: 150,
      align: "center",
      render: (_, value, index) => <span key={index}>{value?.products?.length}</span>,
    },
    {
      title: "Tác vụ",
      key: "action",
      align: "center",
      className: "titleTable",
      width: 90,
      render: (_, value, index) => (
        <div key={index} className="btn_actions">
          <div className="btn_edit_remove">
            <Tooltip placement="left" title={"Xem thông tin sản phẩm"} color="#179a6b">
              <Button type="primary" icon={<VisibleIcon />} style={{ borderRadius: 0 }} className="btn_edit" onClick={() => handleClickShowProduct(value)} />
            </Tooltip>
          </div>
        </div>
      ),
    },
  ];
  const onChangeTable = (page) => {
    setLimit(page.pageSize);
    setPage(page.current);
  };
  return (
    <BaseContent>
      <Loading active={isLoading}>
        <div className="thong-ke-doanh-nghiep-container">
          <div className="thong-ke-doanh-nghiep-header">
            <span>Thống kê doanh nghiệp</span>
          </div>
          <div className="search-bar">
            <SearchBar onFilterChange={handleRefresh} dataSearch={dataSearch} />
          </div>
          <div className="table-show-all-product">
            <Table
              size="medium"
              bordered
              columns={ColumnDanhSachDoanhNghiep}
              dataSource={dataSource}
              pagination={{
                ...PAGINATION_CONFIG,
                current: page,
                pageSize: limit,
                total: totalDocs,
              }}
              onChange={onChangeTable}
              scroll={{ x: 1000 }}
            />
          </div>
        </div>
      </Loading>
    </BaseContent>
  );
}

function mapStateToProps(store) {
  const { isLoading } = store.app;
  return { isLoading };
}
export default connect(mapStateToProps)(ThongKeDoanhNghiep);
