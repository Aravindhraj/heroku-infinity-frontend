import axios from "../configs/axios";

export const getRoles = () => {
  return axios
    .get("roles/all")
    .then((response) => {
      return response.data.data;
    })
    .catch((error) => console.log(error));
};

export const getRoleData = (id) => {
  return axios
    .post("roles/get", { id })
    .then((response) => {
      return response.data.data;
    })
    .catch((error) => console.log(error));
};

export const getPermissions = () => {
  return axios
    .get("permissions/all")
    .then((response) => {
      return response.data.data;
    })
    .catch((error) => console.log(error));
};

export const editRole = (data) => {
  return axios
    .post("roles/edit", data)
    .then((response) => {
      return response.data.data;
    })
    .catch((error) => console.log(error));
};
