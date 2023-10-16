import axios from "axios";

import {
  reducerVisitSchedulaStatus,
  reducerVisitScheduleData,
} from "../../reducer/userSingleReport/reducers/visitSchedule";
import { AppDispatch } from "../../reducer/store";
import { getToken } from "../axiosToken";

const BASE_URL = process.env.REACT_APP_BASE_URL;

export const actionGetVisitScheduleData =
  (limit: any, page: any) =>
  async (dispatch: AppDispatch, getState: () => any) => {
    const { token } = await getToken();
    axios.defaults.headers.common["Authorization"] = token;

    const store = getState();
    const filter =
      store.userSingleReport.visitSchedule.visitScheduleInputValues;

    const response = await axios.post(`${BASE_URL}/json/contracts/schedule`, {
      ...filter,
      limit,
      page,
    });

    dispatch(reducerVisitScheduleData({ data: response.data, limit, page: 1 }));
  };

export const actionUnloadScheduleInExcel =
  () => async (dispatch: AppDispatch) => {
    const { token } = await getToken();
    axios.defaults.headers.common["Authorization"] = token;

    try {
      const response = await axios.post(
        `${BASE_URL}/json/contracts/schedule/export`
      );

      dispatch(reducerVisitSchedulaStatus(response.status));
    } catch (err) {
      dispatch(reducerVisitSchedulaStatus(0));
    }
  };
