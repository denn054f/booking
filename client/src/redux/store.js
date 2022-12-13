import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import { loadSlice } from "./loadSlice";
import { userSlice } from "./userSlice";
// define the root reducer by combining the loadSlice and userSlice reducers
const rootReducer = combineReducers({
  loading: loadSlice.reducer,
  user: userSlice.reducer,
});
// create the Redux store using the root reducer
const store = configureStore({
  reducer: rootReducer,
});

export default store;
