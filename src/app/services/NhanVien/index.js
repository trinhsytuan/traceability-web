import axios from "axios";
import { API } from "@api";
import { renderMessageError, toast  } from "@app/common/functionCommons";
import { CONSTANTS, TOAST_MESSAGE } from "@constants";

export function getAll(page, limit, query) {
  query = query ? query : "";
  return axios
    .get(`${API.GET_MY_ORG_USERS.format(page, limit, query)}`)
    .then(res => {
      if (res.data) {
        return res.data;
      } else {
        return null;
      }
    })
    .catch(error => {
      return null;
    });
}
export function getMyOrgeRoles() {
  const page = 1;
  const limit = 0;
  return axios
    .get(`${API.GET_MY_ORG_ROLES.format(page, limit)}`)
    .then(res => {
      if (res.data) {
        return res.data.docs;
      } else {
        return null;
      }
    })
    .catch(error => {
      return null;
    });
}
export function getInactiveOrgs(page, limit, query) {
  query = query ? query : "";
  return axios
    .get(`${API.GET_INACTIVE_ORG.format(page, limit, query)}`)
    .then(res => {
      if (res.data) {
        return res.data;
      } else {
        return null;
      }
    })
    .catch(error => {
      return null;
    });
}
export function issueAccount(data) {
    return axios
      .post(API.ISSUE_ACCOUNT, data)
      .then((response) => {
        if (response.status === 200) {
            toast(CONSTANTS.SUCCESS, 'Tạo tài khoản thành công!');
            return response?.data;
        }
        return null;
      })
      .catch((err) => {
        renderMessageError(err);
        return null;
      });
  }
export function issueAccountOrg(data) {
    return axios
      .post(API.ISSUE_ACCOUNT_ORG, data)
      .then((response) => {
        if (response.status === 200) {
            toast(CONSTANTS.SUCCESS, 'Tạo tài khoản thành công!');
            return response?.data;
        }
        return null;
      })
      .catch((err) => {
        renderMessageError(err);
        return null;
      });
  }
  export function deleteById(id) {
    return axios
      .delete(`${API.USERS_BY_ID.format(id)}`)
      .then(res => {
        if (res.data) {
            toast(CONSTANTS.SUCCESS, 'Xóa tài khoản thành công!');
          return res.data;
        } else {
          return null;
        }
      })
      .catch(error => {
        renderMessageError(error);
        return null;
      });
  }
  export function updateById(id, data) {
    return axios
      .put(`${API.USERS_BY_ID.format(id)}`, data)
      .then((res) => {
        if (res.data) {
            toast(CONSTANTS.SUCCESS, 'Cập nhật thông tin tài khoản thành công!');
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