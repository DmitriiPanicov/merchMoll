import axios from "../axiosConfig";

import {
  reducerIntegrationErrorsStatus,
  reducerGetIntegrationErrors,
} from "../../reducer/easymerch/reducers/reducerIntegrationErrors";
import { AppDispatch } from "../../reducer/store";
import { getToken } from "../axiosToken";

const BASE_URL = process.env.REACT_APP_BASE_URL;

export const actionGetIntegrationErrors =
  (limit: any, offset: any) =>
  async (dispatch: AppDispatch, getState: () => any) => {
    const { token } = await getToken();
    axios.defaults.headers.common["Authorization"] = token;

    const store = getState();
    const filter =
      store.easymerch.integrationErrors.integrationErrorsInputValues;

    const response = await axios.post(`${BASE_URL}/json/em/incidents/list`, {
      limit,
      offset,
      contractType: 0,
      ...filter,
    });
    dispatch(
      reducerGetIntegrationErrors({ data: response.data, limit, offset })
    );
  };

export const actionSetIntegrationErrors =
  (filter: any, limit: any, offset: any, isSingleTripValue: any) =>
  async (dispatch: AppDispatch) => {
    const { token } = await getToken();
    axios.defaults.headers.common["Authorization"] = token;

    const response = await axios.post(`${BASE_URL}/json/em/incidents/list`, {
      limit,
      offset,
      contractType: 0,
      ...filter,
    });

    const filteredData = {
      incidentFilter: response?.data?.incidentFilter,
      incidents: {
        ...response?.data?.incidents,
        data: response?.data?.incidents?.data.filter((obj: any) => {
          if (isSingleTripValue === "Да") {
            return obj.isSingleTrip === true;
          } else if (isSingleTripValue === "Нет") {
            return obj.isSingleTrip === false;
          } else return response?.data?.incidents?.data;
        }),
      },
    };
    dispatch(
      reducerGetIntegrationErrors({ data: filteredData, limit, offset })
    );
  };

export const actionUnloadIntegrationErrors =
  (contract: any) => async (dispatch: AppDispatch) => {
    const { token } = await getToken();
    axios.defaults.headers.common["Authorization"] = token;

    try {
      const response = await axios.get(
        `${BASE_URL}/json/em/incidents/export/${contract}`
      );

      dispatch(reducerIntegrationErrorsStatus(response.status));
    } catch (err) {
      dispatch(reducerIntegrationErrorsStatus(0));
    }
  };
