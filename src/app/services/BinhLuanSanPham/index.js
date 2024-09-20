import { API } from '@api';
import {
  createBase,
  deleteByIdBase,
  getAllPaginationBaseByID,
  getAllPaginationBaseByIDNotConvert,
  getPaginationBase,
  updateBase,
} from '../Base';
import axios from 'axios';

export function getCommentByID(idParcel, query) {
  return getAllPaginationBaseByID(API.GET_COMMENT_BY_PARCEL_ID, idParcel, query.page, query.limit, {
    status: query.status,
  });
}
export function getCommentByMe(idParcel, user) {
  return getAllPaginationBaseByIDNotConvert(API.GET_COMMENT_BY_PARCEL_ID, idParcel, 1, 0, {
    user,
    status: "pending",
  });
}
export function getCommentByIDAll(idParcel, page, limit) {
  return getPaginationBase(API.GET_COMMENT_BY_PARCEL_ID, idParcel, page, limit);
}

export function createNewComment(data) {
  return createBase(API.CREATE_NEW_COMMENT_BY_PARCEL_ID, data);
}
export function getTableComment(page, limit, query = "") {
  return axios
    .get(`${API.GET_LIST_COMMENT.format(page, limit, query)}`)
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
export function updateCommentById(id, status) {
  return updateBase(API.UPDATE_COMMENT_BY_ID.format(id), { status });
}
export function deleteComment(id) {
  return deleteByIdBase(API.DELETE_CMT_BY_ID, id);
}
