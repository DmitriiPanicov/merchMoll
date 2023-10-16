import { createSlice, Draft, PayloadAction } from "@reduxjs/toolkit";

const initialState: any = {
  signals: null,
  signalsCount: null,
  limit: JSON.parse(localStorage.getItem("pageLimit") as string) || 10,
  offset: 0,
};

export const signalsSlice = createSlice({
  name: "signals",
  initialState,
  reducers: {
    reducerGetSignals: (state: Draft<any>, action: PayloadAction<any>) => {
      state.signals = action.payload.data.data;
      state.signalsCount = action.payload.data.count;
      state.limit = action.payload.limit;
      state.offset = action.payload.offset;
    },
  },
});

export const { reducerGetSignals } = signalsSlice.actions;

export default signalsSlice.reducer;
