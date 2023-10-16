import axios from "axios";

import {
  reducerDeletedExpiredReports,
  reducerExpiredReportsStatus,
  reducerExpiredReports,
} from "../../reducer/userReports/reducers/expiredReports";
import { AppDispatch } from "../../reducer/store";
import { getToken } from "../axiosToken";

const BASE_URL = process.env.REACT_APP_BASE_URL;

export const actionGetExpiredReports =
  (limit: any, page: any) =>
  async (dispatch: AppDispatch, getState: () => any) => {
    const { token } = await getToken();
    axios.defaults.headers.common["Authorization"] = token;

    const store = getState();
    const filter = store.userReports.expiredReports.expiredReportsInputValues;

    const response = await axios.post(`${BASE_URL}/json/reports/expired`, {
      limit,
      page,
      ...filter,
    });

    dispatch(reducerExpiredReports({ data: response.data, limit, page: 1 }));
  };

export const actionDeleteExpiredReports =
  (data: any) => async (dispatch: AppDispatch, getState: () => any) => {
    const { token } = await getToken();
    axios.defaults.headers.common["Authorization"] = token;

    try {
      const store = getState();
      const expiredReports = store.userReports.expiredReports.reports;
      const count = store.userReports.expiredReports.expiredReportsCount;
      const limit = store.userReports.expiredReports.limit;

      if (data && data.length >= 1) {
        const response = await axios.delete(
          `${BASE_URL}/json/reports/expired`,
          {
            data,
          }
        );

        dispatch(
          reducerExpiredReportsStatus({
            status: response.status,
            requestPurpose: "delete",
          })
        );
        dispatch(
          reducerExpiredReports({
            data: {
              count: count,
              data: expiredReports.filter(
                (report: any) =>
                  !data.some((elem: any) => elem.id === report.expiredReport.id)
              ),
            },
            limit,
            page: 1,
          })
        );
      } else {
        dispatch(
          reducerExpiredReportsStatus({
            status: "noData",
            requestPurpose: "delete",
          })
        );
      }

      dispatch(reducerDeletedExpiredReports([]));
    } catch (err) {
      dispatch(
        reducerExpiredReportsStatus({
          status: 0,
          requestPurpose: "delete",
        })
      );
      dispatch(reducerDeletedExpiredReports([]));
    }
  };

export const actionExportExpiredReports =
  (limit: number) => async (dispatch: AppDispatch, getState: () => any) => {
    const { token } = await getToken();
    axios.defaults.headers.common["Authorization"] = token;

    try {
      const store = getState();
      const filter = store.userReports.expiredReports.expiredReportsInputValues;

      const response = await axios.post(
        `${BASE_URL}/json/reports/expired/export`,
        {
          limit,
          page: 1,
          ...filter,
        }
      );

      dispatch(
        reducerExpiredReportsStatus({
          status: response.status,
          requestPurpose: "export",
        })
      );
    } catch (err) {
      dispatch(
        reducerExpiredReportsStatus({
          status: 0,
          requestPurpose: "export",
        })
      );
    }
  };

export const actionCreateExpiredReports =
  (data: any) => async (dispatch: AppDispatch, getState: () => any) => {
    const { token } = await getToken();
    axios.defaults.headers.common["Authorization"] = token;

    try {
      const store = getState();
      const expiredReports = store.userReports.expiredReports.reports;
      const count = store.userReports.expiredReports.expiredReportsCount;
      const limit = store.userReports.expiredReports.limit;

      if (data && data.length >= 1) {
        const response = await axios.post(
          `${BASE_URL}/json/reports/expired/craete`,
          data
        );

        dispatch(
          reducerExpiredReportsStatus({
            status: response.status,
            requestPurpose: "create",
          })
        );
        dispatch(
          reducerExpiredReports({
            data: {
              count: count,
              data: expiredReports.filter(
                (report: any) =>
                  !data.some((elem: any) => elem.id === report.expiredReport.id)
              ),
            },
            limit,
            page: 1,
          })
        );
      } else {
        dispatch(
          reducerExpiredReportsStatus({
            status: "noData",
            requestPurpose: "create",
          })
        );
      }

      dispatch(reducerDeletedExpiredReports([]));
    } catch (err) {
      dispatch(
        reducerExpiredReportsStatus({
          status: 0,
          requestPurpose: "create",
        })
      );
      dispatch(reducerDeletedExpiredReports([]));
    }
  };
