import React from 'react';
import PropTypes from 'prop-types';
import { Button, Modal } from 'antd';
import { CONSTANT_MESSAGE } from '@constants';
import VerifyIcon from '@assets/icons/verify-icon.svg';
import './DialogConfim.scss';

DialogConfim.propTypes = {
  visible: PropTypes.bool,
  onCancel: PropTypes.func,
  onOK: PropTypes.func,
};
DialogConfim.defaultProps = {
  visible: false,
};
function DialogConfim({ visible, onCancel, onOK, title }) {
  return (
    <div className="cf-confim-container">
      <Modal visible={visible} onCancel={onCancel} footer={null}>
        <div className="cf-confim-children">
          <div className="cf-confim-icon">
            <img src={VerifyIcon} />
          </div>
          <div className="cf-confim-title">
            <span>Xác nhận {title}</span>
          </div>
          <div className="cf-confim-body">
            <span>{CONSTANT_MESSAGE.CONFIM.format(title)}</span>
          </div>
          <div className="cf-confim-btn">
            <Button className="cf-confim-btnConfim" onClick={onCancel}>
              Huỷ thao tác
            </Button>
            <Button type="primary" onClick={onOK}>
              Xác nhận
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default DialogConfim;

