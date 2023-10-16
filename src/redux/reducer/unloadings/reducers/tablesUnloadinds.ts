import { createSlice, Draft, PayloadAction } from "@reduxjs/toolkit";

const initialState: any = {
  tablesUnloadings: null,
  tablesUnloadingsCount: null,
  limit: JSON.parse(localStorage.getItem("pageLimit") as string) || 10,
  tablesUnloadingsInputValues: {
    date: "",
    type: null,
    employee: null,
    moreThanMin: null,
  },
  page: 1,
};

export const tablesUnloadingsSlice = createSlice({
  name: "tablesUnloadings",
  initialState,
  reducers: {
    reducerTablesUnloadings: (
      state: Draft<any>,
      action: PayloadAction<any>
    ) => {
      state.tablesUnloadings = action.payload.data.data || [];
      state.tablesUnloadingsCount = action.payload.data.count;
      state.limit = action.payload.limit;
      state.page = action.payload.page;
    },
    reducerTablesUnloadingsFilters: (
      state: Draft<any>,
      action: PayloadAction<any>
    ) => {
      state.filters = action.payload.data;
    },
    reducerTablesUnloadingsInputValues: (
      state: Draft<any>,
      action: PayloadAction<any>
    ) => {
      state.tablesUnloadingsInputValues = action.payload;
    },
  },
});

export const {
  reducerTablesUnloadingsInputValues,
  reducerTablesUnloadingsFilters,
  reducerTablesUnloadings,
} = tablesUnloadingsSlice.actions;

export default tablesUnloadingsSlice.reducer;
