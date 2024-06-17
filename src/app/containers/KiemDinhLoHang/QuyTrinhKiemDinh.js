import { formatSTT, formatTimeDate } from "@app/common/functionCommons";
import { getLifeCycleInspection } from "@app/services/LifeCycle";
import { SettingIcon } from "@components/Icons";
import ChungNhanIcon from "@components/Icons/ChungNhanIcon";
import { BROWSING_COLOR, PAGINATION_MODAL, RESULT_SENDING, VI_STATUS_STEP } from "@constants";
import { Button, Modal, Table } from "antd";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import NhanKiemDinh from "./NhanKiemDinh";
import "./QuyTrinhKiemDinh.scss";
import ArrowLeftDown from "@components/Icons/ArrowLeftDown";
import { findByTestId } from "react-testing-library";
import PropTypes from "prop-types";
import BaseContent from "@components/BaseContent";
import VisibleIcon from "@components/Icons/VisibleIcon";
QuyTrinhKiemDinh.propTypes = {
  statusProps: PropTypes.bool,
};
QuyTrinhKiemDinh.defaultProps = {
  statusProps: true,
};
function QuyTrinhKiemDinh({ statusEndorser, myInfo, statusProps, reload, handleReload, loading }) {
  const [data, setData] = useState([]);
  const [dataClick, setDataClick] = useState(null);
  const [status, setStatus] = useState("accept");
  const [open, setOpen] = useState(false);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [res, setRes] = useState({});

  useEffect(() => {
    getAPI();
  }, [statusEndorser, reload]);
  const getAPI = async () => {
    if (statusEndorser._id) {
      const response = await getLifeCycleInspection(statusEndorser?._id);
      setData(response);
    }
  };
  const handleClick = (data, status) => {
    setDataClick(data);
    setStatus(status);
    handleModal();
    setShowModal(false);
  };
  const handleModal = () => {
    setOpen(!open);
  };
  const reloadInfo = async () => {
    const response = await getLifeCycleInspection(statusEndorser?._id);
    setData(response);
    handleReload();
  };
  const onChangeTable = (page) => {
    setLimit(page.pageSize);
    setPage(page.current);
  };
  const DataColums = [
    {
      title: "STT",
      render: (v1, v2, value) => formatSTT(limit, page, value),
      align: "center",
      width: 70,
    },
    { title: "Tên quy trình con", dataIndex: "name", key: "name", width: 300 },
    {
      title: "Người gửi",
      key: "sender",
      dataIndex: "inspections",
      align: "center",
      render: (values, row, index) => {
        const rows = values?.map((value, index) => {
          return (
            <div key={index} className="cell-row-mutil__item">
              {value?.producer?.name}
            </div>
          );
        });
        return <div className="cell-row-mutil">{rows}</div>;
      },
      width: 150,
    },
    {
      title: "Cơ quan tiếp nhận yêu cầu kiểm định",
      key: "browser",
      dataIndex: "inspections",
      align: "center",
      render: (values, row, index) => {
        const rows = values?.map((value, index) => {
          return (
            <div key={index} className="cell-row-mutil__item">
              {value?.endorser?.name}
            </div>
          );
        });
        return <div className="cell-row-mutil">{rows}</div>;
      },
      width: 300,
    },
    {
      title: "Kết quả",
      key: "result",
      dataIndex: "inspections",
      align: "center",
      render: (values, row, index) => {
        const rows = values?.map((value, index) => {
          const inspectStatus = value?.resultInspection || value?.resultReception;
          return (
            <div key={index} className="cell-row-mutil__item">
              {inspectStatus && (
                <span className={`status`} style={BROWSING_COLOR[inspectStatus]}>
                  {VI_STATUS_STEP[inspectStatus]}
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
      dataIndex: "inspections",
      className: "tacvu_kiemdinhsp",
      width: 100,
      render: (values, row, index) => {
        const rows = values?.map((value, index) => {
          return (
            <div key={index} className="cell-row-mutil__item">
              <Button
                type="primary"
                onClick={() => showModaInspectionInfo(value, row)}
                icon={<VisibleIcon />}
                style={{ borderRadius: 0 }}
              />
            </div>
          );
        });
        return <div className="cell-row-mutil">{rows}</div>;
      },
    },
  ];
  const toggleModal = () => {
    setShowModal(!showModal);
  };
  const showModaInspectionInfo = (values, row) => {
    if (values) {
      setRes({ ...values, step: { name: row?.name } });
      setShowModal(!showModal);
    }
  };

  return (
    <>
      {data?.length > 0 && (
        <BaseContent>
          <div className="history-kd">
            <div className="show-kd--title">
              <span>Quy trình kiểm định</span>
            </div>
            <div className="div_hr"></div>
            <Table
              bordered
              className="table"
              showHeader={true}
              columns={DataColums}
              dataSource={data}
              scroll={{ x: 1000 }}
              pagination={{
                ...PAGINATION_MODAL,
              }}
              onChange={onChangeTable}
            />
            <Modal
              title="Thông tin kiểm định"
              className="width-kd-qtkd"
              visible={showModal}
              forceRender={true}
              onCancel={loading ? () => null : toggleModal}
              footer={null}
            >
              <div className="history-kd">
                <div className="history-kd__content">
                  <div>
                    <div className="history-kd-map">
                      <div className="history-kd-left">
                        <SettingIcon />
                      </div>
                      <div className="history-kd-right">
                        <span className="history-kd-right-title">Yêu cầu kiểm định</span>
                        <div className="history-kd-right-title-content">
                          <span>Người gửi: {res?.producer?.name}</span>
                          <span>Cơ quan tiếp nhận yêu cầu kiểm định: {res?.endorser?.name}</span>
                          <span>Nội dung kiểm định: {res?.step?.name}</span>
                          <span>Thời gian gửi kiểm định: {formatTimeDate(res?.timeRequest)}</span>
                          {myInfo.userPermissions.is_admin == true && !res.resultReception && statusProps && (
                            <div className="btn_action_nhankd">
                              <Button className="btn_nhan" onClick={() => handleClick(res, "accept")}>
                                Chấp nhận kiểm định
                              </Button>
                              <Button className="btn_tuchoi" onClick={() => handleClick(res, "decline")}>
                                Từ chối kiểm định
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    {res.resultReception && (
                      <div className="history-kd-map">
                        <div className="history-kd-left">
                          <ArrowLeftDown />
                        </div>
                        <div className="history-kd-right">
                          <span className="history-kd-right-title">Kết quả tiếp nhận kiểm định</span>
                          <div className="history-kd-right-title-content">
                            <span>
                              Kết quả: {" "}
                              {res.resultReception == RESULT_SENDING.RECEIVED
                                ? "Đã xác nhận tiếp nhận kiểm định"
                                : "Yêu cầu kiểm định đã bị từ chối"}
                            </span>
                            {res.resultReception == RESULT_SENDING.DENIED && (
                              <span>Lý do từ chối: {res.descriptionResponseReception}</span>
                            )}
                            <span>Thời gian xác nhận: {formatTimeDate(res.timeResponseReception)}</span>
                          </div>
                        </div>
                      </div>
                    )}
                    {res.resultInspection && (
                      <div className="history-kd-map">
                        <div className="history-kd-left">
                          <ChungNhanIcon />
                        </div>
                        <div className="history-kd-right">
                          <span className="history-kd-right-title">Kết quả kiểm định</span>
                          <div className="history-kd-right-title-content">
                            <span>
                              Kết quả:{" "}
                              {res.resultInspection == RESULT_SENDING.ENDORSED
                                ? "Thông tin kiểm định đã được xác nhận là hợp lệ"
                                : "Thông tin kiểm định không hợp lệ"}
                            </span>

                            {res.resultInspection == RESULT_SENDING.REJECT && (
                              <span>Lý do từ chối: {res.descriptionResponseInspection}</span>
                            )}
                            <span>
                              Thời gian xác nhận thông tin kiểm định: {formatTimeDate(res.timeResponseInspection)}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Modal>{" "}
            <NhanKiemDinh
              dataParcel={statusEndorser}
              dataStep={dataClick}
              visible={open}
              onChange={handleModal}
              status={status}
              reload={reloadInfo}
            />
          </div>
        </BaseContent>
      )}
    </>
  );
}
function mapStatetoProps(store) {
  const { myInfo } = store.user;
  const { isLoading } = store.app;

  return { myInfo, loading: isLoading };
}
export default connect(mapStatetoProps)(QuyTrinhKiemDinh);

