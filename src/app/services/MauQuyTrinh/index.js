import { API } from '@api';
import { convertSnakeCaseToCamelCase } from '@app/common/dataConverter';
import { renderMessageError } from '@app/common/functionCommons';
import { createBaseSnackCase } from '@app/services/Base';
import axios from 'axios';

export function getTempleteProcedureByID(id) {
  return axios
    .get(API.GET_TEMPLETE_PROCEDURE_BY_ID.format(id))
    .then((res) => {
      return convertSnakeCaseToCamelCase(res?.data);
    })
    .catch((error) => {
      return null;
    });
}
export function getStepTemplateProcedureStepByOrg(id) {
  return axios
    .get(API.GET_PROCESS_TEMPLETE_PROCEDURE_BY_ORG.format(0, id))
    .then((res) => {
      return convertSnakeCaseToCamelCase(res?.data);
    })
    .catch((error) => {
      return null;
    });
}
export function RemoveProcedureByID(id) {
  return axios
    .delete(API.REMOVE_PROCEDURE_BY_ID.format(id))
    .then((res) => {
      return convertSnakeCaseToCamelCase(res?.data);
    })
    .catch((error) => {
      return null;
    });
}
function AddProduct(data) {
  return createBaseSnackCase(API.CREATE_PROCEDURE, data);
}
export function AddProcedure(data) {
  return createBaseSnackCase(API.CREATE_TEMPLATE_STEP_PROCEDURE, data);
}
export async function CreateNewProductAndProcedure(dataProduct, dataProcedure) {
  let infoProduct = await AddProduct(dataProduct);
  if (dataProcedure != null)
    for (let i = 0; i < dataProcedure.length; i++) {
      await AddProcedure({ ...dataProcedure[i], procedure: infoProduct._id });
    }
  return infoProduct;
}
function PutEditNotConvert(api, id, data) {
  return axios
    .put(api.format(id), data)
    .then((response) => {
      if (response.status === 200) return convertSnakeCaseToCamelCase(response?.data);
      return null;
    })
    .catch((err) => {
      renderMessageError(err);
      return null;
    });
}
export async function EditProduct(data, id, editProcedure, createProcedure) {
  try {
    const res = await PutEditNotConvert(API.EDIT_PROCEDURE, id, data);
    if (editProcedure.length > 0) {
      for (let i = 0; i < editProcedure.length; i++) {
        await EditProcedure(editProcedure[i], editProcedure[i]._id);
      }
    }
    if (createProcedure.length > 0) {
      for (let i = 0; i < createProcedure.length; i++) {
        await AddProcedure(createProcedure[i]);
      }
    }
    return res;
  } catch (e) {
    renderMessageError(e);
    return null;
  }
}
export function EditProcedure(data, id) {
  return PutEditNotConvert(API.EDIT_TEMPLATE_STEP, id, data);
}


