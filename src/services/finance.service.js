import axios from "../configs/axios";

export const getFinances = () => {
  return axios
    .get("finance/all")
    .then((response) => {
      return response.data.data;
    })
    .catch((error) => console.log(error));
};

export const getFinance = id => {
  return axios
    .post('finance/get', { id })
    .then((response) => {
      return response.data.data;
    })
    .catch((error) => console.log(error));
};

export const saveFinance = data => {
  return axios
    .post('finance/save', { ...data })
    .then((response) => {
      return response.data.data;
    })
    .catch((error) => console.log(error));
}

export const deleteFinance = id => {
  return axios
    .post('finance/delete', { 'id': id })
    .then((response) => {
      return response.data.data;
    })
    .catch((error) => console.log(error));
}

export const getActiveFinance = () => {
  return axios
    .get('finance/active')
    .then((response) => {
      return response.data.data;
    })
    .catch((error) => console.log(error));
}