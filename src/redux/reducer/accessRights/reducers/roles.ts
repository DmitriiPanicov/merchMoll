import { createSlice, Draft, PayloadAction } from "@reduxjs/toolkit";

const initialState: any = {
  roles: null,
  roleRights: null,
  allRolesRights: null,
  rolesCount: null,
  limit: JSON.parse(localStorage.getItem("pageLimit") as string) || 10,
  page: 1,
};

export const rolesSlice = createSlice({
  name: "roles",
  initialState,
  reducers: {
    reducerRoles: (state: Draft<any>, action: PayloadAction<any>) => {
      state.roles = action.payload;
      state.rolesCount = Object.keys(action.payload).length;
    },
    reducerRolesRights: (state: Draft<any>, action: PayloadAction<any>) => {
      state.allRolesRights = action.payload.availableClaims;
      state.roleRights = action.payload.activeClaims;
    },
  },
});

export const { reducerRolesRights, reducerRoles } = rolesSlice.actions;

export default rolesSlice.reducer;
