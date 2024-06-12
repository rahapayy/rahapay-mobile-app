// authAction
export const setUserInfo = (userInfo) => ({
  type: "SET_USER_INFO",
  payload: userInfo,
});

export const clearUserInfo = () => ({
  type: "CLEAR_USER_INFO",
});
