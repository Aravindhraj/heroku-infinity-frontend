import axios from "../configs/axios";

export const getAllServiceSchedule = (data) => {
    return axios
      .post("service-schedule/all", data)
      .then((response) => {
        return response.data.data;
      })
      .catch((error) => console.log(error));
  }

  export const getServiceScheduleByCustomerId = (data,cust_id) => {
    data.cust_id = cust_id;
    return axios
      .post("service-schedule/cust-id", data)
      .then((response) => {
        return response.data.data;
      })
      .catch((error) => console.log(error));
  }

  export const saveServiceSchedule = data => {
    return axios
      .post("service-schedule/save", data)
      .then((response) => {
        return response.data.data;
      })
      .catch((error) => console.log(error));
  }

  export const getServiceSchedule = id => {
    return axios
      .post("service-schedule/get", { "id": id })
      .then((response) => {
        return response.data.data;
      })
      .catch((error) => console.log(error));
  }