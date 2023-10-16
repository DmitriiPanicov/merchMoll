import axios from "axios";

import {
  reducerClientContracts,
  reducerClientSettings,
  reducerClientRegions,
  reducerClientFilters,
} from "../../reducer/accessRights/reducers/customersList";
import { AppDispatch } from "../../reducer/store";
import { getToken } from "../axiosToken";

const BASE_URL = process.env.REACT_APP_BASE_URL;

export const actionGetClientSettings =
  (id: any) => async (dispatch: AppDispatch) => {
    const { token } = await getToken();
    axios.defaults.headers.common["Authorization"] = token;

    const response = await axios.get(
      `${BASE_URL}/json/auth/customer/${id}/settings`
    );

    dispatch(reducerClientContracts(response.data.settings.contracts));
    dispatch(reducerClientRegions(response.data.settings.regions));
    dispatch(reducerClientSettings(response.data.settings));
    dispatch(reducerClientFilters(response.data));
  };

export const actionUpdateClientContracts =
  (id: any, data: any) => async (dispatch: AppDispatch) => {
    const { token } = await getToken();
    axios.defaults.headers.common["Authorization"] = token;

    const response = await axios.patch(
      `${BASE_URL}/json/auth/customer/${id}/contracts`,
      data
    );

    dispatch(reducerClientContracts(response.data));
  };

export const actionUpdateClientRegions =
  (id: any, data: any) => async (dispatch: AppDispatch) => {
    const { token } = await getToken();
    axios.defaults.headers.common["Authorization"] = token;

    const response = await axios.patch(
      `${BASE_URL}/json/auth/customer/${id}/regions`,
      data
    );

    dispatch(reducerClientRegions(response.data));
  };

export const actionUpdateClientSettings =
  (id: any, data: any) => async (dispatch: AppDispatch) => {
    const { token } = await getToken();
    axios.defaults.headers.common["Authorization"] = token;

    const response = await axios.patch(
      `${BASE_URL}/json/auth/customer/${id}/settings`,
      data
    );
    
    dispatch(reducerClientSettings(response.data));
  };
