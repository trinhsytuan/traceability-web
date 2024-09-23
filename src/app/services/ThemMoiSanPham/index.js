import { API } from "@api";
import { checkTypeStringOrFile } from "@app/common/functionCommons";
import {
  createBase,
  deleteByIdBase,
  getAllPaginationBaseByIDNotConvert,
  getAllPaginationBaseByIDNotConvertParamsString,
  getAllPaginationBaseParamsString,
  getByIdBase,
  updateBase,
} from "@app/services/Base";
import axios from "axios";

export function addProduct(values) {
  return createBase(API.ADD_NEW_PRODUCT, values);
}
export function updProduct(values, id) {
  values._id = id;
  return updateBase(API.GET_PRODUCT_BY_ID_BASE, values);
}
export async function uploadImageProduct(data, productID) {
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
          product: productID,
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
export async function updateImageToTableMedia(productID, dataImage, imageRoot) {
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
      product: productID,
    };
    dem++;
    const axiosPush = axios.post(API.ADD_MEDIA_TO_TABLE, dataPush);
    uploadPromise.push(axiosPush);
  }
  const responses = await axios.all(uploadPromise);
  return responses;
}

export async function createProduct(data) {
  try {
    const imageProduct = data.image;
    delete data.image;
    const responseProduct = await addProduct(data);
    const responseImage = await uploadImageProduct(imageProduct, responseProduct._id);
    const tableResponse = await updateImageToTableMedia(responseProduct._id, responseImage, imageProduct);
    return responseProduct;
  } catch (e) {
    return null;
  }
}
export async function deleteImage(data) {
  const arrMedia = [];
  const arrFile = [];
  for (let i = 0; i < data.length; i++) {
    let fileDelete = data[i].origin ? data[i].origin : data[i].url;
    const itemFile = axios.delete(API.DELETE_FILE_BY_FILE_NAME.format(fileDelete));
    const itemMedia = axios.delete(API.DELETE_MEDIA_BY_ID.format(data[i]._id));
    arrMedia.push(itemMedia);
    arrFile.push(itemFile);
  }
  await axios.all(arrMedia);
  await axios.all(arrFile);
}
export async function updateProduct(data, id) {
  try {
    const imageProduct = data.image;
    const imageDelete = data.remove;
    delete data.image;
    delete data.remove;
    const responseProduct = await updProduct(data, id);
    const responseImage = await uploadImageProduct(imageProduct, id);
    await updateImageToTableMedia(id, responseImage, imageProduct);
    await deleteImage(imageDelete);
    return responseProduct;
  } catch (e) {
    return null;
  }
}
export function getInfoProduct(id) {
  return getByIdBase(API.GET_PRODUCT_BY_ID_BASE, id);
}
export function getMediaBase(id) {
  return getAllPaginationBaseByIDNotConvert(API.GET_MEDIA_BY_ID, id, 1, 0);
}
export function getMediaProcedureBaseStep(id) {
  return getAllPaginationBaseByIDNotConvertParamsString(API.GET_MEDIA_BY_STEP, id, 1, 0, "is_certificate=false");
}
export function getMediaAuditBaseStep(id) {
  return getAllPaginationBaseByIDNotConvert(API.GET_MEDIA_BY_STEP, id, 1, 0, {
    is_certificate: true,
  });
}
export function deleteProduct(id) {
  return deleteByIdBase(API.GET_PRODUCT_BY_ID_BASE, id);
}

export function getAllProductByOrg(page, limit, query) {
  return getAllPaginationBaseParamsString(API.GET_ALL_PRODUCT_BY_ORG, page, limit, query);
}

export function getProductByOrg(page, limit, query) {
  return getAllPaginationBaseParamsString(API.PRODUCT_GET_ADMIN_ORG, page, limit, query);
}
