import axios from "../configs/axios";

export const getColors = () => {
  return axios
    .get("colors/all")
    .then((response) => {
      return response.data.data;
    })
    .catch((error) => console.log(error));
};

export const saveColor = (data) => {
  return axios
    .post("colors/save", data)
    .then((response) => {
      return response.data;
    })
    .catch((error) => console.log(error));
};

export const deleteColor = (id) => {
  return axios
    .post("colors/delete", { id })
    .then((response) => {
      return response.data.data;
    })
    .catch((error) => console.log(error));
};

export const getColorsOptions = () => {
  return axios
    .get("table/colors/options")
    .then((response) => {
      return response.data.data;
    })
    .catch((error) => console.log(error));
};
