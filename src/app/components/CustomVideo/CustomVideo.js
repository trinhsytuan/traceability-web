import React, { useState } from "react";
import PropTypes from "prop-types";
import { Dropdown, Image, Menu, Modal } from "antd";
import { MoreOutlined } from "@ant-design/icons";
import "./CustomVideo.scss";
import { convertWatchYoutubetoEmbebed } from "@app/common/dataConverter";
CustomVideo.propTypes = {
  name: PropTypes.string,
  src: PropTypes.string,
  remove: PropTypes.func,
  disabled: PropTypes.bool,
};
CustomVideo.defaultProps = {
  remove: undefined,
  disabled: false,
  idVideo: 0,
};
function CustomVideo({ name, src, remove, disabled, idVideo }) {
  const [visible, setVisible] = useState(false);
  const handlePreview = () => {
    setVisible(true);
  };
  const handleClose = () => {
    setVisible(false);
  };
  const items = [{ label: "Xem chi tiết", key: "viewct", onClick: handlePreview }];
  if (remove && !disabled) items.push({ label: "Xoá", key: "xoa", onClick: canRemove });
  function truncateString(str, maxLength) {
    if (str.length <= maxLength) {
      return str;
    }
    return str.substring(0, maxLength-3) + "...";
  }
  function NameComponent({ name }) {
    const truncatedName = truncateString(name, 27);
    return <span>{truncatedName}</span>;
  }
  function canRemove() {
    remove(idVideo);
  }
  return (
    <div className="video_border">
      <div className="header_video">
        <NameComponent name={name} />
        <Dropdown
          overlay={
            <Menu>
              {items.map((item) => (
                <Menu.Item key={item.key} className="hoverable" onClick={item.onClick}>
                  {item.label}
                </Menu.Item>
              ))}
            </Menu>
          }
        >
          <MoreOutlined />
        </Dropdown>
      </div>
      <div className="video_content">
        <iframe className="iframe_video" src={convertWatchYoutubetoEmbebed(src)} title={name} allowFullScreen></iframe>
        <Modal visible={visible} onCancel={handleClose} footer={null} title={name}>
          <iframe
            width="100%"
            height="400px"
            src={convertWatchYoutubetoEmbebed(src)}
            title={name}
            allowFullScreen
          ></iframe>
        </Modal>
      </div>
    </div>
  );
}

export default CustomVideo;
