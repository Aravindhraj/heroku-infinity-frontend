import { history } from "../../../history"
import axios from "./../../../configs/axios"

export const loginWithJWT = user => {
  return dispatch => {
    axios
      .post("login", {
        email: user.email,
        password: user.password
      })
      .then(response => {
        if (response.data.status === 200) {
          dispatch({
            type: "LOGIN_WITH_JWT",
            payload: { user: response.data.data.user, token: response.data.data.token, loggedInWith: 'jwt' }
          })
          history.push("/")
        }

      })
      .catch(err => console.log(err))
  }
}

export const logoutWithJWT = () => {
  return dispatch => {
    dispatch({ type: "LOGOUT_WITH_JWT", payload: {} })
    history.push("/login")
  }
}
