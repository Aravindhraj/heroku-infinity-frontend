import axios from "../configs/axios";

export const getReceipts = (data) => {
  return axios
    .post("receipts/all", data)
    .then((response) => {
      return response.data.data;
    })
    .catch((error) => console.log(error));
};

export const getReceipt = (id) => {
  return axios
    .post("receipts/get", { id })
    .then((response) => {
      return response.data.data;
    })
    .catch((error) => console.log(error));
};

export const saveReceipt = (data) => {
  return axios
    .post("receipts/save", data)
    .then((response) => {
      return response.data.data;
    })
    .catch((error) => console.log(error));
};

export const deleteReceipt = (id) => {
  return axios
    .post("receipts/delete", { id })
    .then((response) => {
      return response.data.data;
    })
    .catch((error) => console.log(error));
};
