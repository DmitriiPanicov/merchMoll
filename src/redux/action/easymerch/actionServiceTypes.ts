import axios from "axios";

import {
  reducerGetServiceTypesSelect,
  reducerServiceTypesStatus,
  reducerGetServiceTypes,
} from "../../reducer/easymerch/reducers/reducerServiceTypes";
import { AppDispatch } from "../../reducer/store";
import { getToken } from "../axiosToken";

const BASE_URL = process.env.REACT_APP_BASE_URL;

export const actionGetServiceTypes =
  (limit: any, offset: any, filter?: any) => async (dispatch: AppDispatch) => {
    const { token } = await getToken();
    axios.defaults.headers.common["Authorization"] = token;

    const response = await axios.post(
      `${BASE_URL}/json/em/serviceType/serviceTypes`,
      {
        limit,
        offset,
        contractType: 0,
        ...filter,
      }
    );

    dispatch(
      reducerGetServiceTypes({
        data: !response.data.data
          ? { ...response.data, data: [] }
          : response.data,
        limit,
        offset,
      })
    );
  };

export const actionRemoveServiceType = (id: any) => async () => {
  const { token } = await getToken();
  axios.defaults.headers.common["Authorization"] = token;

  axios.post(`${BASE_URL}/json/em/serviceType/removeServiceType?type=0`, id, {
    headers: {
      "Content-Type": "application/ld+json",
    },
  });
};

export const actionPostServiceTypes =
  (data: any) => async (dispatch: AppDispatch) => {
    const { token } = await getToken();
    axios.defaults.headers.common["Authorization"] = token;

    try {
      const response = await axios.post(
        `${BASE_URL}/json/em/serviceType/insertServiceType?type=0`,
        data
      );

      dispatch(reducerServiceTypesStatus(response.status));
    } catch (err) {
      dispatch(reducerServiceTypesStatus(0));
    }
  };

export const actionUpdateServiceType = (data: any) => async () => {
  const { token } = await getToken();
  axios.defaults.headers.common["Authorization"] = token;

  axios.post(`${BASE_URL}/json/em/serviceType/updateServiceType?type=0`, data);
};

export const actionGetServiceTypesSelect =
  () => async (dispatch: AppDispatch) => {
    const { token } = await getToken();
    axios.defaults.headers.common["Authorization"] = token;

    const response = await axios.get(`${BASE_URL}/json/contracts/list`);
    dispatch(reducerGetServiceTypesSelect({ data: response.data }));
  };
