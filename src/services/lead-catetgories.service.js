import axios from "../configs/axios";

export const getActiveCategories = () => {
  return axios
    .get("table/lead-categories/options")
    .then((response) => {
      return response.data.data;
    })
    .catch((error) => console.log(error));
};