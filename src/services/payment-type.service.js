import axios from "../configs/axios";

export const getActivePaymentTypes = () => {
  return axios
    .get("table/payment-types/options")
    .then((response) => {
      return response.data.data;
    })
    .catch((error) => console.log(error));
};