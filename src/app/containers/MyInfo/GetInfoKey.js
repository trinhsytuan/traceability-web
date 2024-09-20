import React, { useEffect, useState } from 'react';
import CreateKey from './CreateKey';
import { deleteKey, getKey } from '@app/services/TaoKhoa';
import SecurityIcon from '@assets/icons/security-icon.svg';
import './GetInfoKey.scss';
import { formatTimeDateStrike, toast } from '@app/common/functionCommons';
import { Button, Modal } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { CONSTANTS, TOAST_MESSAGE } from '@constants';
import { connect } from 'react-redux';
import Loading from '@app/components/Loading';
import EditTitleKey from './EditTitleKey';
import DeleteIcon from '@components/Icons/DeleteIcon';
import DeleteIcons from '@assets/icons/delete-icon.svg';

GetInfoKey.propTypes = {};

function GetInfoKey({ isLoading }) {
  const [data, setData] = useState(null);
  const [updateInfo, setUpdateInfo] = useState(null);
  const [handleOpen, setHandleOpen] = useState(false);
  const [visibleEdit, setVE] = useState(false);
  useEffect(() => {
    getKey().then((res) => {
      if (res.existKey != false) setData(res);
      else setData(null);
    });
  }, [updateInfo]);
  const setVisibleEdit = () => {
    setVE(!visibleEdit);
    setUpdateInfo(new Date());
  };
  const openModal = () => {
    setHandleOpen(!handleOpen);
  };
  const handleDeleteKey = () => {
    const response = deleteKey();
    if (response) {
      toast(CONSTANTS.SUCCESS, TOAST_MESSAGE.SUCCESS.DEFAULT);
    }
    setUpdateInfo(new Date());
    setHandleOpen(false);
  };
  return (
    <div>
      <Loading active={isLoading}>
        {data ? (
          <div className="setting_pki">
            <div className="setting_pki__title">
              <span>Cài đặt chữ ký số</span>
            </div>
            <div className="setting_pki__content">
              <div className="setting_pki__left">
                <div className="setting_pki__img">
                  <img src={SecurityIcon} />
                </div>
                <div className="setting_pki__divContent">
                  <div className="setting_pki__titleName">
                    <span>{data.pki.title}</span>
                  </div>
                  <div className="setting_pki__chuky">
                    <span>Khoá công khai: {data.pki.hashPublickey}</span>
                  </div>
                  <span>Thời gian tạo: {formatTimeDateStrike(data.pki.createdAt)}</span>
                </div>
              </div>
              <div className="setting_pki__right">
                <Button icon={<EditOutlined />} className="setting_pki__btnEdit" onClick={setVisibleEdit}>
                  Sửa
                </Button>

                <Button icon={<DeleteIcon />} className="setting_pki__btnDelete" onClick={openModal}>
                  Xoá
                </Button>
              </div>
            </div>
            <Modal visible={handleOpen} onCancel={openModal} footer={null} width={608}>
              <div className="content_modal_delete">
                <div className="content_modal__dlt">
                  <div className="content_modal_icon">
                    <img src={DeleteIcons} />
                  </div>
                  <div className="content_modal_delete__title">
                    <span>Xác nhận xoá</span>
                  </div>
                  <div className="content_modal_delete__body">
                    <span>
                      Nếu bạn xác nhận xoá thì thông tin về chữ ký điện tử sẽ không còn trong hệ thống. Bạn có chắc chắn
                      muốn xoá chữ ký này?
                    </span>
                  </div>
                  <div className="content_modal_delete__btn">
                    <Button className="content_modal_delete__btnConfim" onClick={handleDeleteKey}>
                      Xoá
                    </Button>
                  </div>
                </div>
              </div>
            </Modal>
          </div>
        ) : (
          <CreateKey update={setUpdateInfo} />
        )}
        <EditTitleKey visibleEdit={visibleEdit} setVisibleEdit={setVisibleEdit}></EditTitleKey>
      </Loading>
    </div>
  );
}
function mapStateToProps(store) {
  const { isLoading } = store.app;
  return { isLoading };
}
export default connect(mapStateToProps)(GetInfoKey);


