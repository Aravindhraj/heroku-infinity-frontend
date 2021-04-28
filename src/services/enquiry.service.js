import axios from "../configs/axios";

export const saveEnquiry = (data) => {
  return axios
    .post("enquiry/save", data)
    .then((response) => {
      return response.data.data;
    })
    .catch((error) => console.log(error));
};

export const fetchAll = data => {
  return axios
    .post('enquiry/all', data)
    .then((response) => {
      return response.data.data;
    })
    .catch((error) => console.log(error));
}

export const getEnquiry = id => {
  return axios
    .post('enquiry/get', { id })
    .then((response) => {
      return response.data.data;
    })
    .catch((error) => console.log(error));
}

export const getEnquiryDetails = id => {
  return axios
    .post('enquiry/details', { id })
    .then((response) => {
      return response.data.data;
    })
    .catch((error) => console.log(error));
}