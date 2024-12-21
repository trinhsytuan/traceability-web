import { API } from "@api";
import { createBase } from "../Base";

export function createTuVan(data) {
 
  return createBase(API.REGISTER_TU_VAN, data);
}
