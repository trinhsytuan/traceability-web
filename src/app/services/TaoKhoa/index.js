import { API } from "@api";

import { createBase, deleteBase, getAllBase, updateBase } from "@app/services/Base";

export function enrollPKI(data) {
  return createBase(API.ENROLL, data);
}

export function updateTitle(data) {
  return updateBase(API.UPDATE_TITLE_KEY_MY_SELF, data);
}
export function deleteKey() {
  return deleteBase(API.UPDATE_TITLE_KEY_MY_SELF);
}
export function getKey() {
  return getAllBase(API.UPDATE_TITLE_KEY_MY_SELF);
}

