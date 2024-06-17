import { API } from "@api";
import { createBase, getAllPaginationBaseByID, updateBaseFormatID } from "../Base";

export function createPublicProduct(data) {
  return createBase(API.PUBLIC_PARCEL, data);
}
export function editPublicProduct(data,id) {
  return updateBaseFormatID(API.EDIT_PUBLIC_PARCEL,id, data);
}
export function getPublicProductByParcelID(id) {
  return getAllPaginationBaseByID(API.GET_PUBLIC_PRODUCT_BY_PARCEL_ID, id);
}


