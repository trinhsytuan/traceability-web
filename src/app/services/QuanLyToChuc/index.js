import { API } from "@api";
import { createBase, deleteByIdBase, getAllPaginationBaseParamsString, updateBaseFormatID } from "../Base";

export function getListOrg(page, limit, query) {
  return getAllPaginationBaseParamsString(API.GET_LIST_ORG, page, limit, query);
}

export function createOrg(data) {
  return createBase(API.CREATE_ORG, data);
}
export function editOrg(id,data) {
  return updateBaseFormatID(API.EDIT_ORG, id, data)
}
export function deleteOrg(id) {
  return deleteByIdBase(API.DELETE_ORG, id);
}