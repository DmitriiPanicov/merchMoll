import { createSlice, Draft, PayloadAction } from "@reduxjs/toolkit";

const initialState: any = {
  users: null,
  usersCount: null,
  limit: JSON.parse(localStorage.getItem("pageLimit") as string) || 10,
  offset: 0,
  usersInputValues: {
    idMol: "",
    login: "",
    fullname: "",
    emPersonId: "",
    emId: "",
    emLogin: "",
    emName: "",
    role: null,
  },
};

export const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    reducerGetUsers: (state: Draft<any>, action: PayloadAction<any>) => {
      state.users = action.payload.data.data || [];
      state.usersCount = action.payload.data.count;
      state.limit = action.payload.limit;
      state.offset = action.payload.offset;
    },
    reducerGetUsersSelect: (state: Draft<any>, action: PayloadAction<any>) => {
      state.rolesOptions = action.payload.data
        ?.map((user: any) => ({
          value: user?.role?.id,
          label: user?.role?.name,
        }))
        ?.sort((a: any, b: any) => a.label.localeCompare(b.label));
    },
    reducerUsersInputValues: (
      state: Draft<any>,
      action: PayloadAction<any>
    ) => {
      state.usersInputValues = action.payload;
    },
    reducerSelectedContracts: (
      state: Draft<any>,
      action: PayloadAction<any>
    ) => {
      state.selectedUsers = action.payload;
    },
    reducerUsersStatus: (state: Draft<any>, action: PayloadAction<any>) => {
      state.usersRequestStatus = action.payload;
    },
  },
});

export const {
  reducerSelectedContracts,
  reducerUsersInputValues,
  reducerGetUsersSelect,
  reducerUsersStatus,
  reducerGetUsers,
} = usersSlice.actions;

export default usersSlice.reducer;
