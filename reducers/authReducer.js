// authReducer 
const initialState = {
  userInfo: null,
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_USER_INFO":
      return { ...state, userInfo: action.payload };
    case "CLEAR_USER_INFO":
      return { ...state, userInfo: null };
    default:
      return state;
  }
};

export default authReducer;
