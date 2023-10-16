import { combineReducers, Reducer, AnyAction } from "@reduxjs/toolkit";

import reducerUser from "./reducers/reducerUser";

interface CustomerReducers {
  user: Reducer<any, AnyAction>;
}

const UserStore = combineReducers<CustomerReducers>({
  user: reducerUser,
});

export default UserStore;
