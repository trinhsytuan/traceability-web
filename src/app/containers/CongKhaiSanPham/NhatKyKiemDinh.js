import React, { useEffect, useState } from 'react';
import { Modal } from 'antd';
import { formatDate } from '@app/common/functionCommons';
import './NhatKyKiemDinh.scss';
import UploadImage from '@components/UploadImage/UploadImage';

NhatKyKiemDinhTruyXuat.propTypes = {};

function NhatKyKiemDinhTruyXuat({ idParcel, onVisible, handleVisible }) {
  const [dataStep, setDataStep] = useState([]);
  const callAPI = async () => {
    if (idParcel) {
      
      setDataStep(idParcel);
    }
  };
  useEffect(() => {
    callAPI();
  }, [idParcel]);
  return (
    <div>
      <Modal
        title="Xem chi tiết nhật ký kiểm định"
        footer={null}
        width={700}
        visible={onVisible}
        onCancel={handleVisible}
      >
        <span className="title-nkkd-preview">
          Thông tin nhật ký kiểm định của bước {idParcel?.name}
        </span>
        {dataStep && !dataStep?.auditHistory && (
          <div className="NKKD-Preview-Map">
            <span>Chưa có nhật ký kiểm định cho bước {idParcel?.name}</span>
          </div>
        )}
        {dataStep?.auditHistory?.map((res, index) => {
          return (
            <div className="NKKD-Preview-Map" key={index}>
              <div className="title-nkkd">
                Thông tin nhật ký kiểm định thứ {index + 1}:
              </div>
              <div className="content-nkkd">
                <span className="title">Tiêu đề: </span>
                <span>{res?.title}</span>
              </div>
              {res?.timeStart && (
                <div className="content-nkkd">
                  <span className="title">Ngày bắt đầu: </span>
                  <span>{formatDate(res?.timeStart)}</span>
                </div>
              )}
              {res?.timeEnd && (
                <div className="content-nkkd">
                  <span className="title">Ngày kết thúc: </span>
                  <span>{formatDate(res?.timeEnd)}</span>
                </div>
              )}
              <div className="content-nkkd">
                <span className="title">Miêu tả: </span>
                <span>{res?.description}</span>
              </div>
              {res?.medias && (
                <div className="content-nkkd">
                  <span className="title">Hình ảnh: </span>
                  <div className="img_ha">
                    <UploadImage data={res?.medias} disabled={true} />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </Modal>
    </div>
  );
}

export default NhatKyKiemDinhTruyXuat;
