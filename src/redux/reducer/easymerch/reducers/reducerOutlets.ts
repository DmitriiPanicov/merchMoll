import { createSlice, Draft, PayloadAction } from "@reduxjs/toolkit";

const initialState: any = {
  outlets: null,
  outletsCount: null,
  limit: JSON.parse(localStorage.getItem("pageLimit") as string) || 10,
  offset: 0,
  outletsInputValues: {
    idMol: "",
    molNetwork: "",
    molAddress: "",
    idEm: "",
    emNetwork: "",
    emAddress: "",
  },
};

export const outletsSlice = createSlice({
  name: "outlets",
  initialState,
  reducers: {
    reducerGetOutlets: (state: Draft<any>, action: PayloadAction<any>) => {
      state.outlets = action.payload.data.data || [];
      state.outletsCount = action.payload.data.count;
      state.limit = action.payload.limit;
      state.offset = action.payload.offset;
    },
    reducerUnloadOutlets: (state: Draft<any>, action: PayloadAction<any>) => {
      state.unloadOutletsData = action.payload.data;
      state.status = action.payload.status;
    },
    reducerOutletsInputValues: (
      state: Draft<any>,
      action: PayloadAction<any>
    ) => {
      state.outletsInputValues = action.payload;
    },
  },
});

export const {
  reducerOutletsInputValues,
  reducerUnloadOutlets,
  reducerGetOutlets,
} = outletsSlice.actions;

export default outletsSlice.reducer;
