import { combineReducers, Reducer, AnyAction } from "@reduxjs/toolkit";

import reducerCustomerList from "./reducers/customersList";
import reducerRoles from "./reducers/roles";

interface UnloadingsReducers {
  customerList: Reducer<any, AnyAction>;
  roles: Reducer<any, AnyAction>;
}

const RolesStore = combineReducers<UnloadingsReducers>({
  roles: reducerRoles,
  customerList: reducerCustomerList,
});

export default RolesStore;
