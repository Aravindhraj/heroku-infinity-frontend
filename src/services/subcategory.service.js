import axios from "../configs/axios";

export const getSubcategories = () => {
  return axios
    .get("subcategories/all")
    .then((response) => {
      return response.data.data;
    })
    .catch((error) => console.log(error));
};
export const getSubcategoriesOptions = () => {
  return axios
    .get("subcategories/options")
    .then((response) => {
      return response.data.data;
    })
    .catch((error) => console.log(error));
};

export const saveSubcategory = (data) => {
  return axios
    .post("subcategories/save", data)
    .then((response) => {
      return response.data;
    })
    .catch((error) => console.log(error));
};

export const deleteSubcategory = (id) => {
  return axios
    .post("subcategories/delete", { id })
    .then((response) => {
      return response.data.data;
    })
    .catch((error) => console.log(error));
};
