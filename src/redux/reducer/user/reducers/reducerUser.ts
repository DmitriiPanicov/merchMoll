import { createSlice, Draft, PayloadAction } from "@reduxjs/toolkit";

const initialState: any = {
  data: JSON.parse(localStorage.getItem("userData") as string) || null,
  isOpenSidebar:
    JSON.parse(localStorage.getItem("isOpenSidebar") as string) || false,
  isOpenUnloadings:
    JSON.parse(localStorage.getItem("isOpenUnloadings") as string) || false,
  contractsLength: JSON.parse(localStorage.getItem("userData") as string)
    ?.settings?.contracts?.length,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    reducerUser: (state: Draft<any>, action: PayloadAction<any>) => {
      state.data = action.payload;
    },
    reducerLoginStatus: (state: Draft<any>, action: PayloadAction<any>) => {
      state.loginStatus = action.payload;
    },
    reducerSidebar: (state: Draft<any>, action: PayloadAction<any>) => {
      state.isOpenSidebar = action.payload.isOpenSidebar;
      state.isOpenUnloadings = action.payload.isOpenUnloadings;
    },
  },
});

export const { reducerLoginStatus, reducerSidebar, reducerUser } =
  userSlice.actions;

export default userSlice.reducer;
