import axios from "axios";

import {
  reducerCronUnloadingsFilters,
  reducerCronUnloadings,
} from "../../reducer/unloadings/reducers/cronUnloadings";
import { AppDispatch } from "../../reducer/store";
import { getToken } from "../axiosToken";

const BASE_URL = process.env.REACT_APP_BASE_URL;

export const actionGetCronUnloadings =
  (limit: any, page: any) =>
  async (dispatch: AppDispatch, getState: () => any) => {
    const { token } = await getToken();
    axios.defaults.headers.common["Authorization"] = token;

    const store = getState();
    const filter = store.unloadings.cronUnloadings.cronUnloadingsInputValues;

    const response = await axios.post(`${BASE_URL}/json/orders/cron`, {
      limit,
      page,
      ...filter,
    });

    dispatch(reducerCronUnloadings({ data: response.data, limit, page: 1 }));
  };

export const actionGetCronUnloadingsFilters =
  () => async (dispatch: AppDispatch) => {
    const { token } = await getToken();
    axios.defaults.headers.common["Authorization"] = token;

    const response = await axios.get(
      `${BASE_URL}/json/orders/cron/filters`
    );

    dispatch(reducerCronUnloadingsFilters({ data: response.data }));
  };
