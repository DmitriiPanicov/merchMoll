import { createSlice, Draft, PayloadAction } from "@reduxjs/toolkit";

const initialState: any = {
  reports: null,
  reportsCount: null,
  limit: JSON.parse(localStorage.getItem("pageLimit") as string) || 10,
  offset: 0,
  reportsInputValues: {
    ids: [],
    emId: "",
    emName: "",
    emEngineName: "",
    emEngineCode: "",
  },
};

export const reportsSlice = createSlice({
  name: "reports",
  initialState,
  reducers: {
    reducerGetReports: (state: Draft<any>, action: PayloadAction<any>) => {
      state.reports = action.payload.data.data || [];
      state.reportsCount = action.payload.data.count;
      state.limit = action.payload.limit;
      state.offset = action.payload.offset;
    },
    reducerReportsInputValues: (
      state: Draft<any>,
      action: PayloadAction<any>
    ) => {
      state.reportsInputValues = action.payload;
    },
  },
});

export const { reducerReportsInputValues, reducerGetReports } =
  reportsSlice.actions;

export default reportsSlice.reducer;
