import React from 'react';
import PropTypes from 'prop-types';
import { Button, Modal } from 'antd';
import './DeleteConfim.scss';
import { RemoveProcedureByID } from '@app/services/MauQuyTrinh';
import { toast } from '@app/common/functionCommons';
import { CONSTANTS, TOAST_MESSAGE } from '@constants';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { URL } from '@url';
import DeleteIcon from '@components/Icons/DeleteIcon';

DeleteConfim.propTypes = {
  id: PropTypes.string,
  handleClose: PropTypes.func,
  handleOK: PropTypes.func,
};

function DeleteConfim({ id, handleClose, isOpen }) {
  const history = useHistory();
  const handleOK = () => {
    RemoveProcedureByID(id)
      .then((res) => {
        toast(CONSTANTS.SUCCESS, 'Xoá quy trình thành công');
        handleCancel();
        history.push(URL.MENU.QUY_TRINH);
      })
      .catch(() => {
        toast(CONSTANTS.ERROR, TOAST_MESSAGE.ERROR);
        history.goBack();
      });
  };
  const handleCancel = () => {
    handleClose(false);
  };
  return (
    <div>
      <Modal title="Xoá mẫu quy trình" visible={isOpen} onOk={handleOK} onCancel={handleCancel} footer={null} enable>
        <div className="remove_qt">
          <span>Bạn chắc chắn muốn xoá mẫu quy trình trên chứ ?</span>
        </div>
        <div className="remove_qt_btn_remove">
          <Button className="btn_delete" icon={<DeleteIcon/>} onClick={handleOK}>
            Xoá
          </Button>
        </div>
      </Modal>
    </div>
  );
}

export default DeleteConfim;


