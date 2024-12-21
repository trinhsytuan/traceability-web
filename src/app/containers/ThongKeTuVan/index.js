import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import BaseContent from "@components/BaseContent";
import "./ThongKeTuVan.scss";
import { getAllTuVan } from "@app/services/TuVan";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import SearchBar from "@components/SearchBar";
import queryString, { stringify } from "query-string";
import { PAGINATION_MODAL } from "@constants";
import { Table } from "antd";
import { formatSTT } from "@app/common/functionCommons";
import { connect } from "react-redux";
import Loading from "@components/Loading";
ThongKeTuVan.propTypes = {};

function ThongKeTuVan({ isLoading }) {
  const [dataTuVan, setDataTuVan] = useState([]);
  const [page, setPage] = useState(1);
  const history = useHistory();
  const [limit, setLimit] = useState(10);
  const getDataFilter = async () => {
    const search = queryString.parse(location.search);
    const apiResponse = await getAllTuVan(search?.name, search?.phone, page, limit);
    if (apiResponse) {
      setDataTuVan(apiResponse);
    }
  };
  const handleRefresh = (newQuery, changeTable) => {
    const { pathname } = location;
    if (changeTable) {
      newQuery = queryString.parse(location.search);
    }
    newQuery = Object.assign({}, newQuery);
    history.push({ pathname, search: stringify({ ...newQuery }, { arrayFormat: "repeat" }) });
  };
  const dataSearch = [
    {
      name: "name",
      label: "Họ và tên",
      key: "name",
      type: "text",
      value: "name",
    },
    {
      name: "phone",
      label: "Số điện thoại",
      key: "phone",
      type: "text",
      value: "phone",
    },
  ];
  useEffect(() => {
    handleRefresh({}, true);
  }, [page, limit]);
  useEffect(() => {
    getDataFilter();
  }, [location.search]);
  const DataColums = [
    {
      title: "STT",
      render: (v1, v2, value) => formatSTT(limit, page, value),
      align: "center",
      width: 70,
    },
    { title: "Họ và tên", dataIndex: "name", key: "name" },
    {
      title: "Số điện thoại",
      key: "phone",
      dataIndex: "phone",
    },
  ];
  const onChangeTable = (page) => {
    setLimit(page.pageSize);
    setPage(page.current);
  };
  return (
    <BaseContent>
      <Loading active={isLoading}>
        <div className="thong-ke-tu-van-container">
          <span className="title">Thống kê tư vấn</span>
          <SearchBar onFilterChange={handleRefresh} dataSearch={dataSearch} />
          <Table
            bordered
            className="table"
            showHeader={true}
            columns={DataColums}
            dataSource={dataTuVan?.docs}
            scroll={{ x: 1000 }}
            pagination={{
              ...PAGINATION_MODAL,
            }}
            onChange={onChangeTable}
          />
        </div>
      </Loading>
    </BaseContent>
  );
}

function mapStatetoProps(store) {
  const { isLoading } = store.app;
  return { isLoading };
}
export default connect(mapStatetoProps)(ThongKeTuVan);
