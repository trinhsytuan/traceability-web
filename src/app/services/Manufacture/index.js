import { API } from "@api";
import axios from "axios";
import { createBase, deleteByIdBase, updateBaseFormatID } from "../Base";

export function getManufactureAllPagination(idOrg, page, limit, query = "") {
  return axios
    .get(`${API.GET_ALL_MANUFACTURE_BY_PAGINATION_BY_PARCEL.format(idOrg,page, limit, query)}`)
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

export function addNewFacture(id, data) {
  const newData = {
    ...data,
    org: id,
  };
  return createBase(API.CREATE_MANUFACTURE, newData);
}
export function editFacture(id, data) {
  return updateBaseFormatID(API.UPDATE_MANUFACTURE, id, data);
}
export function deleteFacture(id) {
    return deleteByIdBase(API.DELETE_MANUFACTURE,id);
}

