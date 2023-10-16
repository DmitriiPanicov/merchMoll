import { createSlice, Draft, PayloadAction } from "@reduxjs/toolkit";

const initialState: any = {
  theme:
    (typeof localStorage !== "undefined" && localStorage.getItem("theme")) ||
    "purple",
};

export const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    reducerTheme: (state: Draft<any>, action: PayloadAction<any>) => {
      state.theme = action.payload;
    },
  },
});

export const { reducerTheme } = themeSlice.actions;

export default themeSlice.reducer;
