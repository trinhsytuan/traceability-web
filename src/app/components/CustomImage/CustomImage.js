import React, { useState } from "react";
import PropTypes from "prop-types";
import { Dropdown, Image, Menu, Modal } from "antd";
import { MoreOutlined } from "@ant-design/icons";
import "./CustomImage.scss";
CustomImage.propTypes = {
  name: PropTypes.string,
  src: PropTypes.string,
  remove: PropTypes.func,
  disabled: PropTypes.bool,
};
CustomImage.defaultProps = {
  remove: undefined,
  disabled: false,
  idImage: 0,
};
function CustomImage({ name, src, remove, disabled, idImage }) {
  const [visible, setVisible] = useState(false);
  const handlePreview = () => {
    setVisible(true);
  };
  const handleClose = () => {
    setVisible(false);
  };
  const items = [{ label: "Xem chi tiết", key: "viewct", onClick: handlePreview }];
  if (remove && !disabled) items.push({ label: "Xoá", key: "xoa", onClick: canRemove });
  function NameComponent({ name }) {
    return <span className="title-image">{name}</span>;
  }
  function canRemove() {
    remove(idImage);
  }
  return (
    <div className="img_border">
      <div className="header_img">
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
      <div className="img_content">
        <Image src={src} width={115} height={110} onClick={handlePreview} preview={false} />
        <Modal visible={visible} onCancel={handleClose} footer={null} title={name} width={800}>
          <img src={src} alt="Preview" style={{ width: "100%", height: "100%" }} />
        </Modal>
      </div>
    </div>
  );
}

export default CustomImage;
