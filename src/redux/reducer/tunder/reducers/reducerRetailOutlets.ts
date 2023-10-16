import { createSlice, Draft, PayloadAction } from "@reduxjs/toolkit";

const initialState: any = {
  retailOutlets: null,
  retailOutletsCount: null,
  limit: JSON.parse(localStorage.getItem("pageLimit") as string) || 10,
  offset: 0,
};

export const retailOutletsSlice = createSlice({
  name: "retailOutlets",
  initialState,
  reducers: {
    reducerGetRetailOutlets: (
      state: Draft<any>,
      action: PayloadAction<any>
    ) => {
      state.retailOutlets = action.payload.data.data;
      state.retailOutletsCount = action.payload.data.count;
      state.limit = action.payload.limit;
      state.offset = action.payload.offset;
    },
    reducerRetailOutletsStatus: (
      state: Draft<any>,
      action: PayloadAction<any>
    ) => {
      state.status = action.payload;
    },
  },
});

export const { reducerGetRetailOutlets, reducerRetailOutletsStatus } =
  retailOutletsSlice.actions;

export default retailOutletsSlice.reducer;
