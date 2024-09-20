import React from 'react';
import './ModalShowPendingComment.scss';
import { Button, Modal } from 'antd';
import VerifyIcon from '@assets/icons/verify-icon.svg';

ModalShowPendingComment.propTypes = {};

function ModalShowPendingComment({ isOpen, handleCancel }) {
  return (
    <div className="ModalShowPendingComment-container">
      <Modal visible={isOpen} onCancel={handleCancel} footer={null}>
        <div className="modal-show-pending-comment">
          <img src={VerifyIcon} />
          <span className="title">Gửi bình luận thành công</span>
          <span>
            Rất cảm ơn bạn!. Bình luận của bạn đã được tiếp nhận và đang trong thời gian xử lý xét duyệt. Chúng tôi sẽ
            gửi thông báo đến email của bạn khi bình luận được hệ thống xác nhận thông tin
          </span>
          <Button type="primary" htmlType="submit" className="btn_agree" onClick={handleCancel}>
            Đồng ý
          </Button>
        </div>
      </Modal>
    </div>
  );
}

export default ModalShowPendingComment;

