import { createSlice, Draft, PayloadAction } from "@reduxjs/toolkit";

const initialState: any = {
  zipUnloadings: null,
  zipUnloadingsCount: null,
  limit: JSON.parse(localStorage.getItem("pageLimit") as string) || 10,
  zipUnloadingsInputValues: {
    date: "",
    type: null,
    employee: null,
    customer: null,
    moreThanMin: null,
  },
  page: 1,
};

export const zipUnloadingsSlice = createSlice({
  name: "zipUnloadings",
  initialState,
  reducers: {
    reducerZipUnloadings: (state: Draft<any>, action: PayloadAction<any>) => {
      state.zipUnloadings = action.payload.data.data || [];
      state.zipUnloadingsCount = action.payload.data.count;
      state.limit = action.payload.limit;
      state.page = action.payload.page;
    },
    reducerZipUnloadingsFilters: (
      state: Draft<any>,
      action: PayloadAction<any>
    ) => {
      state.filters = action.payload.data;
    },
    reducerZipUnloadingsInputValues: (
      state: Draft<any>,
      action: PayloadAction<any>
    ) => {
      state.zipUnloadingsInputValues = action.payload;
    },
  },
});

export const {
  reducerZipUnloadingsInputValues,
  reducerZipUnloadingsFilters,
  reducerZipUnloadings,
} = zipUnloadingsSlice.actions;

export default zipUnloadingsSlice.reducer;
