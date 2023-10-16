import axios from "axios";

import {
  reducerGetUnloadReportsPhotoFilters,
  reducerGetUserReportsFilters,
  reducerSelectedReports,
  reducerReportsStatus,
  reducerUserReports,
} from "../../reducer/userReports/reducers/userReports";
import { reducerGetScheduleFilters } from "../../reducer/userSingleReport/reducers/visitSchedule";
import { AppDispatch } from "../../reducer/store";
import { getToken } from "../axiosToken";

const BASE_URL = process.env.REACT_APP_BASE_URL;

export const actionGetUserReports =
  (limit: any, page: any) =>
  async (dispatch: AppDispatch, getState: () => any) => {
    const { token } = await getToken();
    axios.defaults.headers.common["Authorization"] = token;

    const store = getState();
    const filter = store.userReports.userReports.reportsInputValues;

    const response = await axios.post(`${BASE_URL}/json/reports/list`, {
      limit,
      page,
      ...filter,
    });

    dispatch(reducerUserReports({ data: response.data, limit, page: 1 }));
  };

export const actionGetUserReportsFilter =
  () => async (dispatch: AppDispatch) => {
    const { token } = await getToken();
    axios.defaults.headers.common["Authorization"] = token;

    const response = await axios.get(`${BASE_URL}/json/reports/filters`);

    dispatch(reducerGetUserReportsFilters({ data: response.data }));
    dispatch(reducerGetScheduleFilters({ data: response.data }));
  };

export const actionUnloadReportsWithLinks =
  (data: any) => async (dispatch: AppDispatch) => {
    const { token } = await getToken();
    axios.defaults.headers.common["Authorization"] = token;

    try {
      const response = await axios.post(
        `${BASE_URL}/json/reports/export/report/links`,
        data
      );

      dispatch(
        reducerReportsStatus({
          reportsStatus: response.status,
          reportsRequestPurpose: "unloadWithLinks",
        })
      );
    } catch (err) {
      dispatch(
        reducerReportsStatus({
          reportsStatus: 0,
          reportsRequestPurpose: "unloadWithLinks",
        })
      );
    }
  };

export const actionUnloadReportsList =
  (data: any) => async (dispatch: AppDispatch) => {
    const { token } = await getToken();
    axios.defaults.headers.common["Authorization"] = token;

    try {
      const response = await axios.post(
        `${BASE_URL}/json/reports/export/report/list`,
        data
      );

      dispatch(
        reducerReportsStatus({
          reportsStatus: response.status,
          reportsRequestPurpose: "unloadReportsList",
        })
      );
    } catch (err) {
      dispatch(
        reducerReportsStatus({
          reportsStatus: 0,
          reportsRequestPurpose: "unloadReportsList",
        })
      );
    }
  };

export const actionUnloadReportsConsolidated =
  (data: any) => async (dispatch: AppDispatch) => {
    const { token } = await getToken();
    axios.defaults.headers.common["Authorization"] = token;

    try {
      const response = await axios.post(
        `${BASE_URL}/json/reports/export/report/consolidated`,
        data
      );

      dispatch(
        reducerReportsStatus({
          reportsStatus: response.status,
          reportsRequestPurpose: "unloadReportsConsolidated",
        })
      );
    } catch (err) {
      dispatch(
        reducerReportsStatus({
          reportsStatus: 0,
          reportsRequestPurpose: "unloadReportsConsolidated",
        })
      );
    }
  };

export const actionUnloadClientReport =
  (data: any) => async (dispatch: AppDispatch) => {
    const { token } = await getToken();
    axios.defaults.headers.common["Authorization"] = token;

    try {
      const response = await axios.post(
        `${BASE_URL}/json/reports/export/report/client`,
        data
      );

      dispatch(
        reducerReportsStatus({
          reportsStatus: response.status,
          reportsRequestPurpose: "unloadClientReport",
        })
      );
    } catch (err) {
      dispatch(
        reducerReportsStatus({
          reportsStatus: 0,
          reportsRequestPurpose: "unloadClientReport",
        })
      );
    }
  };

export const actionUnloadReportsPhotos =
  (data: any) => async (dispatch: AppDispatch) => {
    const { token } = await getToken();
    axios.defaults.headers.common["Authorization"] = token;

    try {
      const response = await axios.post(
        `${BASE_URL}/json/reports/export/photos`,
        data
      );

      dispatch(
        reducerReportsStatus({
          reportsStatus: response.status,
          reportsRequestPurpose: "unloadReportsPhotos",
        })
      );
    } catch (err) {
      dispatch(
        reducerReportsStatus({
          reportsStatus: 0,
          reportsRequestPurpose: "unloadReportsPhotos",
        })
      );
    }
  };

export const actionGetUnloadReportsPhotoFilter =
  (contractId: any) => async (dispatch: AppDispatch) => {
    const { token } = await getToken();
    axios.defaults.headers.common["Authorization"] = token;

    const response = await axios.get(
      `${BASE_URL}/json/reports/filters/photo/${contractId}`
    );

    dispatch(reducerGetUnloadReportsPhotoFilters({ data: response.data }));
  };

export const actionCreateGeo =
  (reportId: any) => async (dispatch: AppDispatch) => {
    const { token } = await getToken();
    axios.defaults.headers.common["Authorization"] = token;

    try {
      await axios.post(
        `${BASE_URL}/json/reports/${reportId}/geolocation/create/`
      );
    } catch (err) {
      dispatch(reducerSelectedReports([]));
    }
  };

