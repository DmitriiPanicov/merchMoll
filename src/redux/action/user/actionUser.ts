import axios from "axios";

import {
  reducerLoginStatus,
  reducerUser,
} from "../../reducer/user/reducers/reducerUser";
import { AppDispatch } from "../../reducer/store";

const BASE_URL = process.env.REACT_APP_BASE_URL;

export const actionCheckTokenValidity =
  (token: string) => async (dispatch: AppDispatch) => {
    try {
      const response = await axios.get(`${BASE_URL}/json/auth/info`, {
        headers: {
          Authorization: `Basic ${token}`,
        },
      });

      dispatch(reducerUser({ ...response.data, token: token }));
      dispatch(reducerLoginStatus(response.status));
    } catch (err) {
      dispatch(reducerUser({}));
      dispatch(reducerLoginStatus(0));
    }
  };
