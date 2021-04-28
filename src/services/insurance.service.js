import axios from "../configs/axios";

export const getInsurances = () => {
  return axios
    .get("insurance/all")
    .then((response) => {
      return response.data.data;
    })
    .catch((error) => console.log(error));
};

export const getInsurance = id => {
  return axios
    .post('insurance/get', { id })
    .then((response) => {
      return response.data.data;
    })
    .catch((error) => console.log(error));
};

export const saveInsurance = data => {
  return axios
    .post('insurance/save', { ...data })
    .then((response) => {
      return response.data.data;
    })
    .catch((error) => console.log(error));
}

export const deleteInsurance = id => {
  return axios
    .post('insurance/delete', { 'id': id })
    .then((response) => {
      return response.data.data;
    })
    .catch((error) => console.log(error));
}