import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  access_token: null,
};

export const authToken = createSlice({
  name: "token",
  initialState,
  reducers: {
    setUserToken: (state, action) => {
      state.access_token = action.payload.access_token;
    },
    unSetUserToken: (state, action) => {
      state.access_token = action.payload.access_token;
    },
  },
});

export const { setUserToken, unSetUserToken } = authToken.actions;

export default authToken.reducer;
