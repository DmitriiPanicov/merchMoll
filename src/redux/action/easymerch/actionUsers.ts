import axios from "axios";

import { AppDispatch } from "../../reducer/store";
import {
  reducerSelectedContracts,
  reducerGetUsersSelect,
  reducerUsersStatus,
  reducerGetUsers,
} from "../../reducer/easymerch/reducers/reducerUsers";
import { getToken } from "../axiosToken";

const BASE_URL = process.env.REACT_APP_BASE_URL;

export const actionGetUsers =
  (limit: any, offset: any) =>
  async (dispatch: AppDispatch, getState: () => any) => {
    const { token } = await getToken();
    axios.defaults.headers.common["Authorization"] = token;

    const store = getState();
    const filter = store.easymerch.users.usersInputValues;

    const response = await axios.post(`${BASE_URL}/json/em/user/users`, {
      limit,
      offset,
      contractType: 0,
      ...filter,
    });

    dispatch(reducerGetUsers({ data: response.data, limit, offset: 0 }));
  };

export const actionGetUsersSelect = () => async (dispatch: AppDispatch) => {
  const { token } = await getToken();
  axios.defaults.headers.common["Authorization"] = token;

  const response = await axios.get(`${BASE_URL}/json/auth/roles`);

  dispatch(reducerGetUsersSelect({ data: response.data }));
};

export const actionSendRoutesToEasyMerch =
  (contract: any, selectedUsers: any) => async (dispatch: AppDispatch) => {
    const { token } = await getToken();
    axios.defaults.headers.common["Authorization"] = token;

    try {
      if (selectedUsers && selectedUsers.length >= 1) {
        const response = await axios.post(
          `${BASE_URL}/json/em/route/sendRoutes/${contract}`,
          selectedUsers
        );

        dispatch(reducerUsersStatus(response.status));
      } else {
        dispatch(reducerUsersStatus("emptyList"));
      }

      dispatch(reducerSelectedContracts([]));
    } catch (err) {
      dispatch(reducerSelectedContracts([]));
      dispatch(reducerUsersStatus(0));
    }
  };
