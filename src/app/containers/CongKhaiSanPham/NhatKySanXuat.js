import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Modal } from "antd";
import { getAllHistoryByStep } from "@app/services/GhiNhatKySX";
import { formatDate } from "@app/common/functionCommons";
import "./NhatKySanXuat.scss";
import UploadImage from "@components/UploadImage/UploadImage";
NhatKySanXuatTruyXuat.propTypes = {};

function NhatKySanXuatTruyXuat({ idParcel, onVisible, handleVisible }) {
  const [dataStep, setDataStep] = useState([]);
  const [isOK, setIsOK] = useState(false);
  const callAPI = async () => {
    if (idParcel) {
      const response = await getAllHistoryByStep(idParcel?._id);
      setDataStep(response);
      setIsOK(true);
    }
  };
  useEffect(() => {
    callAPI();
  }, [idParcel]);
  return (
    <div>
      <Modal
        title="Xem chi tiết nhật ký sản xuất"
        footer={null}
        width={700}
        visible={onVisible}
        onCancel={handleVisible}
      >
        <span className="title-nkkd-preview">
          Thông tin nhật ký sản xuất của bước {idParcel?.name}
        </span>
        {dataStep && isOK && dataStep.length == 0 && (
          <div className="NKKD-Preview-Map">
            <span>Chưa có nhật ký sản xuất cho bước</span>
          </div>
        )}
        {dataStep.map((res, index) => {
          return (
            <div className="NKKD-Preview-Map" key={index}>
              <div className="title-nkkd">
                Thông tin nhật ký sản xuất thứ {index + 1}:
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

export default NhatKySanXuatTruyXuat;
