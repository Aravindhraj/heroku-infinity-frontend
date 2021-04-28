import axios from "../configs/axios";

export const getCategories = () => {
  return axios
    .get("categories/all")
    .then((response) => {
      return response.data.data;
    })
    .catch((error) => console.log(error));
};

export const saveCategory = (data) => {
  return axios
    .post("categories/save", data)
    .then((response) => {
      return response.data;
    })
    .catch((error) => console.log(error));
};

export const deleteCategory = (id) => {
  return axios
    .post("categories/delete", { id })
    .then((response) => {
      return response.data.data;
    })
    .catch((error) => console.log(error));
};

export const getCategoriesOptions = () => {
  return axios
    .get("categories/options")
    .then((response) => {
      return response.data.data;
    })
    .catch((error) => console.log(error));
};
