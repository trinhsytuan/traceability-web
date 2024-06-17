import { API } from "@api";
import { getAllPaginationBaseByIDParamsString } from "../Base";

export function getLifeCycleParcelProducer(id) {
  return getAllPaginationBaseByIDParamsString(API.GET_LIFECYCLE_BY_PARCEL_ID, id, 1, 0, "&scope=producer");
}
export function getLifeCycleParcelEndorser(id) {
  return getAllPaginationBaseByIDParamsString(API.GET_LIFECYCLE_BY_PARCEL_ID, id, 1, 0, "&scope=endorser");
}
export function getLifeCycleInspection(id) {
  return getAllPaginationBaseByIDParamsString(API.GET_LIFECYCLE_ENDORSER_BY_ID_AND_MY_ORG, id, 1, 0);
}
export function getLifeCycleInspectionNotOrg(id) {
  return getAllPaginationBaseByIDParamsString(API.GET_LIFECYCLE_ENDORSER_BY_ID, id, 1, 0);
}


