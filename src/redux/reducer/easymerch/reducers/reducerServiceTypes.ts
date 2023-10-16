import { createSlice, Draft, PayloadAction } from "@reduxjs/toolkit";

const initialState: any = {
  serviceTypes: null,
  serviceTypesCount: null,
  limit: JSON.parse(localStorage.getItem("pageLimit") as string) || 10,
  offset: 0,
};

export const serviceTypesSlice = createSlice({
  name: "serviceTypes",
  initialState,
  reducers: {
    reducerGetServiceTypes: (state: Draft<any>, action: PayloadAction<any>) => {
      state.serviceTypes = action.payload.data.data || [];
      state.serviceTypesCount = action.payload.data.count;
      state.limit = action.payload.limit;
      state.offset = action.payload.offset;
    },
    reducerGetServiceTypesSelect: (
      state: Draft<any>,
      action: PayloadAction<any>
    ) => {
      state.selectContact = action.payload.data;
    },
    reducerServiceTypesStatus: (
      state: Draft<any>,
      action: PayloadAction<any>
    ) => {
      state.serviceStatus = action.payload;
    },
  },
});

export const {
  reducerGetServiceTypesSelect,
  reducerServiceTypesStatus,
  reducerGetServiceTypes,
} = serviceTypesSlice.actions;

export default serviceTypesSlice.reducer;
