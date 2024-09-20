import { EditOutlined } from '@ant-design/icons';
import { deleteOrg, getListOrg } from '@app/services/QuanLyToChuc';
import BaseContent from '@components/BaseContent';
import DeleteIcon from '@components/Icons/DeleteIcon';
import Loading from '@components/Loading';
import SearchBar from '@components/SearchBar';
import { CONSTANTS, PAGINATION_CONFIG, SELECT_ROLE_CREATE_ORG, TOAST_MESSAGE, TYPE_ORG } from '@constants';
import { Button, Table, Tooltip } from 'antd';
import queryString, { stringify } from 'query-string';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import './DanhSachToChuc.scss';
import ModalAddToChuc from './ModalAddToChuc';
import DialogDeleteConfim from '@components/DialogDeleteConfim/DialogDeleteConfim';
import { toast } from '@app/common/functionCommons';

DanhSachToChuc.propTypes = {};

function DanhSachToChuc({ isLoading, myInfo, myPermission }) {
  const history = useHistory();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [openDialog, setOpenDialog] = useState(false);
  const [dataModal, setDataModal] = useState(false);
  const [totalDocs, setTotalDocs] = useState(0);
  const [data, setData] = useState([]);
  const [dialogDelete, setDialogDelete] = useState(false);
  const [infoDelete, setInfoDelete] = useState(null);

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
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setDataModal(null);
  }
  useEffect(() => {
    handleRefresh({}, true);
  }, [page, limit]);
  useEffect(() => {
    getDataFilter();
  }, [location.search]);
  const tentrang = "danh-sach-to-chuc";
  const getDataFilter = async () => {
    const search = queryString.parse(location.search);
    let queryStr = "";
    queryStr += `${search.phone ? "&phone[like]={0}".format(search.phone) : ""}`;
    queryStr += `${search.type ? "&type={0}".format(search.type) : ""}`;
    queryStr += `${search.name ? "&name[like]={0}".format(search.name) : ""}`;
    queryStr += `${search.address ? "&address[like]={0}".format(search.address) : ""}`;
    const apiResponse = await getListOrg(page, limit, queryStr);
    if (apiResponse) {
      const dataRes = apiResponse.docs;
      setData(dataRes);

      setLimit(apiResponse.limit);
      setPage(apiResponse.page);
      setTotalDocs(apiResponse.totalDocs);
    }
  };
  const openDialogDelete = (data) => {
    setInfoDelete(data);
    setDialogDelete(true);
    
  };
  const onCancelDialog = () => {
    setDialogDelete(!dialogDelete);
  };
  const dataSearch = [
    {
      name: "name",
      label: "Tên tổ chức",
      type: "text",
      operation: "like",
    },
    {
      name: "address",
      label: "Địa chỉ",
      type: "text",
      operation: "like",
    },
    {
      name: "phone",
      label: "Số điện thoại",
      type: "text",
      operation: "like",
    },
    {
      type: "select",
      name: "type",
      label: "Loại tổ chức",
      options: SELECT_ROLE_CREATE_ORG,
      key: "value",
      value: "name",
    },
  ];
  const ColumnsDanhSachToChuc = [
    {
      title: "STT",
      dataIndex: "key",
      key: "key",
      align: "center",
      width: 50,
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
      width: 130,
      render: (_, value, index) => (
        <div key={index}>
          <span>{value.name}</span>
        </div>
      ),
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      key: "address",
      className: "titleTable",
      width: 180,
      render: (_, value, index) => <span key={index}>{value.address}</span>,
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
      className: "titleTable",
      width: 100,
      align: "center",
      render: (_, value, index) => (
        <div key={index}>
          <span>{value.phone}</span>
        </div>
      ),
    },
    {
      title: "Loại tổ chức",
      dataIndex: "type",
      key: "type",
      className: "titleTable",
      align: "center",
      width: 100,
      render: (_, value, index) => {
        let type = "Chưa xác định";
        switch (value.type) {
          case TYPE_ORG.CONSUMER:
            type = "Người tiêu dùng";
            break;
          case TYPE_ORG.ENDORSER:
            type = "Đơn vị kiểm định";
            break;
          case TYPE_ORG.PRODUCER:
            type = "Đơn vị sản xuất";
            break;
          case TYPE_ORG.SYSTEM:
            type = "Đơn vị phần mềm";
            break;
        }
        return <div key={index}>{type}</div>;
      },
    },
    {
      title: "Tác vụ",
      key: "action",
      align: "center",
      className: "titleTable",
      width: 20,
      render: (_, value, index) => (
        <div key={index} className="btn_actions">
          <div className="btn_edit_remove">
            {(myPermission?.[tentrang]?.sua || myPermission?.is_admin) && (
              <Tooltip placement="left" title={"Sửa thông tin tổ chức"} color="#FF811E">
                <Button
                  type="primary"
                  icon={<EditOutlined />}
                  style={{ borderRadius: 0 }}
                  className="btn_edit"
                  onClick={() => handleEdit(value)}
                />
              </Tooltip>
            )}
            {(myPermission?.[tentrang]?.xoa || myPermission?.is_admin) && (
              <Tooltip placement="left" title={"Xoá tổ chức"} color="#FF0000">
                <Button
                  icon={<DeleteIcon />}
                  style={{ borderRadius: 0 }}
                  className="btn_delete_tc"
                  onClick={() => openDialogDelete(value)}
                />
              </Tooltip>
            )}
          </div>
        </div>
      ),
    },
  ];
  const submitDelete = async () => {
    if (infoDelete) {
      const response = await deleteOrg(infoDelete._id);
      if (response) {
        toast(CONSTANTS.SUCCESS, TOAST_MESSAGE.ORG.DELETE);
        onCancelDialog();
        getDataFilter();
      }
    }
  };
  const addNewOrg = () => {
    setOpenDialog(true);
  };
  const tableChange = (page) => {
    setLimit(page.pageSize);
    setPage(page.current);
  };
  const handleEdit = (data) => {
    setDataModal({
      ...data,
      date: new Date(),
    });
    addNewOrg();
  };
  return (
    <>
      <BaseContent>
        <Loading active={isLoading}>
          <div className="list-organtion-container">
            <div className="title">Danh sách tổ chức</div>
            <div className="searchBar">
              <SearchBar
                onFilterChange={handleRefresh}
                dataSearch={dataSearch}
                buttonHeader={myPermission?.[tentrang]?.them || myPermission?.is_admin}
                labelButtonHeader={"Thêm tổ chức"}
                handleBtnHeader={addNewOrg}
              />
            </div>
            <div className="table-show-info">
              {data && !isLoading && (
                <Table
                  bordered
                  className="table"
                  showHeader={true}
                  columns={ColumnsDanhSachToChuc}
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
        </Loading>
      </BaseContent>
      <ModalAddToChuc
        visibled={openDialog}
        onChangeVisibled={handleCloseDialog}
        data={dataModal}
        callAPI={getDataFilter}
      />
      <DialogDeleteConfim visible={dialogDelete} onCancel={onCancelDialog} onOK={submitDelete} />
    </>
  );
}
function mapStateToProps(store) {
  const { myInfo } = store.user;
  const { isLoading } = store.app;
  return { myInfo, myPermission: myInfo?.userPermissions, isLoading };
}
export default connect(mapStateToProps)(DanhSachToChuc);






