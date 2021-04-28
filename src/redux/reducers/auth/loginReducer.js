const login = (state = {}, action) => {
  switch (action.type) {
    case "LOGIN_WITH_EMAIL": {
      return { ...state, ...action.payload }
    }
    case "LOGIN_WITH_JWT": {
      return { ...state, ...action.payload }
    }
    case "LOGOUT_WITH_JWT": {
      return { ...action.payload }
    }
    default: {
      return state
    }
  }
}
export default login;
