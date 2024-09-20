import axios from 'axios';

import { API } from '@api';
import { renderMessageError, toast } from '@app/common/functionCommons';
import { deleteByIdBase, getAllPaginationBase } from '@app/services/Base';
import { convertCamelCaseToSnakeCase, convertSnakeCaseToCamelCase } from '@app/common/dataConverter';
import { CONSTANTS, TOAST_MESSAGE } from '@constants';

export function login(data) {
  return axios
    .post(`${API.LOGIN}`, convertCamelCaseToSnakeCase(data))
    .then((response) => {
      if (response?.data?.active == false) return 1;
      if (response.status === 200) return response.data?.token;
      return null;
    })
    .catch((err) => {
      return null;
    });
}

export function getAllUser(currentPage = 1, totalDocs = 0, query, loading) {
  return getAllPaginationBase(API.USERS, currentPage, totalDocs, query, loading);
}

export function getUserByToken() {
  return axios
    .get(API.MY_INFO)
    .then((response) => {
      if (response?.status === 200) return response?.data;
      return null;
    })
    .catch((err) => {
      renderMessageError(err);
      return null;
    });
}

export function updateMyInfo(dataUpdate) {
  return axios
    .put(API.UPDATE_MY_INFO, dataUpdate)
    .then((res) => {
      return res?.data;
    })
    .catch((err) => {
      renderMessageError(err);
      throw new Error(err);
    });
}

export function createUser(data) {
  return axios
    .post(API.USERS, data)
    .then((response) => {
      if (response.status === 200) return convertSnakeCaseToCamelCase(response?.data?.data);
      return null;
    })
    .catch((err) => {
      renderMessageError(err);
      return null;
    });
}

export function updateUserById(id, dataForm) {
  return axios
    .put(API.USER_ID.format(id), dataForm)
    .then((response) => {
      if (response.status === 200) return convertSnakeCaseToCamelCase(response?.data?.data);
      return null;
    })
    .catch((err) => {
      renderMessageError(err);
      return null;
    });
}

export function deleteUserById(id) {
  return deleteByIdBase(API.USER_ID, id);
}

export function requestResetPassword(token, data) {
  return axios
    .put(API.USER_RESET_PASSWORD, data, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((res) => {
      if (res.data) {
        return res.data;
      } else {
        renderMessageError(err);
        return null;
      }
    })
    .catch((error) => {
      renderMessageError(err);
      return null;
    });
}

export function requestChangePassword(data) {
  return axios
    .put(API.USER_CHANGE_PASSWORD, convertCamelCaseToSnakeCase(data))
    .then((response) => {
      if (response.status === 200) return convertSnakeCaseToCamelCase(response?.data?.data);
      return null;
    })
    .catch((err) => {
      renderMessageError(err);
      return null;
    });
}

export function requestForgetPassword(data) {
  return axios
    .post(API.USER_FORGET_PASSWORD, data)
    .then((response) => {
      if (response.status === 200) return convertSnakeCaseToCamelCase(response?.data);
      return null;
    })
    .catch((err) => {
      renderMessageError(err);
      return null;
    });
}
export function changeAvatar(data) {
  return axios
    .put(API.CHANGE_MY_AVATAR, data)
    .then((response) => {
      if (response.status === 200) return convertSnakeCaseToCamelCase(response?.data);
      return null;
    })
    .catch((err) => {
      renderMessageError(err);
      throw new Error(err);
    });
}
export function changePassword(data) {
  return axios
    .put(API.CHANGE_PASSWORD, convertCamelCaseToSnakeCase(data))
    .then(() => {
      return true;
    })
    .catch((err) => {
      renderMessageError(err);
    });
}

export async function updateMe(data, avatar = null) {
  try {
    let dataAvatar = 1;
    if (avatar != null) dataAvatar = await changeAvatar(avatar);
    if (dataAvatar == null) return;
    const infoUser = await updateMyInfo(data);
    if (infoUser == null) return;
    toast(CONSTANTS.SUCCESS, TOAST_MESSAGE.SUCCESS.UPDATE_ME);
    return infoUser;
  } catch (e) {
    return null;
  }
}

export function register(data) {
  return axios
    .post(API.REGISTER, data)
    .then((response) => {
      if (response.status === 200) {
        //toast(CONSTANTS.SUCCESS, TOAST_MESSAGE.SUCCESS.REGISTER);
        return convertSnakeCaseToCamelCase(response?.data);
      }
      return null;
    })
    .catch((err) => {
      renderMessageError(err);
      return null;
    });
}
