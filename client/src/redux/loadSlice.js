import { createSlice } from "@reduxjs/toolkit";
// define a Redux slice for managing load messages
export const loadSlice = createSlice({
  name: "loading",
  initialState: {
    // set initial state for the loading property
    loading: false,
  },
  reducers: {
    // define an action to show the loading indicator
    showLoading: (state) => {
      state.loading = true;
    },
    // define an action to hide the loading indicator
    hideLoading: (state) => {
      state.loading = false;
    },
  },
});

export const { showLoading, hideLoading } = loadSlice.actions;
