import { createSlice, Draft, PayloadAction } from "@reduxjs/toolkit";

import { createOptions } from "../../../../utils/createOptions";

const initialState: any = {
  scheduleData: null,
  visitReportsCount: null,
  contract: null,
  limit: JSON.parse(localStorage.getItem("pageLimit") as string) || 10,
  page: 1,
  visitScheduleInputValues: {
    contract: {
      id: 379,
    },
    merchs: null,
    regions: null,
    statuses: null,
    areas: null,
    chains: null,
    address: null,
  },
  isOpenHistory: false,
  isFilteredByTrainee: false,
};

export const visitScheduleSlice = createSlice({
  name: "visitSchedule",
  initialState,
  reducers: {
    reducerVisitScheduleData: (
      state: Draft<any>,
      action: PayloadAction<any>
    ) => {
      state.scheduleData = action.payload.data.data.data || [];
      state.visitReportsCount = action.payload.data.data.count;
      state.contract = action.payload.data.contract;
      state.limit = action.payload.limit;
      state.page = action.payload.page;
    },
    reducerGetScheduleFilters: (
      state: Draft<any>,
      action: PayloadAction<any>
    ) => {
      state.scheduleFilters = action.payload.data;
      state.scheduleContractOptions = action.payload.data[0]?.contracts
        ?.map((option: any) => ({
          value: option.id >= 0 ? option.id : option,
          label: option.name || option,
        }))
        ?.sort((a: any, b: any) => a.label.localeCompare(b.label));
      state.scheduleRegionsOptions = createOptions(
        action.payload.data,
        "regions"
      );
      state.scheduleChainsOptions = createOptions(
        action.payload.data,
        "chains"
      );
      state.scheduleMerchsOptions = createOptions(
        action.payload.data,
        "merchs"
      );
      state.scheduleAreasOptions = createOptions(action.payload.data, "areas");
    },
    reducerVisitScheduleInputValues: (
      state: Draft<any>,
      action: PayloadAction<any>
    ) => {
      state.visitScheduleInputValues = action.payload;
    },
    reducerVisitScheduleHistory: (
      state: Draft<any>,
      action: PayloadAction<any>
    ) => {
      state.isOpenHistory = action.payload;
    },
    reducerVisitSchedulaStatus: (
      state: Draft<any>,
      action: PayloadAction<any>
    ) => {
      state.scheduleStatus = action?.payload;
    },
    reducerVisitScheduleTrainee: (
      state: Draft<any>,
      action: PayloadAction<any>
    ) => {
      state.isFilteredByTrainee = action?.payload;
    },
  },
});

export const {
  reducerVisitScheduleInputValues,
  reducerVisitScheduleTrainee,
  reducerVisitScheduleHistory,
  reducerVisitSchedulaStatus,
  reducerGetScheduleFilters,
  reducerVisitScheduleData,
} = visitScheduleSlice.actions;

export default visitScheduleSlice.reducer;
