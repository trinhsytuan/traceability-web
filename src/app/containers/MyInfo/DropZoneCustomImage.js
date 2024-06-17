import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Dropzone from "react-dropzone";
import PictureCard from "@assets/icons/picture-card.svg";
import { API } from "@api";

import "./DropZoneCustomImage.scss";

function DropZoneCustomImage({ allowChange, stateRerender, multiple, imgUrl, width, height, myInfo, ...props }) {
  const [imagePreview, setPreview] = useState(null);
  const [nameNgan, setNameNgan] = useState();
  const getName = () => {
    var name = myInfo?.name || myInfo?.username;
    var arrName = name?.split(" ");
    const initials = arrName.slice(0, 4).map((name) => name.charAt(0).toUpperCase());
    const abbreviation = initials.join("");
    setNameNgan(abbreviation);
  };
  useEffect(() => {
    setPreview(null);
    getName();
  }, [stateRerender]);

  function handleSelectImages(files) {
    if (!Array.isArray(files) || !files.length) return;
    if (multiple) {
      props.handleDropMulti(files);
    } else {
      setPreview(files[0]);
      props.handleDrop(files[0]);
    }
  }

  const existImg = imagePreview || imgUrl;
  return (
    <>
      <div className="DropZoneCustomImage">
        <Dropzone
          multiple={multiple}
          accept={"image/*"}
          disabled={!allowChange}
          onDrop={(acceptedFiles) => handleSelectImages(acceptedFiles)}
        >
          {({ getRootProps, getInputProps }) => (
            <div className={`custom-dropzoneImage ${allowChange ? "" : "disabled"}`} style={{ width, height }}>
              <div {...getRootProps()} className="bg-upload">
                <input {...getInputProps()} />
                <div className="indoorImage">
                  {existImg && (
                    <>
                      {imagePreview ? (
                        <img
                          src={URL.createObjectURL(imagePreview)}
                          style={{ width: "137px", height: "142px" }}
                          alt=""
                        />
                      ) : (
                        <img src={API.PREVIEW_ID.format(imgUrl)} style={{ width: "137px", height: "142px" }} alt="" />
                      )}
                    </>
                  )}
                  {!existImg && allowChange && (
                    <div>
                      <div className="noAvatar">{nameNgan}</div>
                    </div>
                  )}
                  <div className="btn_imageDropZone">
                    <img src={PictureCard} />
                  </div>
                </div>
              </div>
            </div>
          )}
        </Dropzone>
      </div>
    </>
  );
}

DropZoneCustomImage.propTypes = {
  handleDrop: PropTypes.func,
  handleDropMulti: PropTypes.func,
  multiple: PropTypes.bool,
  width: PropTypes.number || PropTypes.string,
  height: PropTypes.number || PropTypes.string,
  allowChange: PropTypes.bool,
};

DropZoneCustomImage.defaultProps = {
  handleDrop: () => null,
  handleDropMulti: () => null,
  multiple: false,
  width: 150,
  height: 150,
  allowChange: true,
};

export default DropZoneCustomImage;


