import axios from "axios";

import { reducerGetReports } from "../../reducer/easymerch/reducers/reducerReports";
import { AppDispatch } from "../../reducer/store";
import { getToken } from "../axiosToken";

const BASE_URL = process.env.REACT_APP_BASE_URL;

export const actionGetReports =
  (limit: any, offset: any) =>
  async (dispatch: AppDispatch, getState: () => any) => {
    const { token } = await getToken();
    axios.defaults.headers.common["Authorization"] = token;

    const store = getState();
    const filter = store.easymerch.reports.reportsInputValues;

    const response = await axios.post(
      `${BASE_URL}/json/em/reportType/reportTypes`,
      {
        limit,
        offset,
        contractType: 0,
        ...filter,
      }
    );

    dispatch(reducerGetReports({ data: response.data, limit, offset: 0 }));
  };
