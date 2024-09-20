import React, { useEffect, useState } from 'react';
import { formatSTT, toast } from '@app/common/functionCommons';
import { getListProcedure } from '@app/services/Manager';
import BaseContent from '@components/BaseContent';
import VisibleIcon from '@components/Icons/VisibleIcon';
import { CONSTANTS, DATA_SEARCH_PROCEDURE, PAGINATION_CONFIG } from '@constants';
import { URL } from '@url';
import { Button, Table, Tooltip } from 'antd';
import queryString, { stringify } from 'query-string';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import './DanhSachQuyTrinh.scss';
import Loading from '@components/Loading';
import PropTypes from 'prop-types';
import SearchBar from '@components/SearchBar';

DanhSachQuyTrinh.propTypes = {
  toggleLoading: PropTypes.bool,
  actions: PropTypes.object,
  dispatch: PropTypes.func,
};

function DanhSachQuyTrinh({ isLoading, myPermission }) {
  const [data, setData] = useState(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalDocs, setTotalDocs] = useState(0);
  const history = useHistory();
  const tentrang = "quan-ly-quy-trinh";

  const addProcedure = () => {
    history.push(URL.THEM_MOI_QUY_TRINH);
  };

  const ColumnsDanhSachQuyTrinh = [
    {
      title: "STT",
      dataIndex: "key",
      key: "key",
      align: "center",
      width: 65,
      className: "titleTable",
      render: (_, value, index) => formatSTT(limit, page, index),
    },
    {
      title: "Tên quy trình",
      dataIndex: "name",
      key: "name",
      className: "titleTable",
      width: 300,
    },
    {
      title: "Nội dung thực hiện",
      dataIndex: "describe",
      key: "describe",
      className: "titleTable",
    },
    {
      title: "Trạng thái",
      dataIndex: "active",
      key: "active",
      align: "center",
      className: "titleTable",
      width: 140,
      render: (_, value) => (
        <>
          {value?.active == true ? (
            <div className="dangsd">
              <span className="dangsd__span">Đang sử dụng</span>
            </div>
          ) : (
            <div className="dungsd">
              <span className="dungsd__span">Dừng sử dụng</span>
            </div>
          )}
        </>
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
          <Tooltip placement="top" title="Xem chi tiết" color="#179a6b">
            <Button
              type="primary"
              icon={<VisibleIcon />}
              style={{ borderRadius: 0 }}
              onClick={() => history.push(URL.CHI_TIET_QUY_TRINH_ID.format(value._id))}
            />
          </Tooltip>
        </>
      ),
    },
  ];
  useEffect(() => {
    const search = queryString.parse(location.search);
    const pages = parseInt(search.page ? search.page : page);
    const limits = parseInt(search.limit ? search.limit : limit);
    let queryStr = "";
    queryStr += `${search.name ? "&name[like]={0}".format(search.name) : ""}`;
    queryStr += `${search.active ? "&active={0}".format(search.active) : ""}`;

    function callAPI() {
      getListProcedure(pages, limits, queryStr)
        .then((res) => {
          setData(res.docs);
          setTotalDocs(res.total_docs);
        })
        .catch((e) => toast(CONSTANTS.ERROR, "Có lỗi khi get dữ liệu"));
    }

    callAPI();
  }, [location.search]);
  const paginationChange = (page) => {
    setLimit(page.pageSize);
    setPage(page.current);
    const { pathname } = location;
    let newQuery = queryString.parse(location.search);
    delete newQuery.page;
    delete newQuery.limit;
    newQuery = Object.assign({ limit: page.pageSize, page: page.current }, newQuery);
    history.push({
      pathname,
      search: stringify({ ...newQuery }, { arrayFormat: "repeat" }),
    });
  };
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

  const dataSearch = [
    {
      name: "name",
      label: "Tên quy trình",
      type: "text",
      operation: "like",
    },
    {
      type: "select",
      name: "active",
      label: "Trạng thái",
      options: DATA_SEARCH_PROCEDURE,
      key: "value",
      value: "name",
    },
  ];
  return (
    <BaseContent>
      <Loading active={isLoading}>
        <div className="content_qt">
          <div className="header">
            <span className="title">Danh sách quy trình</span>
            <div className="header__btnFill">
              <SearchBar
                onFilterChange={handleRefresh}
                dataSearch={dataSearch}
                buttonHeader={myPermission?.[tentrang]?.them || myPermission?.is_admin}
                labelButtonHeader={"Thêm mẫu quy trình"}
                handleBtnHeader={addProcedure}
              />
            </div>
          </div>
          <div className="table">
            {data && (
              <Table
                bordered
                showHeader={true}
                columns={ColumnsDanhSachQuyTrinh}
                dataSource={data}
                scroll={{ x: 700 }}
                pagination={{
                  ...PAGINATION_CONFIG,
                  current: page,
                  pageSize: limit,
                  total: totalDocs,
                }}
                onChange={paginationChange}
              />
            )}
          </div>
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

export default connect(mapStatetoProps)(DanhSachQuyTrinh);
