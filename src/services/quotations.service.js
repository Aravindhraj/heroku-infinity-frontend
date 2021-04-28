import axios from "../configs/axios";

export const getAllQuotations = (data) => {
    return axios
      .post("quotations/all", data)
      .then((response) => {
        return response.data.data;
      })
      .catch((error) => console.log(error));
  }

  export const getQuotationsByCustomerId = (data,cust_id) => {
    data.cust_id = cust_id;
    return axios
      .post("quotations/cust-id", data)
      .then((response) => {
        return response.data.data;
      })
      .catch((error) => console.log(error));
  }

  export const saveQuotation = data => {
    return axios
      .post("quotations/save", data)
      .then((response) => {
        return response.data.data;
      })
      .catch((error) => console.log(error));
  }

  export const getQuotation = id => {
    return axios
      .post("quotations/get", { "id": id })
      .then((response) => {
        return response.data.data;
      })
      .catch((error) => console.log(error));
  }

  export const deleteQuotation = (id) => {
    return axios
      .post("quotations/delete", { id })
      .then((response) => {
        return response.data.data;
      })
      .catch((error) => console.log(error));
  };
  