import axios from "axios";

import {
  reducerRolesRights,
  reducerRoles,
} from "../../reducer/accessRights/reducers/roles";
import { AppDispatch } from "../../reducer/store";
import { getToken } from "../axiosToken";

const BASE_URL = process.env.REACT_APP_BASE_URL;

export const actionGetRoles = () => async (dispatch: AppDispatch) => {
  const { token } = await getToken();
  axios.defaults.headers.common["Authorization"] = token;

  const response = await axios.get(`${BASE_URL}/json/auth/roles`);

  dispatch(reducerRoles(response.data));
};

export const actionGetRolesRights =
  (id: number) => async (dispatch: AppDispatch) => {
    const { token } = await getToken();
    axios.defaults.headers.common["Authorization"] = token;

    const response = await axios.get(
      `${BASE_URL}/json/auth/claim/role?id=${id}`
    );

    dispatch(reducerRolesRights(response.data));
  };

export const actionDeleteRight =
  (id: number, data: any) => async (dispatch: AppDispatch) => {
    const { token } = await getToken();
    axios.defaults.headers.common["Authorization"] = token;

    const response = await axios.delete(
      `${BASE_URL}/json/auth/claim/role?id=${id}`,
      { data }
    );

    dispatch(reducerRolesRights(response.data));
  };

export const actionAddRight =
  (id: number, data: any) => async (dispatch: AppDispatch) => {
    const { token } = await getToken();
    axios.defaults.headers.common["Authorization"] = token;

    const response = await axios.patch(
      `${BASE_URL}/json/auth/claim/role?id=${id}`,
      data
    );

    dispatch(reducerRolesRights(response.data));
  };

export const actionUpdateClaimDescription =
  (id: number, data: any) => async (dispatch: AppDispatch) => {
    const { token } = await getToken();
    axios.defaults.headers.common["Authorization"] = token;

    await axios.patch(`${BASE_URL}/json/auth/claim/description?id=${id}`, data);
  };
