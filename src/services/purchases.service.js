import axios from "../configs/axios";

export const getAllPurchases = (data) => {
    return axios
      .post("purchases/all", data)
      .then((response) => {
        return response.data.data;
      })
      .catch((error) => console.log(error));
  }

  export const getPurchasesByCustomerId = (data,cust_id) => {
    data.cust_id = cust_id;
    return axios
      .post("purchases/cust-id", data)
      .then((response) => {
        return response.data.data;
      })
      .catch((error) => console.log(error));
  }

  export const savePurchase = data => {
    return axios
      .post("purchases/save", data)
      .then((response) => {
        return response.data.data;
      })
      .catch((error) => console.log(error));
  }

  export const getPurchase = id => {
    return axios
      .post("purchases/get", { "id": id })
      .then((response) => {
        return response.data.data;
      })
      .catch((error) => console.log(error));
  }

  export const getRecentPurchase = (cust_id) => {
    return axios
      .post("purchases/recent",{ "cust_id": cust_id } )
      .then((response) => {
        return response.data.data;
      })
      .catch((error) => console.log(error));
  }