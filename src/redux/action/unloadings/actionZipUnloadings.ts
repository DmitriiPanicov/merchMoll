import axios from "axios";

import {
  reducerZipUnloadingsFilters,
  reducerZipUnloadings,
} from "../../reducer/unloadings/reducers/zipUnloadings";
import { AppDispatch } from "../../reducer/store";
import { getToken } from "../axiosToken";

const BASE_URL = process.env.REACT_APP_BASE_URL;

export const actionGetZipUnloadings =
  (limit: any, page: any) =>
  async (dispatch: AppDispatch, getState: () => any) => {
    const { token } = await getToken();
    axios.defaults.headers.common["Authorization"] = token;

    const store = getState();
    const filter = store.unloadings.zipUnloadings.zipUnloadingsInputValues;

    const response = await axios.post(`${BASE_URL}/json/orders/zip`, {
      limit,
      page,
      ...filter,
    });

    dispatch(reducerZipUnloadings({ data: response.data, limit, page: 1 }));
  };

export const actionGetZipUnloadingsFilters =
  () => async (dispatch: AppDispatch) => {
    const { token } = await getToken();
    axios.defaults.headers.common["Authorization"] = token;

    const response = await axios.get(`${BASE_URL}/json/orders/zip/filters`);

    dispatch(reducerZipUnloadingsFilters({ data: response.data }));
  };
