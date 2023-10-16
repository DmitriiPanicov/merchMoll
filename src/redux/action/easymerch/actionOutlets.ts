import axios from "axios";

import {
  reducerGetOutlets,
  reducerUnloadOutlets,
} from "../../reducer/easymerch/reducers/reducerOutlets";
import { AppDispatch } from "../../reducer/store";
import { getToken } from "../axiosToken";

const BASE_URL = process.env.REACT_APP_BASE_URL;

export const actionGetOutlets =
  (limit: any, offset: any) =>
  async (dispatch: AppDispatch, getState: () => any) => {
    const { token } = await getToken();
    axios.defaults.headers.common["Authorization"] = token;

    const store = getState();
    const filter = store.easymerch.outlets.outletsInputValues;

    const response = await axios.post(`${BASE_URL}/json/em/pos/poses`, {
      limit,
      offset,
      contractType: 0,
      ...filter,
    });

    dispatch(reducerGetOutlets({ data: response.data, limit, offset: 0 }));
  };

export const actionUnloadOutlets =
  (limit: any, offset: any, filter?: any) => async (dispatch: AppDispatch) => {
    const { token } = await getToken();
    axios.defaults.headers.common["Authorization"] = token;

    try {
      const response = await axios.post(`${BASE_URL}/json/em/pos/export`, {
        limit,
        offset,
        contractType: 0,
        ...filter,
      });

      dispatch(
        reducerUnloadOutlets({ data: response.data, status: response.status })
      );
    } catch (err) {
      dispatch(reducerUnloadOutlets({ data: {}, status: 0 }));
    }
  };
