import axios from "../configs/axios";

export const saveLead = data => {
  return axios
    .post("sales-lead/save", data)
    .then((response) => {
      return response.data.data;
    })
    .catch((error) => console.log(error));
}

export const getAllLeads = (data) => {
  return axios
    .post("sales-lead/all", data)
    .then((response) => {
      return response.data.data;
    })
    .catch((error) => console.log(error));
}

export const getLead = id => {
  return axios
    .post("sales-lead/get", { "id": id })
    .then((response) => {
      return response.data.data;
    })
    .catch((error) => console.log(error));
}

export const getLeadByCustId = (data,cust_id) => {
  data.cust_id = cust_id;
  return axios
    .post("sales-lead/cust-id", data)
    .then((response) => {
      return response.data.data;
    })
    .catch((error) => console.log(error));
}