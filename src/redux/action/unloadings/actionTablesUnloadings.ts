import axios from "axios";

import {
  reducerTablesUnloadings,
  reducerTablesUnloadingsFilters,
} from "../../reducer/unloadings/reducers/tablesUnloadinds";
import { AppDispatch } from "../../reducer/store";
import { getToken } from "../axiosToken";

const BASE_URL = process.env.REACT_APP_BASE_URL;

export const actionGetTablesUnloadings =
  (limit: any, page: any) =>
  async (dispatch: AppDispatch, getState: () => any) => {
    const { token } = await getToken();
    axios.defaults.headers.common["Authorization"] = token;

    const store = getState();
    const filter = store.unloadings.tablesUnloadings.tablesUnloadingsInputValues;

    const response = await axios.post(`${BASE_URL}/json/orders/payrolls`, {
      limit,
      page,
      ...filter,
    });

    dispatch(reducerTablesUnloadings({ data: response.data, limit, page: 1 }));
  };

export const actionGetTablesUnloadingsFilters =
  () => async (dispatch: AppDispatch) => {
    const { token } = await getToken();
    axios.defaults.headers.common["Authorization"] = token;

    const response = await axios.get(
      `${BASE_URL}/json/orders/payrolls/filters`
    );

    dispatch(reducerTablesUnloadingsFilters({ data: response.data }));
  };
