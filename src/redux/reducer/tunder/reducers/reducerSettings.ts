import { createSlice, Draft, PayloadAction } from '@reduxjs/toolkit';

const initialState: any = {
  settings: null,
  settingsCount: null,
  limit: 10,
  offset: 0,
};

export const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    reducerGetSettings: (state: Draft<any>, action: PayloadAction<any>) => {
      state.settings = action.payload.data;
      state.settingsCount = action.payload.data.length;
      state.limit = action.payload.limit;
      state.offset = action.payload.offset;
    },
  },
});

export const { reducerGetSettings } = settingsSlice.actions;

export default settingsSlice.reducer;
