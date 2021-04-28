import axios from "../configs/axios";

export const getProducts = (data) => {
  return axios
    .post("products/all", data)
    .then((response) => {
      return response.data.data;
    })
    .catch((error) => console.log(error));
};

export const getProduct = (id) => {
  return axios
    .post("products/get", { id })
    .then((response) => {
      return response.data.data;
    })
    .catch((error) => console.log(error));
};

export const saveProduct = (data) => {
  console.log("data");
  console.log(data);
  return axios
    .post("products/save", data)
    .then((response) => {
      return response.data.data;
    })
    .catch((error) => console.log(error));
};

export const deleteProduct = (id) => {
  return axios
    .post("products/delete", { id })
    .then((response) => {
      return response.data.data;
    })
    .catch((error) => console.log(error));
};

export const fetchActiveProducts = () => {
  return axios
    .get("products/fetch-active")
    .then((response) => {
      return response.data.data;
    })
    .catch((error) => console.log(error));
};
