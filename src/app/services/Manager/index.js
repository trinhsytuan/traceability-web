import { API } from "@api";
import { convertCamelCaseToSnakeCase } from "@app/common/dataConverter";
import axios from "axios";
import { convertParam, convertParamsPagination } from "@app/common/functionCommons";
import { getAllPaginationBase, getAllPaginationBaseByID } from "@app/services/Base";
export function getListProcedure(page, limit, query) {
  return axios
    .get(`${API.GET_PROCEDURE_BY_ORG.format(page, limit, query)}`)
    .then((res) => {
      return convertCamelCaseToSnakeCase(res?.data);
    })
    .catch((error) => {
      return null;
    });
}
export function getListOrgUnit(page = 1, limit = 0, query = "") {
  return axios
    .get(`${API.GET_ORG_UNIT.format(page, limit, query)}`)
    .then((res) => {
      return convertCamelCaseToSnakeCase(res?.data);
    })
    .catch((error) => {
      return null;
    });
}
export function getListOrgUnitByOrgID(idOrg, page = 1, limit = 0, query = "") {
  return axios
    .get(`${API.GET_ALL_MANUFACTURE_BY_PAGINATION_BY_PARCEL.format(idOrg,page, limit, query)}`)
    .then((res) => {
      return convertCamelCaseToSnakeCase(res?.data);
    })
    .catch((error) => {
      return null;
    });
}
export function getAllUserByOrg() {
  return getAllPaginationBase(API.GET_USER_BY_ORG, 1, 0);
}

export function getAllTempleteStepByID(id) {
  return getAllPaginationBaseByID(API.GET_STEP_BY_PROCEDURE, id, 1, 0);
}


