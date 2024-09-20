import React, { useEffect, useState } from 'react';
import './DanhSachBinhLuan.scss';
import { connect } from 'react-redux';
import BaseContent from '@components/BaseContent';
import Loading from '@components/Loading';
import { Button, Form, Table } from 'antd';
import SearchBar from '@components/SearchBar';
import queryString, { stringify } from 'query-string';
import { PAGINATION_CONFIG, STATUS_COMMENT, STATUS_COMMENT_SELECT } from '@constants';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { getTableComment } from '@app/services/BinhLuanSanPham';
import VisibleIcon from '@components/Icons/VisibleIcon';
import { formatTimeDate } from '@app/common/functionCommons';
import { URL } from '@url';

DanhSachBinhLuan.propTypes = {};

function DanhSachBinhLuan({ isLoading }) {
  const history = useHistory();
  const [form] = Form.useForm();
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [data, setData] = useState([]);
  const [totalDocs, setTotalDocs] = useState(0);
  useEffect(() => {
    handleRefresh({}, true);
  }, [page, limit]);
  useEffect(() => {
    getDataFilter();
  }, [location.search]);
  const getDataFilter = async () => {
    const search = queryString.parse(location.search);
    let queryStr = "";
    queryStr += `${search.username ? "&username[like]={0}".format(search.username) : ""}`;
    queryStr += `${search.product_name ? "&product_name[like]={0}".format(search.product_name) : ""}`;
    queryStr += `${search.parcel_name ? "&parcel_name[like]={0}".format(search.parcel_name) : ""}`;
    queryStr += `${search.status ? "&status={0}".format(search.status) : ""}`;
    const apiResponse = await getTableComment(page, limit, queryStr);
    if (apiResponse) {
      const dataRes = apiResponse.docs;
      setData(dataRes);
      setLimit(apiResponse.limit);
      setPage(apiResponse.page);
      setTotalDocs(apiResponse.totalDocs);
    }
  };
  const tableChange = (page) => {
    setLimit(page.pageSize);
    setPage(page.current);
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
    history.push({ pathname, search: stringify({ ...newQuery }, { arrayFormat: "repeat" }) });
  };
  const handleRedirectDetails = (data) => {
    if (data.parcel && Array.isArray(data.parcel)) {
      history.push(URL.CHI_TIET_BINH_LUAN_ID.format(data.parcel[0]._id));
    } else if (data.parcel) {
      history.push(URL.CHI_TIET_BINH_LUAN_ID.format(data.parcel._id));
    }
  };

  const dataSearch = [
    {
      name: "username",
      label: "Tên tài khoản",
      type: "text",
      operation: "like",
    },
    {
      name: "product_name",
      label: "Tên sản phẩm",
      type: "text",
      operation: "like",
    },
    {
      name: "parcel_name",
      label: "Mã lô hàng",
      type: "text",
      operation: "like",
    },
    {
      type: "select",
      name: "status",
      label: "Trạng thái",
      options: STATUS_COMMENT_SELECT,
      key: "value",
      value: "name",
    },
  ];
  const ColumnsDanhSachBinhLuan = [
    {
      title: "STT",
      dataIndex: "key",
      key: "key",
      align: "center",
      width: 65,
      className: "titleTable",
      render: (_, value, index) => (
        <div key={index}>
          <span>{index + 1 + (page - 1) * limit}</span>
        </div>
      ),
    },
    {
      title: "Tên tài khoản",
      dataIndex: "content",
      key: "content",
      align: "center",
      className: "titleTable",
      width: 130,
      render: (_, value, index) => (
        <div key={index}>
          {Array.isArray(value?.user) ? <span>{value?.user[0]?.username}</span> : <span>{value?.user?.username}</span>}
        </div>
      ),
    },
    {
      title: "Thời gian",
      dataIndex: "create_at",
      key: "create_at",
      className: "titleTable",
      width: 180,
      align: "center",
      render: (_, value, index) => <span key={index}>{formatTimeDate(value?.created_at)}</span>,
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "name_product",
      key: "name_product",
      className: "titleTable",
      width: 150,
      align: "center",
      render: (_, value, index) => (
        <div key={index}>
          {Array.isArray(value?.product) ? <span>{value?.product[0]?.name}</span> : <span>{value?.product?.name}</span>}
        </div>
      ),
    },
    {
      title: "Mã lô hàng",
      dataIndex: "procedure",
      key: "procedure",
      className: "titleTable",
      align: "center",
      width: 130,
      render: (_, value, index) => (
        <div key={index}>
          {Array.isArray(value?.parcel) ? <span>{value?.parcel[0]?.name}</span> : <span>{value?.parcel?.name}</span>}
        </div>
      ),
    },
    {
      title: "Nội dung bình luận",
      dataIndex: "content",
      key: "content",
      className: "titleTable",
      render: (_, value, index) => (
        <div className="commentRow" key={index}>
          <span className="long-content">{value.content}</span>
        </div>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "active",
      key: "active",
      align: "center",
      className: "titleTable",
      width: 120,
      render: (_, value, index) => (
        <div key={index}>
          {value?.status == STATUS_COMMENT.PENDING && (
            <div className="choduyet">
              <span className="choduyet__span">Chờ duyệt</span>
            </div>
          )}
          {value?.status == STATUS_COMMENT.ACCEPTED && (
            <div className="chapnhan">
              <span>Đã duyệt</span>
            </div>
          )}
          {value?.status == STATUS_COMMENT.DENIED && (
            <div className="tuchoi">
              <span>Từ chối</span>
            </div>
          )}
        </div>
      ),
    },
    {
      title: "Tác vụ",
      key: "action",
      align: "center",
      className: "titleTable",
      width: 80,
      render: (_, value, index) => (
        <div key={index}>
          <Button
            type="primary"
            icon={<VisibleIcon />}
            style={{ borderRadius: 0 }}
            onClick={() => handleRedirectDetails(value)}
          />
        </div>
      ),
    },
  ];
  return (
    <BaseContent>
      <Loading active={isLoading}>
        <div className="list-comment-container">
          <div className="title-class">
            <span>Danh sách bình luận</span>
          </div>
          <div className="filter">
            <div className="filter-content">
              <div className="filter">
                <SearchBar onFilterChange={handleRefresh} dataSearch={dataSearch} buttonHeader={false} />
              </div>
            </div>
          </div>
          <div className="table_comment">
            {data && !isLoading && (
              <Table
                bordered
                className="table"
                showHeader={true}
                columns={ColumnsDanhSachBinhLuan}
                dataSource={data}
                scroll={{ x: 1000 }}
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
      </Loading>
    </BaseContent>
  );
}
function mapStateToProps(store) {
  const { isLoading } = store.app;
  return { isLoading };
}
export default connect(mapStateToProps)(DanhSachBinhLuan);

