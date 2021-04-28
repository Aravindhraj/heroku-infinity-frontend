import axios from "../configs/axios";

export const getUsers = () => {
  return axios
    .get("users/all")
    .then((response) => {
      return response.data.data;
    })
    .catch((error) => console.log(error));
};


export const getUser = id => {
  return axios
    .post('users/get', { id })
    .then((response) => {
      return response.data.data;
    })
    .catch((error) => console.log(error));
};

export const saveUser = data => {
  return axios
    .post('users/save', { ...data })
    .then((response) => {
      return response.data.data;
    })
    .catch((error) => console.log(error));
}

export const deleteUser = id => {
  return axios
    .post('users/delete', { 'id': id })
    .then((response) => {
      return response.data.data;
    })
    .catch((error) => console.log(error));
}

export const fetchSalesPerson = () => {
  return axios
    .get('users/sales-person')
    .then((response) => {
      return response.data.data;
    })
    .catch((error) => console.log(error));
}

export const fetchUsersByType = (user_type) => {
  console.log("going to fetch by user_type: "+user_type);
  return axios
    .post('users/get-by-type',{"user_type":user_type})
    .then((response) => {
      return response.data.data;
    })
    .catch((error) => console.log(error));
}

// export const fetchAllServicePersons = () => {
//   return axios
//     .get('users/service-person')
//     .then((response) => {
//       return response.data.data;
//     })
//     .catch((error) => console.log(error));
// }

