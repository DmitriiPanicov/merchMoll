import axios from "axios";

import {
  reducerRetailOutletsStatus,
  reducerGetRetailOutlets,
} from "../../reducer/tunder/reducers/reducerRetailOutlets";
import { AppDispatch } from "../../reducer/store";
import { getToken } from "../axiosToken";

const BASE_URL = process.env.REACT_APP_BASE_URL;

export const actionGetRetailOutlets =
  (limit: any, offset: any) => async (dispatch: AppDispatch) => {
    const { token } = await getToken();
    axios.defaults.headers.common["Authorization"] = token;

    const response = await axios.get(
      `${BASE_URL}/json/tander/shops?offset=${offset}&limit=${limit}`
    );
    dispatch(reducerGetRetailOutlets({ data: response.data, limit, offset }));
  };

export const actionUpdateRetailOutlets = (data: any) => async () => {
  const { token } = await getToken();
  axios.defaults.headers.common["Authorization"] = token;

  axios.post(`${BASE_URL}/json/tander/updateShop`, data);
};

export const actionImportPos =
  (files?: any) => async (dispatch: AppDispatch) => {
    const { token } = await getToken();
    const headers = {
      Authorization: token,
      "Content-Type": "multipart/form-data",
    };

    const formData = new FormData();

    files.forEach((file: any) => {
      formData.append("excelFile", file, file.name);
    });

    try {
      const response = await axios.put(
        `${BASE_URL}/json/tander/importPos`,
        formData,
        {
          headers: headers,
        }
      );

      dispatch(reducerRetailOutletsStatus(response.status));
    } catch (err) {
      dispatch(reducerRetailOutletsStatus(0));
    }
  };
