import axios from "../configs/axios";

export const getAllServiceHistory = (data) => {
    return axios
      .post("service-history/all", data)
      .then((response) => {
        return response.data.data;
      })
      .catch((error) => console.log(error));
  }

  export const getServiceHistByCustomerId = (data,cust_id) => {
    data.cust_id = cust_id;
    return axios
      .post("service-history/cust-id", data)
      .then((response) => {
        return response.data.data;
      })
      .catch((error) => console.log(error));
  }

  export const saveServiceHistory = data => {
    return axios
      .post("service-history/save", data)
      .then((response) => {
        return response.data.data;
      })
      .catch((error) => console.log(error));
  }

  export const getServiceHistory = id => {
    return axios
      .post("service-history/get", { "id": id })
      .then((response) => {
        return response.data.data;
      })
      .catch((error) => console.log(error));
  }