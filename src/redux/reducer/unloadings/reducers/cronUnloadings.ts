import { createSlice, Draft, PayloadAction } from "@reduxjs/toolkit";

const initialState: any = {
  cronUnloadings: null,
  cronUnloadingsCount: null,
  limit: JSON.parse(localStorage.getItem("pageLimit") as string) || 10,
  cronUnloadingsInputValues: {
    date: "",
    type: null,
    moreThanMin: null,
  },
  page: 1,
};

export const cronUnloadingsSlice = createSlice({
  name: "cronUnloadings",
  initialState,
  reducers: {
    reducerCronUnloadings: (state: Draft<any>, action: PayloadAction<any>) => {
      state.cronUnloadings = action.payload.data.data || [];
      state.cronUnloadingsCount = action.payload.data.count;
      state.limit = action.payload.limit;
      state.page = action.payload.page;
    },
    reducerCronUnloadingsFilters: (
      state: Draft<any>,
      action: PayloadAction<any>
    ) => {
      state.filters = action.payload.data;
    },
    reducerCronUnloadingsInputValues: (
      state: Draft<any>,
      action: PayloadAction<any>
    ) => {
      state.cronUnloadingsInputValues = action.payload;
    },
  },
});

export const {
  reducerCronUnloadingsInputValues,
  reducerCronUnloadingsFilters,
  reducerCronUnloadings,
} = cronUnloadingsSlice.actions;

export default cronUnloadingsSlice.reducer;
