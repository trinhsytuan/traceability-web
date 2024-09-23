import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Button, Modal, Table, Tooltip } from "antd";
import { getAllParcelById } from "@app/services/TruyXuat";
import VisibleIcon from "@components/Icons/VisibleIcon";
import { formatDate } from "@app/common/functionCommons";
import { VI_STATUS_PARCEL } from "@constants";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { URL } from "@url";

ModalThongKeLoHang.propTypes = {};

function ModalThongKeLoHang({ isLoading, onVisible, handleClose }) {
  const [data, setData] = useState([]);
  const history = useHistory();
  useEffect(() => {
    if (Boolean(onVisible)) {
      getAPI();
    }
  }, [onVisible]);
  const getAPI = async () => {
    const apiResponse = await getAllParcelById(onVisible?._id);
    if (apiResponse) {
      setData(apiResponse);
    }
  };
  const ColumnDanhSachLoHang = [
    {
      title: "STT",
      dataIndex: "key",
      key: "key",
      align: "center",
      width: 50,
      className: "titleTable",
      render: (_, value, index) => (
        <div key={index}>
          <span>{index + 1}</span>
        </div>
      ),
    },
    {
      title: "Mã lô hàng",
      dataIndex: "name",
      key: "name",
      width: 100,
      className: "titleTable",
      align: "center",
    },
    {
      title: "Ngày sản xuất",
      dataIndex: "nsx",
      key: "nsx",
      className: "nsx",
      width: 150,
      align: "center",
      render: (_, value, index) => <span key={index}>{formatDate(value?.nsx)}</span>,
    },
    {
      title: "Trạng thái",
      dataIndex: "statusEndorser",
      key: "statusEndorser",
      className: "statusEndorser",
      width: 150,
      align: "center",
      render: (_, value, index) => <span key={index}>{VI_STATUS_PARCEL[value?.statusEndorser?.toUpperCase()]}</span>,
    },
    {
      title: "Tác vụ",
      key: "action",
      align: "center",
      className: "titleTable",
      width: 100,
      render: (_, value, index) => (
        <div key={index} className="btn_actions">
          <div className="btn_edit_remove">
            <Tooltip placement="left" title={"Tra cứu thông tin lô hàng"} color="#179a6b">
              <Button type="primary" icon={<VisibleIcon />} style={{ borderRadius: 0 }} className="btn_edit" onClick={() => handleClickTruyXuat(value)} />
            </Tooltip>
          </div>
        </div>
      ),
    },
  ];

  const handleClickTruyXuat = (data) => {
    history.replace(`${URL.TRUY_XUAT_SAN_PHAM}?code=${data?.name}`)
  }
  return (
    <Modal
      visible={Boolean(onVisible)}
      onCancel={handleClose}
      footer={null}
      title={`Thống kê lô hàng của sản phẩm: ${onVisible?.name}`}
      width={1200}
    >
      <div className="table-show-all-product">
        <Table
          size="medium"
          bordered
          columns={ColumnDanhSachLoHang}
          dataSource={data}
          pagination={false}
          scroll={{ x: 1000 }}
        />
      </div>
    </Modal>
  );
}

function mapStateToProps(store) {
  const { isLoading } = store.app;
  return { isLoading };
}
export default connect(mapStateToProps)(ModalThongKeLoHang);
