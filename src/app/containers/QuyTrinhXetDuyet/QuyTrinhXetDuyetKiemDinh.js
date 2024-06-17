import React, { useEffect, useState } from 'react';
import './QuyTrinhXetDuyet.scss';
import { getLifeCycleParcelEndorser } from '@app/services/LifeCycle';
import { SettingIcon } from '@components/Icons';
import { Button, Modal, Table } from 'antd';
import ChungNhanIcon from '@components/Icons/ChungNhanIcon';
import { BROWSING_COLOR, CONSTANTS, PAGINATION_MODAL, RESULT_SENDING, TOAST_MESSAGE, VI_STATUS_STEP } from '@constants';
import { formatSTT, formatTimeDate, toast } from '@app/common/functionCommons';
import DialogXetDuyet from './DialogXetDuyet';
import { connect } from 'react-redux';
import BaseContent from '@components/BaseContent';
import VisibleIcon from '@components/Icons/VisibleIcon';
import DialogConfim from '@components/DialogConfim/DialogConfim';
import { changeStatusHistory } from '@app/services/NhatKyKiemDinh';

QuyTrinhXetDuyetKiemDinh.propTypes = {};

function QuyTrinhXetDuyetKiemDinh({ idParcel, statusEndorser, myInfo, update, handleUpdate, setHotReload, loading }) {
  const [visibleDialog, changeVisibleDialog] = useState(false);
  const [status, changeStatus] = useState('accept');
  const [dataDialog, setDataDialog] = useState(null);
  const [data, setData] = useState([]);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [res, setRes] = useState({});
  const [tempAccept, setTempAccept] = useState();
  const [dialogConfim, setDialogConfim] = useState(false);
  let tentrang = 'kiem-dinh-san-pham';
  useEffect(() => {
    getLifeCycleParcelEndorser(idParcel).then((res) => setData(res));
  }, [handleUpdate]);
  const onChangeDialog = () => {
    changeVisibleDialog(!visibleDialog);
  };
  const handleClick = (status, data) => {
    changeStatus(status);
    setDataDialog(data);
    onChangeDialog();
    setShowModal(false);
  };
  const reloadPage = (status) => {
    update(status);
    setHotReload(new Date());
  };
  const DataColums = [
    {
      title: 'STT',
      render: (v1, v2, value) => formatSTT(limit, page, value),
      align: 'center',
      width: 70,
    },
    { title: 'Tên quy trình con', dataIndex: 'name', key: 'name', width: 300 },
    {
      title: 'Người gửi',
      key: 'sender',
      dataIndex: 'divisons',
      align: 'center',
      render: (values, row, index) => {
        const rows = values?.map((value, index) => {
          return (
            <div key={index} className="cell-row-mutil__item">
              {value?.assignee?.username}
            </div>
          );
        });
        return <div className="cell-row-mutil">{rows}</div>;
      },
      width: 150,
    },
    {
      title: 'Tài khoản duyệt',
      key: 'browser',
      dataIndex: 'divisons',
      align: 'center',
      render: (values, row, index) => {
        const rows = values?.map((value, index) => {
          return (
            <div key={index} className="cell-row-mutil__item">
              {value?.manager?.username}
            </div>
          );
        });
        return <div className="cell-row-mutil">{rows}</div>;
      },
      width: 150,
    },
    {
      title: 'Kết quả duyệt',
      key: 'result',
      dataIndex: 'divisons',
      align: 'center',
      render: (values, row, index) => {
        const rows = values?.map((value, index) => {
          return (
            <div key={index} className="cell-row-mutil__item">
              {value?.result && (
                <span className={`status`} style={BROWSING_COLOR[value?.result]}>
                  {VI_STATUS_STEP[value?.result]}
                </span>
              )}
            </div>
          );
        });
        return <div className="cell-row-mutil">{rows}</div>;
      },
      width: 150,
    },
    {
      title: 'Tác vụ',
      key: 'action',
      align: 'center',
      dataIndex: 'divisons',
      className: 'tacvu_kiemdinhsp',
      width: 100,
      render: (values, row, index) => {
        const rows = values?.map((value, index) => {
          return (
            <div key={index} className="cell-row-mutil__item">
              <Button
                type="primary"
                onClick={() => showModalBrowserInfo(value, row)}
                icon={<VisibleIcon/>}
                style={{ borderRadius: 0 }}
              />
            </div>
          );
        });
        return <div className="cell-row-mutil">{rows}</div>;
      },
    },
  ];
  const onChangeTable = (page) => {
    setLimit(page.pageSize);
    setPage(page.current);
  };
  const showModalBrowserInfo = (values, row) => {
    if (values) {
      setRes({ ...values, step: { name: row?.name } });
      setShowModal(!showModal);
    }
  };
  const toggleModal = () => {
    setShowModal(!showModal);
  };
  const showDialogConfim = (data) => {
    setTempAccept(data);
    setDialogConfim(true);
  };
  const onCancelDialogConfim = () => {
    setTempAccept(null);
    setDialogConfim(false);
  };
  const onSubmitDialogConfim = async () => {
    if (tempAccept) {
      const response = await changeStatusHistory(tempAccept.id, tempAccept);
      if (response) {
        toast(CONSTANTS.SUCCESS, TOAST_MESSAGE.SUCCESS.DEFAULT);
        onCancelDialogConfim();
        setHotReload(new Date());
      }
    }
  };
  return (
    <>
      {data?.length > 0 && (
        <BaseContent>
          <div className="QuyTrinhXetDuyet">
            <div className="title_qtxd">
              Quy trình xét duyệt
              <div className="div_hr"></div>
            </div>
            <div style={{ marginTop: '15px' }}>
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
            </div>
            <Modal
              title="Thông tin xét duyệt"
              className="width-kd-qtkd"
              visible={showModal}
              forceRender={true}
              onCancel={loading ? () => null : toggleModal}
              footer={null}
            >
              <div className="QuyTrinhXetDuyet">
                <div className="QuyTrinhXetDuyet-content">
                  <div className="QuyTrinhXetDuyet-map">
                    <div className="QuyTrinhXetDuyet-contentIn">
                      <div className="QuyTrinhXetDuyet-title">
                        <SettingIcon></SettingIcon>
                      </div>
                      <div className="QuyTrinhXetDuyet-mapCT">
                        <span className="title_gkd">Yêu cầu xét duyệt</span>
                        <span>Người gửi: {res?.assignee?.username}</span>
                        <span>Tài khoản xét duyệt: {res.manager?.username}</span>
                        <span>Nội dung xét duyệt: {res?.step?.name}</span>
                        {!res.result &&
                          res?.manager?._id == myInfo?._id &&
                          (myInfo.userPermissions?.[tentrang]?.duyet || myInfo.userPermissions?.is_admin) && (
                            <div className="btn_acceptreject">
                              <Button
                                className="btn_reject"
                                onClick={() => {
                                  handleClick('accept', res);
                                }}
                              >
                                Chấp nhận duyệt
                              </Button>
                              <Button
                                className="btn_accept"
                                onClick={() => {
                                  handleClick('decline', res);
                                }}
                              >
                                Từ chối duyệt
                              </Button>
                            </div>
                          )}
                      </div>
                    </div>
                    {res.result && (
                      <>
                        <div className="QuyTrinhXetDuyet-contentIn chungNhan">
                          <div className="QuyTrinhXetDuyet-title">
                            <ChungNhanIcon></ChungNhanIcon>
                          </div>
                          <div className="QuyTrinhXetDuyet-mapCT">
                            <span className="title_gkd">Kết quả xét duyệt</span>
                            <span>
                              Kết quả xét duyệt:{' '}
                              {res?.result == RESULT_SENDING.ACCEPTED ? (
                                <span>Yêu cầu xét duyệt đã được chấp nhận </span>
                              ) : (
                                <span>Yêu cầu xét duyệt đã bị từ chối</span>
                              )}
                            </span>
                            {res?.result == RESULT_SENDING.DENIED && (
                              <span>Lý do từ chối: {res.descriptionResponse}</span>
                            )}
                            <span>Thời điểm xét duyệt: {formatTimeDate(res.timeResponse)}</span>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </Modal>
            <DialogXetDuyet
              dataStep={dataDialog}
              dataParcel={statusEndorser}
              visible={visibleDialog}
              onChange={onChangeDialog}
              status={status}
              reload={reloadPage}
              onConfim={showDialogConfim}
            />
            <DialogConfim
              visible={dialogConfim}
              onCancel={onCancelDialogConfim}
              onOK={onSubmitDialogConfim}
              title={'kết quả gửi duyệt'}
            />
          </div>
        </BaseContent>
      )}
    </>
  );
}

function mapStateToProps(store) {
  const { myInfo } = store.user;
  const { isLoading } = store.app;
  return { myInfo, loading: isLoading };
}

export default connect(mapStateToProps)(QuyTrinhXetDuyetKiemDinh);
