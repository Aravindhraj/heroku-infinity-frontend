import axios from "../configs/axios";

export const getAccessories = () => {
  return axios
    .get("accessories/all")
    .then((response) => {
      return response.data.data;
    })
    .catch((error) => console.log(error));
};
export const getAccessoriesByIds = (data) => {
  return axios
    .post("accessories/getByIds", data)
    .then((response) => {
      return response.data.data;
    })
    .catch((error) => console.log(error));
};

export const saveAccessories = (data) => {
  return axios
    .post("accessories/save", data)
    .then((response) => {
      return response.data;
    })
    .catch((error) => console.log(error));
};

export const deleteAccessory = (id) => {
  return axios
    .post("accessories/delete", { id })
    .then((response) => {
      return response.data.data;
    })
    .catch((error) => console.log(error));
};

export const getAccessoriesOptions = () => {
  return axios
    .get("accessories/options")
    .then((response) => {
      return response.data.data;
    })
    .catch((error) => console.log(error));
};
