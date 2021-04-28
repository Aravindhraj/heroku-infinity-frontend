import axios from "../configs/axios";

export const getVarients = () => {
  return axios
    .get("varients/all")
    .then((response) => {
      return response.data.data;
    })
    .catch((error) => console.log(error));
};

export const saveVarient = (data) => {
  return axios
    .post("varients/save", data)
    .then((response) => {
      return response.data;
    })
    .catch((error) => console.log(error));
};

export const deleteVarient = (id) => {
  return axios
    .post("varients/delete", { id })
    .then((response) => {
      return response.data.data;
    })
    .catch((error) => console.log(error));
};

export const getVarientOptions = () => {
  return axios
    .get("varients/options")
    .then((response) => {
      return response.data.data;
    })
    .catch((error) => console.log(error));
};
