import { getProductByOrg } from "@app/services/ThemMoiSanPham";
import BaseContent from "@components/BaseContent";
import VisibleIcon from "@components/Icons/VisibleIcon";
import Loading from "@components/Loading";
import { Button, Table, Tooltip } from "antd";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useHistory, useParams } from "react-router-dom/cjs/react-router-dom.min";
import "./ThongKeSanPham.scss";
import React from "react";
import queryString, { stringify } from "query-string";
import SearchBar from "@components/SearchBar";
import ModalThongKeLoHang from "./ModalThongKeLoHang";
ThongKeSanPham.propTypes = {};

function ThongKeSanPham({ isLoading }) {
  const { id } = useParams();
  const history = useHistory();
  const [dataSource, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const onOpenModal = (data) => {
    setShowModal(data);
  };
  const onCloseModal = () => {
    setShowModal(false);
  };
  const dataSearch = [
    {
      name: "product",
      label: "Tên sản phẩm",
      key: "_id",
      type: "select",
      options: dataSource,
      value: "name",
    },
  ];
  useEffect(() => {
    getDataFilter();
  }, [location.search]);
  const getDataFilter = async () => {
    const search = queryString.parse(location.search);
    let queryStr = "";
    queryStr += `${search.product ? "&_id={0}".format(search.product) : ""}`;
    queryStr += `&org={0}`.format(id);
    const apiResponse = await getProductByOrg(1, 0, queryStr);
    if (apiResponse) {
      setData(apiResponse);
    }
  };
  const ColumnDanhSachSanPham = [
    {
      title: "STT",
      dataIndex: "key",
      key: "key",
      align: "center",
      width: 90,
      className: "titleTable",
      render: (_, value, index) => (
        <div key={index}>
          <span>{index + 1}</span>
        </div>
      ),
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "name",
      key: "name",
      className: "titleTable",
    },
    {
      title: "Quy trình",
      dataIndex: "procedure",
      key: "procedure",
      className: "procedure",
      width: 250,
      align: "center",
      render: (_, value, index) => <span key={index}>{value?.procedure?.name}</span>,
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
            <Tooltip placement="left" title={"Xem thông tin lô hàng"} color="#179a6b">
              <Button
                type="primary"
                onClick={() => onOpenModal(value)}
                icon={<VisibleIcon />}
                style={{ borderRadius: 0 }}
                className="btn_edit"
              />
            </Tooltip>
          </div>
        </div>
      ),
    },
  ];
  const handleRefresh = (newQuery, changeTable) => {
    const { pathname } = location;
    if (changeTable) {
      newQuery = queryString.parse(location.search);
    }
    newQuery = Object.assign({}, newQuery);
    history.push({ pathname, search: stringify({ ...newQuery }, { arrayFormat: "repeat" }) });
  };
  return (
    <>
      <BaseContent>
        <Loading active={isLoading}>
          <div className="thong-ke-lo-hang-container">
            <div className="thong-ke-lo-hang-header">
              <span>Thống kê sản phẩm của tổ chức</span>
            </div>
            <div className="thong-ke-lo-hang-search-bar">
              <SearchBar onFilterChange={handleRefresh} dataSearch={dataSearch} />
            </div>
            <div className="table-show-all-product">
              <Table
                size="medium"
                bordered
                columns={ColumnDanhSachSanPham}
                dataSource={dataSource}
                pagination={false}
                scroll={{ x: 1000 }}
              />
            </div>
          </div>
        </Loading>
      </BaseContent>
      <ModalThongKeLoHang onVisible={showModal} handleClose={onCloseModal} />
    </>
  );
}

function mapStateToProps(store) {
  const { isLoading } = store.app;
  return { isLoading };
}

export default connect(mapStateToProps)(ThongKeSanPham);
