import axios from "../configs/axios";

export const getDepartments = () => {
  return axios
    .get("department/all")
    .then((response) => {
      return response.data.data;
    })
    .catch((error) => console.log(error));
};

export const getActiveDepartments = () => {
  return axios
    .get("department/active")
    .then((response) => {
      return response.data.data;
    })
    .catch((error) => console.log(error));
}

export const getDepartment = id => {
  return axios
    .post('department/get', { id })
    .then((response) => {
      return response.data.data;
    })
    .catch((error) => console.log(error));
};

export const saveDepartment = data => {
  return axios
    .post('department/save', { ...data })
    .then((response) => {
      return response.data.data;
    })
    .catch((error) => console.log(error));
}

export const deleteDepartment = id => {
  return axios
    .post('department/delete', { 'id': id })
    .then((response) => {
      return response.data.data;
    })
    .catch((error) => console.log(error));
}