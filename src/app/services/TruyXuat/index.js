import { API } from '@api';
import { convertCamelCaseToSnakeCase } from '@app/common/dataConverter';
import {
  getAllBase,
  getAllPaginationBaseByIDNotConvert,
  getAllPaginationBaseByIDNotConvertParamsString,
  getAllPaginationBaseByIDParamsString,
  getAllPaginationBaseParamsString,
  getByIdBase,
} from '@app/services/Base/index';
import axios from 'axios';
import { getMediaBase, getMediaProcedureBaseStep } from '../ThemMoiSanPham';

export function getParcelById(id) {
  return axios
    .get(API.PARCEL_BY_ID.format(id))
    .then((res) => {
      return convertCamelCaseToSnakeCase(res?.data);
    })
    .catch((error) => {
      return null;
    });
}
export function getProductByID(page = 1, limit = 10, query = "") {
  return getAllPaginationBaseParamsString(API.PRODUCT_GET_BY_MY_ORG, page, limit, query);
}
export function getParcelSelectByMyOrg() {
  return getAllBase(API.GET_SELECT_PARCEL_BY_MY_ORG);
}
export function getAllParcelById(id, name = null, status = null, page = 1, limit = 0) {
  let paramsParcel = "";
  if (status) paramsParcel += "&status_endorser=" + status;
  if (name) paramsParcel += "&name[like]=" + name;
  return getAllPaginationBaseByIDParamsString(API.GET_PARCEL_BY_PRODUCT, id, page, limit, paramsParcel);
}
export function getAllParcelPagination(
  name = null,
  status = null,
  page = 1,
  limit = 0,
  from = null,
  to = null,
  parcel = null,
  id
) {
  let paramsParcel = "";
  if (status) paramsParcel += "&status_endorser=" + status;
  if (name) paramsParcel += "&name[like]=" + name;
  if (from) paramsParcel += "&nsx[from]=" + from;
  if (to) paramsParcel += "&nsx[to]=" + to;
  if (parcel) paramsParcel += "&status=" + status;
  return getAllPaginationBaseParamsString(API.GET_PARCEL_BY_PRODUCT + "/" + id, page, limit, paramsParcel);
}
export async function getMediaStepByID(id) {
  const dataResponse = await getAllPaginationBaseByIDNotConvertParamsString(
    API.GET_MEDIA_BY_STEP,
    id,
    1,
    0,
    "is_certificate=false"
  );
  return dataResponse;
}
export async function getStepByParcel(idParcel) {
  const data = await getAllPaginationBaseByIDNotConvert(API.GET_STEP_BY_PARCEL, idParcel, 1, 0);
  for (let i = 0; i < data.length; i++) {
    const media = await getMediaStepByID(data[i]._id);
    data[i].image = media ? media : [];
  }
  return data;
}
export function getOrg(idOrg) {
  return getByIdBase(API.GET_ORG_BY_ID, idOrg);
}
export async function queryProduct(parcelID) {
  try {
    const data = {};
    const responses = await axios.all([
      axios.get(API.PARCEL_BY_ID.format(parcelID) + "?limit=0"),
      axios.get(API.GET_STEP_BY_PARCEL_ID.format(parcelID) + "?limit=0"),
    ]);
    data.parcel = responses[0].data;
    data.step = responses[1].data?.docs;
    data.step.sort((a, b) => a.stepIndex - b.stepIndex);
    for (let i = 0; i < data.step.length; i++) {
      data.step[i].img = await getMediaProcedureBaseStep(data.step[i]._id);
    }
    data.org = await getOrg(data.parcel.product?.org);
    data.imgProduct = await getMediaBase(data.parcel.product?._id);
    return data;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
}
export async function queryProductByParcelName(parcelName) {
  try {
    let parcel = await getAllBase(`${API.QUERY_PRODUCT_BY_PARCEL_NAME}/${parcelName}`);
    if (parcel.steps) {
      parcel.steps.sort((a, b) => a.stepIndex - b.stepIndex);
    }
    if (parcel.showMedia) {
      if (parcel.step) {
        for (let i = 0; i < parcel.steps.length; i++) {
          parcel.steps[i].img = await getMediaProcedureBaseStep(parcel.steps[i]._id);
        }
      }
      parcel.imgProduct = await getMediaBase(parcel.product._id);
    }
    return parcel;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
}
export async function queryProductByParcelNameNotPublic(parcelName) {
  try {
    let parcel = await getAllBase(`${API.QUERY_PRODUCT_BY_PARCEL_NAME_NOT_PUBLIC}/${parcelName}`);
    if (parcel.steps) {
      parcel.steps.sort((a, b) => a.stepIndex - b.stepIndex);
    }
    if (parcel.showMedia) {
      if (parcel.step) {
        for (let i = 0; i < parcel.steps.length; i++) {
          parcel.steps[i].img = await getMediaProcedureBaseStep(parcel.steps[i]._id);
        }
      }
      parcel.imgProduct = await getMediaBase(parcel.product._id);
    }
    return parcel;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
}
