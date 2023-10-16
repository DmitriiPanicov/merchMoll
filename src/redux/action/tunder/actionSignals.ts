import axios from "axios";

import { reducerGetSignals } from "../../reducer/tunder/reducers/reducerSignals";
import { AppDispatch } from "../../reducer/store";
import { getToken } from "../axiosToken";

const BASE_URL = process.env.REACT_APP_BASE_URL;

export const actionGetSignals =
  (limit: any, offset: any) => async (dispatch: AppDispatch) => {
    const { token } = await getToken();
    axios.defaults.headers.common["Authorization"] = token;

    const response = await axios.get(
      `${BASE_URL}/json/tander/signals?offset=${offset}&limit=${limit}`
    );
    dispatch(reducerGetSignals({ data: response.data, limit, offset }));
  };
