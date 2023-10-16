import { createSlice, Draft, PayloadAction } from "@reduxjs/toolkit";
import { startOfMonth, subMonths } from "date-fns";
import moment from "moment";

import { stateDate } from "../../../../utils/formatDate";

const initialState: any = {
  reports: null,
  reportsCount: null,
  limit: JSON.parse(localStorage.getItem("pageLimit") as string) || 10,
  page: 1,
  expiredReportsInputValues: {
    fromDate: stateDate(startOfMonth(subMonths(new Date(), 1))),
    toDate: stateDate(new Date()),
    contracts: [],
    statuses: [],
    projects: [],
    merchs: [],
    chains: [],
    svs: [],
  },
  formattedDateFrom: moment(
    stateDate(startOfMonth(subMonths(new Date(), 1)))
  ).format("DD/MM/YYYY"),
  formattedDateTo: moment(stateDate(new Date())).format("DD/MM/YYYY"),
  expiredReportsSettings: JSON.parse(
    localStorage.getItem("selectedExpiredReportsTabs") as string
  ) || [
    "date",
    "contract",
    "chain",
    "address",
    "project",
    "sv",
    "merch",
    "merchStatus",
  ],
};

export const reportsSlice = createSlice({
  name: "expiredReports",
  initialState,
  reducers: {
    reducerExpiredReports: (state: Draft<any>, action: PayloadAction<any>) => {
      state.reports = action.payload.data.data || [];
      state.expiredReportsCount = action.payload.data.count;
      state.limit = action.payload.limit;
      state.page = action.payload.page;
      state.checkboxes = action.payload.data.data?.reduce(
        (acc: any, report: any) => {
          acc[report.expiredReport.id] = false;
          return acc;
        },
        {}
      );
    },
    reducerDeletedExpiredReports: (
      state: Draft<any>,
      action: PayloadAction<any>
    ) => {
      state.reportsId = action.payload;
    },
    reducerExpiredReportsInputValues: (
      state: Draft<any>,
      action: PayloadAction<any>
    ) => {
      state.expiredReportsInputValues = action.payload;
      state.formattedDateFrom = moment(action.payload.fromDate).format(
        "DD/MM/YYYY"
      );
      state.formattedDateTo = moment(action.payload.toDate).format(
        "DD/MM/YYYY"
      );
    },
    reducerExpiredReportsStatus: (
      state: Draft<any>,
      action: PayloadAction<any>
    ) => {
      state.status = action?.payload?.status;
      state.requestPurpose = action?.payload?.requestPurpose;
    },
    reducerExpiredReportsSettings: (
      state: Draft<any>,
      action: PayloadAction<any>
    ) => {
      state.expiredReportsSettings = action.payload;
    },
  },
});

export const {
  reducerExpiredReportsInputValues,
  reducerExpiredReportsSettings,
  reducerDeletedExpiredReports,
  reducerExpiredReportsStatus,
  reducerExpiredReports,
} = reportsSlice.actions;

export default reportsSlice.reducer;
