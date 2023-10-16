import { createSlice, Draft, PayloadAction } from "@reduxjs/toolkit";

const initialState: any = {
  excelUnloadings: null,
  excelUnloadingsCount: null,
  limit: JSON.parse(localStorage.getItem("pageLimit") as string) || 10,
  excelUnloadingsInputValues: {
    date: "",
    type: null,
    employee: null,
    customer: null,
    moreThanMin: null,
  },
  page: 1,
};

export const excelUnloadingsSlice = createSlice({
  name: "excelUnloadings",
  initialState,
  reducers: {
    reducerExcelUnloadings: (state: Draft<any>, action: PayloadAction<any>) => {
      state.excelUnloadings = action.payload.data.data || [];
      state.excelUnloadingsCount = action.payload.data.count;
      state.limit = action.payload.limit;
      state.page = action.payload.page;
    },
    reducerExcelUnloadingsFilters: (
      state: Draft<any>,
      action: PayloadAction<any>
    ) => {
      state.filters = action.payload.data;
    },
    reducerExcelUnloadingsInputValues: (
      state: Draft<any>,
      action: PayloadAction<any>
    ) => {
      state.excelUnloadingsInputValues = action.payload;
    },
  },
});

export const {
  reducerExcelUnloadingsInputValues,
  reducerExcelUnloadingsFilters,
  reducerExcelUnloadings,
} = excelUnloadingsSlice.actions;

export default excelUnloadingsSlice.reducer;
