import axios from "../configs/axios";

export const getRecords = (type) => {
  return axios
    .get(`${type}/all`)
    .then((response) => {
      return response.data.data;
    })
    .catch((error) => console.log(error));
};

export const saveRecord = (type, data) => {
  return axios
    .post(`${type}/save`, data)
    .then((response) => {
      return response.data;
    })
    .catch((error) => console.log(error));
};

export const deleteRecord = (type, id) => {
  return axios
    .post(`${type}/delete`, { id })
    .then((response) => {
      return response.data.data;
    })
    .catch((error) => console.log(error));
};

// only for varients, enquiry types, payment types, lead types, lead categories
export const getOptionsByTable = (type) => {
  return axios
    .get(`${type}/options`)
    .then((response) => {
      return response.data.data;
    })
    .catch((error) => console.log(error));
};
