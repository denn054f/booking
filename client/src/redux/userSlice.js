import { createSlice } from "@reduxjs/toolkit";
// define the initial state for the "user" slice of the global Redux state
const initialState = {
  user: null,
};
// create a Redux slice for the "user" state
export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // define the "setUser" action creator, which updates the "user" property in the Redux state
    setUser: (state, action) => {
      state.user = action.payload;
    },
  },
});

export const { setUser } = userSlice.actions;
