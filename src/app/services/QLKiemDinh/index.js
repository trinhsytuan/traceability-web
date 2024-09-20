import axios from 'axios';

import { API } from '@api';
import { renderMessageError, toast } from '@app/common/functionCommons';
import { CONSTANTS } from '@constants';

export function getMyOrgInspectByParcel(page, limit, query) {
  query = query ? query : "";
  return axios
    .get(`${API.GET_MY_ORG_INSPECTS_BY_PARCEL.format(page, limit, query)}`)
    .then((res) => {
      if (res.data) {
        return res.data;
      } else {
        return null;
      }
    })
    .catch((error) => {
      return null;
    });
}
export function getMyInspect(page, limit, query) {
  query = query ? query : "";
  return axios
    .get(`${API.GET_MY_INSPECTS.format(page, limit, query)}`)
    .then((res) => {
      if (res.data) {
        return res.data;
      } else {
        return null;
      }
    })
    .catch((error) => {
      return null;
    });
}
export function changeInspector(id, data) {
  return axios
    .put(API.CHANGE_INSPECTOR.format(id), data)
    .then((res) => {
      if (res.data) {
        toast(CONSTANTS.SUCCESS, "Cập nhật thông tin kiểm định thành công!");
        return res.data;
      } else {
        return null;
      }
    })
    .catch((err) => {
      renderMessageError(err);
      throw new Error(err);
    });
}
export function sendFeedbackAudit(id, data) {
  return axios
    .post(API.SEND_FEEDBACK_AUDIT.format(id))
    .then((res) => {
      if (res.data) {
        toast(CONSTANTS.SUCCESS, "Gửi thông báo thành công!");
        return res.data;
      } else {
        return null;
      }
    })
    .catch((err) => {
      renderMessageError(err);
      throw new Error(err);
    });
}
export function changeInspectorAll(data) {
  return axios
    .put(API.CHANGE_INSPECTOR_ALL, data)
    .then((res) => {
      if (res.data) {
        toast(CONSTANTS.SUCCESS, "Cập nhật thông tin kiểm định thành công!");
        return res.data;
      } else {
        return null;
      }
    })
    .catch((err) => {
      renderMessageError(err);
      throw new Error(err);
    });
}
