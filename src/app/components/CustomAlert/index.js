import React from "react";
import { CONSTANTS } from "@constants";
import "./CustomAlert.scss";
import InUserIcon from "../Icons/InUserIcon";
export const CustomAlert = (props) => {
  const renderAlert = () => {
    let classString = "custom-alert";
    const icon = props.icon ? props.icon : <InUserIcon />;

    if (props.type == CONSTANTS.SUCCESS) {
      classString += " custom-alert--success";
    } else {
      classString += " custom-alert--error";
    }
    return (
      <>
      <div className={classString}>
        <div className="custom-alert__icon">
          <div className="alert__icon">{icon}</div>
        </div>
        <div className="custom-alert__message">{props.message}</div>
      </div>

      </>
    );
  };
  return renderAlert();
};
