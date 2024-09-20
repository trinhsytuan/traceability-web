import { formatTimeDate, toast } from '@app/common/functionCommons';
import { deleteAudit, getStepAudit } from '@app/services/NhatKyKiemDinh';
import ClockIcon from '@components/Icons/ClockIcon';
import { Button, Steps } from 'antd';
import React, { useEffect, useState } from 'react';
import FormNhatKy from './FormNhatKy';
import './NhatKyKiemDinh.scss';
import DialogDeleteConfim from '@components/DialogDeleteConfim/DialogDeleteConfim';
import { CONSTANTS, TOAST_MESSAGE } from '@constants';
import DialogConfim from '@components/DialogConfim/DialogConfim';
import { sendFeedbackAudit } from '@app/services/QLKiemDinh';

NhatKyKiemDinh.propTypes = {};

function NhatKyKiemDinh({ id, refs, showForm, edit, removeShowForm }) {
  const [isAPICall, setisAPICall] = useState(false);
  const [visibleDialog, changeVisibleDialog] = useState(false);
  const [visibleConfim, setVisibleConfim] = useState(false);
  const [dataVisible, setDataVisible] = useState(null);
  let handleReset = null;
  const showDialogChange = (data) => {
    setDataVisible(data);
    setVisibleConfim(true);
  };
  const DialogConfimClose = () => {
    setVisibleConfim(false);
    setDataVisible(null);
  };
  const onSubmitDialogConfim = async () => {
    if (dataVisible) {
      await sendFeedbackAudit(dataVisible);
      DialogConfimClose();
    }
  };

  const onChangeStep = (number) => {
    if (handleReset) {
      setShowFormData(null);
      handleReset = false;
      return;
    }
    setShowFormData(data[number]);
  };
  const handleShowDialogDelete = () => {
    changeVisibleDialog(!visibleDialog);
  };
  const onRemove = async () => {
    const response = await deleteAudit(showFormData?._id);
    if (response) {
      toast(CONSTANTS.SUCCESS, TOAST_MESSAGE.AUDIT.REMOVE);
    }
    changeVisibleDialog(false);
    callAPI();
    setShowFormData(null);
    handleReset = false;
  };
  const { Step } = Steps;
  const [data, setData] = useState([]);
  const [showFormData, setShowFormData] = useState(null);
  useEffect(() => {
    if (!showForm) {
      callAPI();
    }
  }, []);
  const callAPI = async () => {
    const response = await getStepAudit(id);
    setData(response);
    setisAPICall(true);
  };
  const handleShowForm = async () => {
    if (data.length > 0) {
      const dataAdd = { title: "Thêm mới nhật ký", createdAt: new Date(), new: true, _id: Math.random() };
      let dataOwn = [dataAdd, ...data];
      setData(dataOwn);
      setShowFormData(dataAdd);
      setisAPICall(true);
    } else if (data.length == 0) {
      const response = await getStepAudit(id);
      const dataAdd = { title: "Thêm mới nhật ký", createdAt: new Date(), new: true, _id: Math.random() };
      let dataOwn = [dataAdd, ...response];
      setData(dataOwn);
      setShowFormData(dataAdd);
      setisAPICall(true);
    }
  };
  useEffect(() => {
    if (showForm) {
      handleShowForm();
      removeShowForm(null);
    }
  }, [showForm]);

  const addNew = () => {
    const dataAdd = { title: "Thêm mới nhật ký", createdAt: new Date(), new: true, _id: Math.random() };
    let dataOwn = [dataAdd, ...data];
    setData(dataOwn);
    setShowFormData(dataAdd);
  };

  const cancelAdd = (datas) => {
    let dataOwn = data;
    var index = dataOwn.indexOf(datas);
    if (index !== -1) {
      dataOwn.splice(index, 1);
    }
    setData(dataOwn);
    setShowFormData(null);
    handleReset = true;
  };
  const closeFormData = () => {
    setShowFormData(null);
    handleReset = true;
  };
  return (
    <div>
      <Button type="hidden" ref={refs} onClick={addNew} className="btn_hidden_kd"></Button>
      {id && isAPICall && (
        <Steps current={data.length} onChange={onChangeStep} direction="vertical" className="NhatKyKiemDinh-Step">
          {data.map((datas, index) => {
            return (
              <Step
                key={index}
                title={
                  <div className="NKKD-btnAction">
                    <div>{datas?.title}</div>
                    {showFormData &&
                      showFormData._id == datas._id &&
                      edit &&
                      showFormData?._id &&
                      typeof showFormData?._id == "string" && (
                        <Button
                          className="btn-footer btn-cancel"
                          size="medium"
                          type="default"
                          onClick={handleShowDialogDelete}
                        >
                          Xoá nhật ký
                        </Button>
                      )}
                  </div>
                }
                icon={<ClockIcon />}
                description={
                  <div className="description_form">
                    <span>{formatTimeDate(datas.createdAt)}</span>
                    {showFormData && showFormData._id == datas._id && (
                      <FormNhatKy
                        dataForm={showFormData}
                        cancel={cancelAdd}
                        id={id}
                        refresh={callAPI}
                        edit={edit}
                        closeForm={closeFormData}
                        dialogConfim={showDialogChange}
                      />
                    )}
                  </div>
                }
              />
            );
          })}
        </Steps>
      )}
      <DialogDeleteConfim visible={visibleDialog} onCancel={handleShowDialogDelete} onOK={onRemove} />
      <DialogConfim
        visible={visibleConfim}
        onCancel={DialogConfimClose}
        title={"Gửi phản hồi"}
        onOK={onSubmitDialogConfim}
      />
      {data?.length == 0 && isAPICall && <div className="div_khongconhatky">Không có nhật ký kiểm định</div>}
    </div>
  );
}

export default NhatKyKiemDinh;

