import { API } from "@api";
import { createBase } from "../Base";

export function sendResultToProducer(data, private_key) {
  const newData = {
    steps: data,
    private_key,
  };
  return createBase(API.SENT_RESULT_TO_PRODUCER, newData);
}

