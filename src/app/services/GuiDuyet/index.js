import { API } from "@api";
import { createBase, getAllBase, updateBase } from "../Base";
import axios from "axios";

export function GetListUser() {
  return getAllBase(API.GET_LIST_BROWSER);
}
export function GetListBrowser() {
  return getAllBase(API.LIST_BROWSER);
}
export function GetListEndorser() {
  return getAllBase(API.GET_LIST_ENDORSER);
}
export async function sendToEndorser(dataArray, idParcel, private_key) {
  const dataPush = {
    parcel: idParcel,
    steps: dataArray,
    private_key,
  };
  return updateBase(API.SENT_TO_ENDORSER, dataPush);
}

export function sendtoBrowser(dataArray, idParcel) {
  const dataPush = {
    parcel: idParcel,
    steps: dataArray,
  };
  return updateBase(API.SENT_TO_BROWSER, dataPush);
}
export function sendToBrowserInEndorser(dataArray, idParcel) {
  const dataPush = {
    parcel: idParcel,
    steps: dataArray,
  };
  return updateBase(API.SENT_TO_BROWSER_IN_ENDORSER, dataPush);
}
