import axios from "../configs/axios";

export const getActiveTypes = () => {
  return axios
    .get("table/lead-types/options")
    .then((response) => {
      return response.data.data;
    })
    .catch((error) => console.log(error));
};