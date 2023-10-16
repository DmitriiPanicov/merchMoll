import axios from "axios";

import {
  reducerExcelUnloadingsFilters,
  reducerExcelUnloadings,
} from "../../reducer/unloadings/reducers/excelUnloadings";
import { AppDispatch } from "../../reducer/store";
import { getToken } from "../axiosToken";

const BASE_URL = process.env.REACT_APP_BASE_URL;

export const actionGetExcelUnloadings =
  (limit: any, page: any) =>
  async (dispatch: AppDispatch, getState: () => any) => {
    const { token } = await getToken();
    axios.defaults.headers.common["Authorization"] = token;

    const store = getState();
    const filter = store.unloadings.excelUnloadings.excelUnloadingsInputValues;

    const response = await axios.post(`${BASE_URL}/json/orders/excel`, {
      limit,
      page,
      ...filter,
    });

    dispatch(reducerExcelUnloadings({ data: response.data, limit, page: 1 }));
  };

export const actionGetExcelUnloadingsFilters =
  () => async (dispatch: AppDispatch) => {
    const { token } = await getToken();
    axios.defaults.headers.common["Authorization"] = token;

    const response = await axios.get(`${BASE_URL}/json/orders/excel/filters`);

    dispatch(reducerExcelUnloadingsFilters({ data: response.data }));
  };
