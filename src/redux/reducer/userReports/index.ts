import { combineReducers, Reducer, AnyAction } from "@reduxjs/toolkit";

import reducerExpiredReports from "./reducers/expiredReports";
import reducerUserReports from "./reducers/userReports";

interface UserReportsReducers {
  expiredReports: Reducer<any, AnyAction>;
  userReports: Reducer<any, AnyAction>;
}

const UserReportsStore = combineReducers<UserReportsReducers>({
  expiredReports: reducerExpiredReports,
  userReports: reducerUserReports,
});

export default UserReportsStore;
