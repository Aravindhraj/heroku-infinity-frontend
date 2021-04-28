import { combineReducers } from "redux";
import login from "./auth/loginReducer";
import customizer from "./customizer/customizer"


const rootReducer = combineReducers({
  auth: login,
  customizer: customizer
});

export default rootReducer
