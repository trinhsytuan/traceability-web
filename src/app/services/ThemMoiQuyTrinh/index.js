import { API } from "@api";
import { createBase, deleteByIdBase, postBaseNotNotifcation, postRawData, updateBase, updateBaseFormatID } from "../Base";
import axios from "axios";
import { checkTypeStringOrFile, renderMessageError, toast } from "@app/common/functionCommons";
import { deleteImage } from "../ThemMoiSanPham";
import { CONSTANTS, TOAST_MESSAGE } from "@constants";
import { convertCamelCaseToSnakeCase, convertSnakeCaseToCamelCase } from "@app/common/dataConverter";

export function addProduct(values) {
  return createBase(API.PARCEL_BY_ID.format(""), values);
}
export function addStep(values) {
  return postRawData(API.ADD_STEP, values);
}
export async function uploadParcelByStep(data, stepID) {
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
          is_certificate: false,
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
export async function updateTableMediaByStep(stepID, dataImage, imageRoot) {
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
    };
    dem++;
    const axiosPush = axios.post(API.ADD_MEDIA_TO_TABLE, dataPush);
    uploadPromise.push(axiosPush);
  }
  const responses = await axios.all(uploadPromise);
  return responses;
}
export async function createParcel(dataParcel, dataImage) {
  try {
    const responseParcel = await addProduct(dataParcel);
    if (!responseParcel) return null;
    for (let i = 0; i < dataImage.length; i++) {
      const parcelPush = {
        name: dataImage[i].name,
        from_date: dataImage[i].from_date,
        to_date: dataImage[i].to_date,
        stepIndex: dataImage[i].stepIndex,
        describe: dataImage[i].describe,
        parcel: responseParcel._id,
        procedure: dataParcel.procedure,
        product: dataParcel.product,
      };
      const responseStep = await addStep(parcelPush);
      if (dataImage[i]?.image) {
        const responseImage = await uploadParcelByStep(dataImage[i].image);
        const responseMediaStep = await updateTableMediaByStep(responseStep._id, responseImage, dataImage[i].image);
      }
    }
    return responseParcel;
  } catch (e) {
    renderMessageError(e);
    return null;
  }
}
export function deleteParcel(parcelID) {
  return deleteByIdBase(API.PARCEL_BY_ID, parcelID);
}
function updateParcelNotNoti(api, id, data, loading = true) {
  const config = { loading };
  return axios
    .put(api.format(id), convertCamelCaseToSnakeCase(data), config)
    .then((response) => {
      if (response.status === 200) return convertSnakeCaseToCamelCase(response?.data);
      return null;
    })
    .catch((err) => {
      renderMessageError(err);
      return null;
    });
}
export function updateParcel(id, data) {
  return updateParcelNotNoti(API.PARCEL_BY_ID, id, data);
}
export async function updateParcelAll(id, dataParcel) {
  const responseParcel = await updateParcel(id, dataParcel);
  return responseParcel;
}
async function updateOneStep(data) {
  return updateBase(API.EDIT_STEP, data);
}
export async function updateStep(dataParcel, imgDelete) {
  for (let i = 0; i < dataParcel.length; i++) {
    const parcelPush = {
      name: dataParcel[i].name,
      from_date: dataParcel[i].from_date,
      to_date: dataParcel[i].to_date,
      stepIndex: dataParcel[i].stepIndex,
      describe: dataParcel[i].describe,
      _id: dataParcel[i]._id,
    };
    await updateOneStep(parcelPush);
    const res = await uploadParcelByStep(dataParcel[i].image, dataParcel[i]._id);
    await updateTableMediaByStep(dataParcel[i]._id, res, dataParcel[i].image);
  }
  await deleteImage(imgDelete);
}
export async function updateStepAndDeleteImage(dataParcel, imgDelete) {
  try{

    const parcelPush = {
      name: dataParcel.name,
      from_date: dataParcel.from_date,
      to_date: dataParcel.to_date,
      stepIndex: dataParcel.stepIndex,
      describe: dataParcel.describe,
      _id: dataParcel._id,
    };
    await updateOneStep(parcelPush);
    const res = await uploadParcelByStep(dataParcel.image, dataParcel._id);
    await updateTableMediaByStep(dataParcel._id, res, dataParcel.image);

    await deleteImage(imgDelete);
    return true;
  }catch(err){
    return false;
  }
}
export function deleteAllParcel(idParcel) {
  return deleteByIdBase(API.DELETE_ALL_PARCEL, idParcel);
}
export async function editStepChangeProcedure(infoStep, idParcel, idProduct, idProcedure, dataLoHang) {
  const responseDelete = await deleteAllParcel(idParcel);
  const responseUpdateParcel = await updateParcel(idParcel, dataLoHang);
  for (let i = 0; i < infoStep.length; i++) {
    const parcelPush = {
      name: infoStep[i].name,
      from_date: infoStep[i].from_date,
      to_date: infoStep[i].to_date,
      stepIndex: infoStep[i].stepIndex,
      describe: infoStep[i].describe,
      parcel: idParcel,
      procedure: idProcedure,
      product: idProduct,
    };
    const responseStep = await addStep(parcelPush);
    if (infoStep[i]?.image) {
      const responseImage = await uploadParcelByStep(infoStep[i].image);
      const responseMediaStep = await updateTableMediaByStep(responseStep._id, responseImage, infoStep[i].image);
    }
  }
  return responseUpdateParcel;
}


