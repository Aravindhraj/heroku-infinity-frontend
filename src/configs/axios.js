import axios from "axios";
import { history } from "../history";
import { toast } from "react-toastify";
import { store } from "./../redux/storeConfig/store";

const instance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

instance.interceptors.request.use(function (config) {
  
  const state = store.getState();

  console.log("token in interceptor");
  console.log(state.auth["token"]);

  if (Object.keys(state.auth).length > 0 && state.auth["token"]) {
    config.headers.Authorization = "Bearer " + state.auth["token"];
  }
  return config;
});


const toastNotification = (json) => {
  if (json["toast"] && json["toast"] === true) {
    if (
      json["message"] !== "" &&
      json["message"] !== null &&
      json["status"] === 200
    ) {
      toast.success(json["message"]);
    }
    if (json["error"] !== "" && json["error"] !== null) {
      toast.error(json["error"]);
    }
  }
};

export default {
  get: (url, params = {}) =>
    instance({
      method: "GET",
      url: url,
      params: params,
      transformResponse: [
        function (data) {
          const json = JSON.parse(data);
          if (json["status"] === 401) {
            history.push("/login");
          }
          toastNotification(json);
          return json;
        },
      ],
    }),
  post: (url, data = {}) =>
    instance({
      method: "POST",
      url: url,
      data: data,
      transformResponse: [
        function (data) {
          const json = JSON.parse(data);
          if (json["status"] === 401) {
            history.push("/login");
          }
          toastNotification(json);
          return json;
        },
      ],
    }),
};
