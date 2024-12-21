import { API } from "@api";
import { createBase, getAllPaginationBaseByIDParamsString } from "../Base";

export function createTuVan(data) {
 
  return createBase(API.REGISTER_TU_VAN, data);
}

export function getAllTuVan(name = null, phone = null, page = 1, limit = 0) {
  let paramsTuVan = "";
  if (name) paramsTuVan += "&name=[like]" + name;
  if (phone) paramsTuVan += "&phone[like]=" + phone;
  return getAllPaginationBaseByIDParamsString(API.REGISTER_TU_VAN, "", page, limit, paramsTuVan);
}
