import { API } from '@api';
import {
  createBase,
  deleteByIdBase,
  getAllPaginationBase,
  getAllPaginationBaseByIDNotConvert,
  updateBaseFormatID,
} from '../Base';
import axios from 'axios';
import { checkTypeStringOrFile } from '@app/common/functionCommons';
import { deleteImage } from '../ThemMoiSanPham';

export function getStepAudit(id) {
  return getAllPaginationBase(API.GET_AUDIT_BY_STEP.format(id), 1, 0);
}
export async function uploadImageAuditStep(data, auditID) {
  let uploadPromises = data
    .filter((image) => image?.newUp === true)
    .map((image) => {
      if (image.type == "image") {
        let formData = new FormData();
        formData.append("image", image.url);
        return axios.post(API.UPLOAD_IMAGE, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      } else if (image.type == "video" && checkTypeStringOrFile(image.url)) {
        let formData = new FormData();
        formData.append("file", image.url);
        return axios.post(API.UPLOAD_FILE, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      } else {
        const dataPush = {
          name: "Video",
          file_name: "Video",
          url: image.url,
          type: "video",
          audit: auditID,
        };
        return axios.post(API.ADD_MEDIA_TO_TABLE, dataPush);
      }
    });

  const responses = await axios.all(uploadPromises);

  const responseData = responses.reduce((result, response, index) => {
    if (!response?.data) return;
    result[index] = response.data;
    return result;
  }, {});
  return responseData;
}
export async function uploadImageAuditProcedure(data, auditID) {
  let uploadPromises = data
    .filter((image) => image?.newUp === true)
    .map((image) => {
      if (image.type == "image") {
        let formData = new FormData();
        formData.append("image", image.url);
        return axios.post(API.UPLOAD_IMAGE, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      } else if (image.type == "video" && checkTypeStringOrFile(image.url)) {
        let formData = new FormData();
        formData.append("file", image.url);
        return axios.post(API.UPLOAD_FILE, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      } else {
        const dataPush = {
          name: "Video",
          file_name: "Video",
          url: image.url,
          type: "video",
          product_history: auditID,
        };
        return axios.post(API.ADD_MEDIA_TO_TABLE, dataPush);
      }
    });

  const responses = await axios.all(uploadPromises);

  const responseData = responses.reduce((result, response, index) => {
    if (!response?.data) return;
    result[index] = response.data;
    return result;
  }, {});
  return responseData;
}
export async function updateImageToTableMediaAudit(auditID, dataImage, imageRoot) {
  const uploadPromise = [];
  let dem = 0;
  for (let i = 0; i < imageRoot.length; i++) {
    if (
      imageRoot[i].newUp != true ||
      !imageRoot[i].type ||
      (imageRoot[i].type === "video" && !checkTypeStringOrFile(imageRoot[i].url))
    )
      continue;
    const dataPush = {
      name: imageRoot[i].file_name,
      file_name: imageRoot[i].file_name,
      url: dataImage[dem].image_id,
      type: imageRoot[i].type,
      audit: auditID,
    };
    dem++;
    const axiosPush = axios.post(API.ADD_MEDIA_TO_TABLE, dataPush);
    uploadPromise.push(axiosPush);
  }
  const responses = await axios.all(uploadPromise);
  return responses;
}
export async function updateImageToTableMediaProcedure(auditID, dataImage, imageRoot) {
  const uploadPromise = [];
  let dem = 0;
  for (let i = 0; i < imageRoot.length; i++) {
    if (
      imageRoot[i].newUp != true ||
      !imageRoot[i].type ||
      (imageRoot[i].type === "video" && !checkTypeStringOrFile(imageRoot[i].url))
    )
      continue;
    const dataPush = {
      name: imageRoot[i].file_name,
      file_name: imageRoot[i].file_name,
      url: dataImage[dem].image_id,
      type: imageRoot[i].type,
      product_history: auditID,
    };
    dem++;
    const axiosPush = axios.post(API.ADD_MEDIA_TO_TABLE, dataPush);
    uploadPromise.push(axiosPush);
  }
  const responses = await axios.all(uploadPromise);
  return responses;
}
export async function addNewAudit(data) {
  const image = data.image;
  delete data.image;
  const responseAudit = await createBase(API.CREATE_AUDIT, data);
  const idAudit = responseAudit._id;
  const responseImage = await uploadImageAuditStep(image, idAudit);
  const tableResponse = await updateImageToTableMediaAudit(idAudit, responseImage, image);
  return responseAudit;
}
export async function editAuditHistory(data, id, remove) {
  const image = data.image;
  delete data.image;
  const responseAudit = await updateBaseFormatID(API.EDIT_AUDIT, id, data);
  const idAudit = responseAudit._id;
  const responseImage = await uploadImageAuditStep(image, idAudit);
  const tableResponse = await updateImageToTableMediaAudit(idAudit, responseImage, image);
  await deleteImage(remove);
  return responseAudit;
}
export function deleteAudit(id) {
  return deleteByIdBase(API.DELETE_AUDIT, id);
}
export async function uploadImageAudit(data, stepID) {
  let uploadPromises = data
    .filter((image) => image?.newUp === true)
    .map((image) => {
      if (image.type == "image") {
        let formData = new FormData();
        formData.append("image", image.url);
        return axios.post(API.UPLOAD_IMAGE, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      } else if (image.type == "video" && checkTypeStringOrFile(image.url)) {
        let formData = new FormData();
        formData.append("file", image.url);
        return axios.post(API.UPLOAD_FILE, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      } else {
        const dataPush = {
          name: "Video",
          file_name: "Video",
          url: image.url,
          type: "video",
          step: stepID,
          is_certificate: true,
        };
        return axios.post(API.ADD_MEDIA_TO_TABLE, dataPush);
      }
    });
  const responses = await axios.all(uploadPromises);
  const responseData = responses.reduce((result, response, index) => {
    if (!response?.data) return;
    result[index] = response.data;
    return result;
  }, {});
  return responseData;
}
export async function updateTableMediaByAudit(stepID, dataImage, imageRoot) {
  const uploadPromise = [];
  let dem = 0;
  for (let i = 0; i < imageRoot.length; i++) {
    if (
      imageRoot[i].newUp != true ||
      !imageRoot[i].type ||
      (imageRoot[i].type === "video" && !checkTypeStringOrFile(imageRoot[i].url))
    )
      continue;
    const dataPush = {
      name: imageRoot[i].file_name,
      file_name: imageRoot[i].file_name,
      url: dataImage[dem].image_id,
      type: imageRoot[i].type,
      step: stepID,
      is_certificate: true,
    };
    dem++;
    const axiosPush = axios.post(API.ADD_MEDIA_TO_TABLE, dataPush);
    uploadPromise.push(axiosPush);
  }
  const responses = await axios.all(uploadPromise);
  return responses;
}
export function deleteImageAuditByFile(data) {
  const arrMedia = [];
  const arrFile = [];
  for (let i = 0; i < data.length; i++) {
    const itemFile = axios.delete(API.DELETE_FILE_BY_FILE_NAME.format(data[i].url));
    const itemMedia = axios.delete(API.DELETE_MEDIA_BY_ID.format(data[i]._id));
    arrMedia.push(itemMedia);
    arrFile.push(itemFile);
  }
  axios.all(arrMedia);
  axios.all(arrFile);
}
export async function createImageAudit(dataImageAudit, stepID) {
  const newData = await uploadImageAudit(dataImageAudit, stepID);
  await updateTableMediaByAudit(stepID, newData, dataImageAudit);
}
export function deleteImageAudit(imgDelete) {
  deleteImageAuditByFile(imgDelete);
}
export function getHistoryAudit(id) {
  return getAllPaginationBaseByIDNotConvert(API.GET_HISTORY_AUDIT_BY_PROCEDURE, id, 1, 0);
}
export function changeStatusHistory(id, data) {
  delete data.id;
  return updateBaseFormatID(API.CHANGE_RESULT_LIFECYCLE_DIVISION_BY_ID, id, data);
}
export function changeStatusReception(id, data) {
  return updateBaseFormatID(API.CHANGE_RESULT_INSPECTOR_RECEPTION_BY_ID, id, data);
}


