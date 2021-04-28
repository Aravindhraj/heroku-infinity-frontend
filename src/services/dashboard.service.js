import axios from "../configs/axios";

export const getDashboardCounters = () => {
  return axios
    .get("dashboard/counters")
    .then((response) => {
      return response.data.data;
    })
    .catch((error) => console.log(error));
};
