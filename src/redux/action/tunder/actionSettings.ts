import axios from "axios";

import { reducerGetSettings } from "../../reducer/tunder/reducers/reducerSettings";
import { AppDispatch } from "../../reducer/store";
import { getToken } from "../axiosToken";

const BASE_URL = process.env.REACT_APP_BASE_URL;

export const actionPostSettings = (data: any) => async () => {
  const { token } = await getToken();
  axios.defaults.headers.common["Authorization"] = token;

  axios.post(`${BASE_URL}/json/tander/updateAddresses`, data);
};

export const actionGetSettings =
  (limit: any, offset: any) => async (dispatch: AppDispatch) => {
    const { token } = await getToken();
    axios.defaults.headers.common["Authorization"] = token;

    const response = await axios.get(`${BASE_URL}/json/tander/addresses`);
    dispatch(reducerGetSettings({ data: response.data, limit, offset }));
  };