export const actionCopyReports =
  (data: any) => async (dispatch: AppDispatch) => {
    const { token } = await getToken();
    axios.defaults.headers.common["Authorization"] = token;

    try {
      const response = await axios.post(`${BASE_URL}/json/reports/copy`, data);

      dispatch(
        reducerReportsStatus({
          reportsStatus: response.status,
          reportsRequestPurpose: "copyReports",
        })
      );
    } catch (err) {
      dispatch(
        reducerReportsStatus({
          reportsStatus: 0,
          reportsRequestPurpose: "copyReports",
        })
      );
      dispatch(reducerSelectedReports([]));
    }
  };

export const actionUpdateDeliveryStatus =
  (data: any) => async (dispatch: AppDispatch) => {
    const { token } = await getToken();
    axios.defaults.headers.common["Authorization"] = token;

    try {
      const response = await axios.post(
        `${BASE_URL}/json/reports/delivery/update`,
        data
      );

      dispatch(
        reducerReportsStatus({
          reportsStatus: response.status,
          reportsRequestPurpose: "updateDeliveryStatus",
        })
      );
    } catch (err) {
      dispatch(
        reducerReportsStatus({
          reportsStatus: 0,
          reportsRequestPurpose: "updateDeliveryStatus",
        })
      );
      dispatch(reducerSelectedReports([]));
    }
  };

export const actionExportOsa = (data: any) => async (dispatch: AppDispatch) => {
  const { token } = await getToken();
  axios.defaults.headers.common["Authorization"] = token;

  try {
    const response = await axios.post(
      `${BASE_URL}/json/reports/export/osa`,
      data
    );

    dispatch(
      reducerReportsStatus({
        reportsStatus: response.status,
        reportsRequestPurpose: "osa",
      })
    );
    dispatch(reducerSelectedReports([]));
  } catch (err) {
    dispatch(
      reducerReportsStatus({
        reportsStatus: 0,
        reportsRequestPurpose: "osa",
      })
    );
    dispatch(reducerSelectedReports([]));
  }
};

export const actionExportAverageFacing =
  (data: any) => async (dispatch: AppDispatch) => {
    const { token } = await getToken();
    axios.defaults.headers.common["Authorization"] = token;

    try {
      const response = await axios.post(
        `${BASE_URL}/json/reports/export/averageFacing`,
        data
      );

      dispatch(
        reducerReportsStatus({
          reportsStatus: response.status,
          reportsRequestPurpose: "averageFacing",
        })
      );
      dispatch(reducerSelectedReports([]));
    } catch (err) {
      dispatch(
        reducerReportsStatus({
          reportsStatus: 0,
          reportsRequestPurpose: "averageFacing",
        })
      );
      dispatch(reducerSelectedReports([]));
    }
  };

export const actionShareOfShelf =
  (data: any) => async (dispatch: AppDispatch) => {
    const { token } = await getToken();
    axios.defaults.headers.common["Authorization"] = token;

    try {
      const response = await axios.post(
        `${BASE_URL}/json/reports/export/shareOfShelf`,
        data
      );

      dispatch(
        reducerReportsStatus({
          reportsStatus: response.status,
          reportsRequestPurpose: "shelfShare",
        })
      );
      dispatch(reducerSelectedReports([]));
    } catch (err) {
      dispatch(
        reducerReportsStatus({
          reportsStatus: 0,
          reportsRequestPurpose: "shelfShare",
        })
      );
      dispatch(reducerSelectedReports([]));
    }
  };

export const actionUnloadHotline =
  (data: any) => async (dispatch: AppDispatch) => {
    const { token } = await getToken();
    axios.defaults.headers.common["Authorization"] = token;

    try {
      const response = await axios.post(
        `${BASE_URL}/json/reports/export/hotline`,
        data
      );

      dispatch(
        reducerReportsStatus({
          reportsStatus: response.status,
          reportsRequestPurpose: "unloadHotline",
        })
      );
      dispatch(reducerSelectedReports([]));
    } catch (err) {
      dispatch(
        reducerReportsStatus({
          reportsStatus: 0,
          reportsRequestPurpose: "unloadHotline",
        })
      );
      dispatch(reducerSelectedReports([]));
    }
  };

export const actionUnloadCustomerReportsData =
  (data: any) => async (dispatch: AppDispatch) => {
    const { token } = await getToken();
    axios.defaults.headers.common["Authorization"] = token;

    try {
      const response = await axios.post(
        `${BASE_URL}/json/reports/export/client/report`,
        data
      );

      dispatch(
        reducerReportsStatus({
          reportsStatus: response.status,
          reportsRequestPurpose: "unloadCustomerReportsData",
        })
      );
      dispatch(reducerSelectedReports([]));
    } catch (err) {
      dispatch(
        reducerReportsStatus({
          reportsStatus: 0,
          reportsRequestPurpose: "unloadCustomerReportsData",
        })
      );
      dispatch(reducerSelectedReports([]));
    }
  };

export const actionUnloadCustomerReports =
  (data: any) => async (dispatch: AppDispatch) => {
    const { token } = await getToken();
    axios.defaults.headers.common["Authorization"] = token;

    try {
      const response = await axios.post(
        `${BASE_URL}/json/reports/export/reports`,
        data
      );

      dispatch(
        reducerReportsStatus({
          reportsStatus: response.status,
          reportsRequestPurpose: "unloadCustomerReports",
        })
      );
      dispatch(reducerSelectedReports([]));
    } catch (err) {
      dispatch(
        reducerReportsStatus({
          reportsStatus: 0,
          reportsRequestPurpose: "unloadCustomerReports",
        })
      );
      dispatch(reducerSelectedReports([]));
    }
  };
