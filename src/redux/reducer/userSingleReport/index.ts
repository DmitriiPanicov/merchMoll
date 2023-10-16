import { combineReducers, Reducer, AnyAction } from "@reduxjs/toolkit";

import reducerUserSingleReport from "./reducers/userSingleReport";
import reducerVisitScheduleData from "./reducers/visitSchedule";

interface IUserSingleReportReducers {
  userSingleReport: Reducer<any, AnyAction>;
  visitSchedule: Reducer<any, AnyAction>;
}

const UserSingleReportStore = combineReducers<IUserSingleReportReducers>({
  userSingleReport: reducerUserSingleReport,
  visitSchedule: reducerVisitScheduleData,
});

export default UserSingleReportStore;
