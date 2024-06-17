import React from 'react';
import { Modal } from 'antd';

EditModal.propTypes = {};

function EditModal(props) {
  return (
    <div>
      <Modal title="Xem mẫu quy trình" visible={true}>
        <div className="remove_qt">
          <span>Bạn chắc chắn muốn xoá mẫu quy trình trên chứ ?</span>
        </div>
        <div className="remove_qt_btn_remove">
          <Button type="primary" danger icon={<DeleteOutlined/>} onClick={handleOK}>
            Xoá
          </Button>
        </div>
      </Modal>
    </div>
  );
}

export default EditModal;

