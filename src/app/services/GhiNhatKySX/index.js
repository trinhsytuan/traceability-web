import { API } from '@api';
import { createBase, deleteByIdBase, getAllPaginationBaseByID, updateBaseFormatID } from '../Base';
import { updateImageToTableMediaProcedure, uploadImageAuditProcedure } from '../NhatKyKiemDinh';
import { deleteImage } from '../ThemMoiSanPham';

export async function addNewAuditProcedure(data, idStep) {
  const image = data.image;
  delete data.image;
  const responseAudit = await createBase(API.CREATE_RECORD_HISTORY_PROCEDURE, {
    ...data,
    step: idStep,
  });
  const idAudit = responseAudit._id;
  const responseImage = await uploadImageAuditProcedure(image, idAudit);
  const tableResponse = await updateImageToTableMediaProcedure(
    idAudit,
    responseImage,
    image
  );
  return responseAudit;
}
export async function editAuditHistoryProcedure(data, id, remove) {
  const image = data.image;
  delete data.image;
  const responseAudit = await updateBaseFormatID(
    API.UPDATE_PRODUCT_HISTORY_BY_STEP,
    id,
    data
  );
  const idAudit = responseAudit._id;
  const responseImage = await uploadImageAuditProcedure(image, idAudit);
  const tableResponse = await updateImageToTableMediaProcedure(
    idAudit,
    responseImage,
    image
  );
  await deleteImage(remove);
  return responseAudit;
}
export const getAllHistoryByStep = (id) => {
  return getAllPaginationBaseByID(API.GET_RECORD_HISTORY_PROCEDURE_BY_STEP, id);
};

export const removeHistoryByStep = (id) => {
  return deleteByIdBase(API.UPDATE_PRODUCT_HISTORY_BY_STEP, id);
};
