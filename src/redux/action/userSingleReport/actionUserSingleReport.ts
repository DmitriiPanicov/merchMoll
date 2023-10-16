import axios from "axios";

import {
  reducerSingleReportSettingsOptions,
  reducerUserSingleReport,
  reducerCriteriasList,
  reducerReportStatus,
  reducerTechCardData,
  reducerTunderSignals,
} from "../../reducer/userSingleReport/reducers/userSingleReport";
import { reducerReportsStatus } from "../../reducer/userReports/reducers/userReports";
import { AppDispatch } from "../../reducer/store";
import { getToken } from "../axiosToken";

const BASE_URL = process.env.REACT_APP_BASE_URL;

export const actionGetUserSingleReport =
  (reportId: string) => async (dispatch: AppDispatch) => {
    const { token } = await getToken();
    axios.defaults.headers.common["Authorization"] = token;

    const response = await axios.get(`${BASE_URL}/json/reports/${reportId}`);

    dispatch(reducerUserSingleReport({ data: response.data }));
  };

export const actionShowTunderSignal =
  (data: any) => async (dispatch: AppDispatch, getState: () => any) => {
    const { token } = await getToken();
    axios.defaults.headers.common["Authorization"] = token;
    const { contractId, posId, date } = data;

    const store = getState();
    const signals =
      store.userSingleReport.userSingleReport?.tunderSignals || [];

    const response = await axios.get(
      `${BASE_URL}/json/tander/completedSignal?contractId=${contractId}&posId=${posId}&date=${date}`
    );

    dispatch(reducerTunderSignals({ status: response.data, signals: signals }));
  };

export const actionGetTunderSignals =
  (data: any) => async (dispatch: AppDispatch, getState: () => any) => {
    const { token } = await getToken();
    axios.defaults.headers.common["Authorization"] = token;
    const { contractId, posId, date } = data;

    const store = getState();
    const signalsStatus =
      store.userSingleReport.userSingleReport?.isVisibleTunderSignals;

    const response = await axios.get(
      `${BASE_URL}/json/tander/completedSignals?contractId=${contractId}&posId=${posId}&date=${date}`
    );

    dispatch(
      reducerTunderSignals({ status: signalsStatus, signals: response.data })
    );
  };

export const actionGetCriteriasList =
  (contract: any) => async (dispatch: AppDispatch) => {
    const { token } = await getToken();
    axios.defaults.headers.common["Authorization"] = token;

    const response = await axios.get(
      `${BASE_URL}/json/contracts/criterias/list/${contract}`
    );

    dispatch(reducerCriteriasList(response.data));
  };

export const actionAcceptRate =
  (data: any, requestLocation?: string) => async (dispatch: AppDispatch) => {
    const { token } = await getToken();
    axios.defaults.headers.common["Authorization"] = token;

    try {
      const response = await axios.post(
        `${BASE_URL}/json/reports/rate/accept`,
        {
          ...data,
        }
      );

      dispatch(reducerUserSingleReport({ data: response.data }));

      if (requestLocation === "reportCheckBtn") {
        dispatch(
          reducerReportStatus({
            status: response.status,
            requestPurpose: "clientReportCheck",
          })
        );
      }
    } catch (err) {
      if (requestLocation === "reportCheckBtn") {
        dispatch(
          reducerReportStatus({
            status: 0,
            requestPurpose: "clientReportCheck",
          })
        );
      }
    }
  };

export const actionDeclineRate =
  (data: any) => async (dispatch: AppDispatch) => {
    const { token } = await getToken();
    axios.defaults.headers.common["Authorization"] = token;

    try {
      const response = await axios.post(
        `${BASE_URL}/json/reports/rate/decline`,
        {
          ...data,
        }
      );

      dispatch(reducerUserSingleReport({ data: response.data }));
    } catch (err) {}
  };

export const actionApproveReport =
  (data: any) => async (dispatch: AppDispatch) => {
    const { token } = await getToken();
    axios.defaults.headers.common["Authorization"] = token;

    try {
      const response = await axios.post(
        `${BASE_URL}/json/reports/review/approve`,
        {
          ...data,
        }
      );

      dispatch(reducerUserSingleReport({ data: response.data }));
    } catch (err) {}
  };

export const actionRejectReport =
  (data: any) => async (dispatch: AppDispatch) => {
    const { token } = await getToken();
    axios.defaults.headers.common["Authorization"] = token;

    try {
      const response = await axios.post(
        `${BASE_URL}/json/reports/review/reject`,
        {
          ...data,
        }
      );

      dispatch(reducerUserSingleReport({ data: response.data }));
    } catch (err) {}
  };

export const actionRevisionReport = (data: any) => async () => {
  const { token } = await getToken();
  axios.defaults.headers.common["Authorization"] = token;

  try {
    await axios.post(`${BASE_URL}/json/reports/review/revision`, {
      ...data,
    });
  } catch (err) {}
};

export const actionCancelReportReview =
  (id: string) => async (dispatch: AppDispatch) => {
    const { token } = await getToken();
    axios.defaults.headers.common["Authorization"] = token;

    try {
      const response = await axios.post(
        `${BASE_URL}/json/reports/review/cancel/${id}`
      );

      dispatch(reducerUserSingleReport({ data: response.data }));
    } catch (err) {}
  };

export const actionReviewByCheck =
  (data: any) => async (dispatch: AppDispatch) => {
    const { token } = await getToken();
    axios.defaults.headers.common["Authorization"] = token;

    try {
      const response = await axios.post(
        `${BASE_URL}/json/reports/review/byCheck`,
        {
          ...data,
        }
      );

      dispatch(reducerUserSingleReport({ data: response.data }));
    } catch (err) {
      alert(err);
    }
  };

export const actionCopyReport =
  (data: any) => async (dispatch: AppDispatch) => {
    const { token } = await getToken();
    axios.defaults.headers.common["Authorization"] = token;

    try {
      const response = await axios.post(`${BASE_URL}/json/reports/copy`, {
        ...data,
      });

      dispatch(
        reducerReportStatus({
          status: response.status,
          requestPurpose: "copy",
        })
      );
    } catch (err) {
      dispatch(
        reducerReportStatus({
          status: 0,
          requestPurpose: "copy",
        })
      );
    }
  };

export const actionDeleteReport =
  (id: string) => async (dispatch: AppDispatch) => {
    const { token } = await getToken();
    axios.defaults.headers.common["Authorization"] = token;

    try {
      const response = await axios.delete(
        `${BASE_URL}/json/reports/delete/${id}`
      );

      dispatch(
        reducerReportsStatus({
          reportsStatus: response.status,
          reportsRequestPurpose: "delete",
        })
      );
    } catch (err) {
      dispatch(
        reducerReportsStatus({
          reportsStatus: 0,
          reportsRequestPurpose: "delete",
        })
      );
    }
  };

export const actionDeleteReportPhotos =
  (data: any) => async (dispatch: AppDispatch) => {
    const { token } = await getToken();
    axios.defaults.headers.common["Authorization"] = token;

    try {
      const response = await axios.post(
        `${BASE_URL}/json/reports/${data.reportId}/media/delete`,
        ...data.medias
      );

      dispatch(reducerUserSingleReport({ data: response.data }));
      dispatch(
        reducerReportStatus({
          status: response.status,
          requestPurpose: "deletePhotos",
        })
      );
    } catch (err) {
      dispatch(
        reducerReportStatus({
          status: 0,
          requestPurpose: "deletePhotos",
        })
      );
    }
  };

export const actionRenamePhotoCard =
  (data: any) => async (dispatch: AppDispatch) => {
    const { token } = await getToken();
    axios.defaults.headers.common["Authorization"] = token;

    const response = await axios.patch(
      `${BASE_URL}/json/reports/${data.reportId}/media/update`,
      data.medias
    );

    dispatch(reducerUserSingleReport({ data: response.data }));
  };

export const actionClientDeclineReport =
  (data: any, files: any) => async (dispatch: AppDispatch) => {
    const { token } = await getToken();
    const headers = {
      Authorization: token,
      "Content-Type": "multipart/form-data",
    };

    const formData = new FormData();
    const jsonData = JSON.stringify(data);

    formData.append(
      "model",
      new Blob([jsonData], { type: "application/json" })
    );
    files.forEach((file: any) => {
      formData.append("picture", file, file.name);
    });

    try {
      const response = await axios.post(
        `${BASE_URL}/json/reports/claim/declineRequest`,
        formData,
        {
          headers: headers,
        }
      );

      dispatch(reducerUserSingleReport({ data: response.data }));
    } catch (err) {
      dispatch(
        reducerReportStatus({
          status: 0,
          requestPurpose: "declineRateStatus",
        })
      );
    }
  };

export const actionClientAcceptReport =
  (data: any) => async (dispatch: AppDispatch) => {
    const { token } = await getToken();
    const headers = {
      Authorization: token,
    };

    try {
      const response = await axios.post(
        `${BASE_URL}/json/reports/rate/accept`,
        data,
        {
          headers: headers,
        }
      );

      dispatch(reducerUserSingleReport({ data: response.data }));
    } catch (err) {}
  };

export const actionClientRequestReport =
  (data: any, files?: any, requestLocation?: string) =>
  async (dispatch: AppDispatch) => {
    const { token } = await getToken();
    const headers = {
      Authorization: token,
      "Content-Type": "multipart/form-data",
    };

    const formData = new FormData();
    const jsonData = JSON.stringify(data);

    formData.append(
      "model",
      new Blob([jsonData], { type: "application/json" })
    );
    files.forEach((file: any) => {
      formData.append("picture", file, file.name);
    });

    try {
      const response = await axios.post(
        `${BASE_URL}/json/reports/claim/request`,
        formData,
        {
          headers: headers,
        }
      );

      dispatch(reducerUserSingleReport({ data: response.data }));

      if (requestLocation === "reportCheckBtn") {
        dispatch(
          reducerReportStatus({
            status: response.status,
            requestPurpose: "clientReportCheck",
          })
        );
      }
    } catch (err) {
      if (requestLocation === "reportCheckBtn") {
        dispatch(
          reducerReportStatus({
            status: 0,
            requestPurpose: "clientReportCheck",
          })
        );
      }
    }
  };

export const actionGetTechCardData =
  (posId: string) => async (dispatch: AppDispatch) => {
    const { token } = await getToken();
    axios.defaults.headers.common["Authorization"] = token;

    const response = await axios.get(`${BASE_URL}/json/pos/checklist/${posId}`);

    dispatch(reducerTechCardData(response.data));
  };

export const actionConfirmReportClaim =
  (data: any) => async (dispatch: AppDispatch) => {
    const { token } = await getToken();
    axios.defaults.headers.common["Authorization"] = token;

    try {
      const response = await axios.post(
        `${BASE_URL}/json/reports/claim/confirm`,
        data
      );

      dispatch(reducerUserSingleReport({ data: response.data }));
    } catch (err) {
      alert(err);
    }
  };

export const actionDeclineReportClaim =
  (data: any) => async (dispatch: AppDispatch) => {
    const { token } = await getToken();
    axios.defaults.headers.common["Authorization"] = token;

    try {
      const response = await axios.post(
        `${BASE_URL}/json/reports/claim/decline`,
        data
      );

      dispatch(reducerUserSingleReport({ data: response.data }));
    } catch (err) {
      alert(err);
    }
  };

export const actionCancelReportClaim =
  (data: any) => async (dispatch: AppDispatch) => {
    const { token } = await getToken();
    axios.defaults.headers.common["Authorization"] = token;

    try {
      const response = await axios.post(
        `${BASE_URL}/json/reports/rate/cancel`,
        data
      );

      dispatch(reducerUserSingleReport({ data: response.data }));
    } catch (err) {}
  };

export const actionUpdateSkuAction =
  (data: any) => async (dispatch: AppDispatch) => {
    const { token } = await getToken();
    axios.defaults.headers.common["Authorization"] = token;

    const response = await axios.patch(
      `${BASE_URL}/json/reports/${data.reportId}/update/actionSku`,
      data.data
    );

    dispatch(reducerUserSingleReport({ data: response.data }));
  };

export const actionUpdateReportAction =
  (data: any) => async (dispatch: AppDispatch) => {
    const { token } = await getToken();
    axios.defaults.headers.common["Authorization"] = token;

    const response = await axios.patch(
      `${BASE_URL}/json/reports/${data.reportId}/update/action`,
      data.data
    );

    dispatch(reducerUserSingleReport({ data: response.data }));
  };

export const actionUpdateReportItem =
  (data: any) => async (dispatch: AppDispatch) => {
    const { token } = await getToken();
    axios.defaults.headers.common["Authorization"] = token;

    const response = await axios.patch(
      `${BASE_URL}/json/reports/${data.reportId}/update/item`,
      data.data
    );

    dispatch(reducerUserSingleReport({ data: response.data }));
  };

export const actionUpdateReportCv =
  (data: any) => async (dispatch: AppDispatch) => {
    const { token } = await getToken();
    axios.defaults.headers.common["Authorization"] = token;

    const response = await axios.patch(
      `${BASE_URL}/json/reports/${data.reportId}/update/cv`,
      data.data
    );

    dispatch(reducerUserSingleReport({ data: response.data }));
  };

export const actionUpdateReportSkuCv =
  (data: any) => async (dispatch: AppDispatch) => {
    const { token } = await getToken();
    axios.defaults.headers.common["Authorization"] = token;

    const response = await axios.patch(
      `${BASE_URL}/json/reports/${data.reportId}/update/skuCv`,
      data.data
    );

    dispatch(reducerUserSingleReport({ data: response.data }));
  };

export const actionUpdateFixDate =
  (data: any) => async (dispatch: AppDispatch) => {
    const { token } = await getToken();
    axios.defaults.headers.common["Authorization"] = token;

    const response = await axios.post(
      `${BASE_URL}/json/reports/claim/expectedFixDate`,
      data
    );

    dispatch(reducerUserSingleReport({ data: response.data }));
  };

export const actionDownloadNewPhotos =
  (data: any) => async (dispatch: AppDispatch) => {
    const { token } = await getToken();
    const headers = {
      Authorization: token,
      "Content-Type": "multipart/form-data",
    };

    try {
      const response = await axios.put(
        `${BASE_URL}/json/reports/${data.reportId}/files/add?revision=${data.revision}`,
        data.files,
        {
          headers: headers,
        }
      );

      dispatch(reducerUserSingleReport({ data: response.data }));
      dispatch(
        reducerReportStatus({
          status: response.status,
          requestPurpose: "addPhotos",
        })
      );
    } catch (err) {
      dispatch(
        reducerReportStatus({
          status: 0,
          requestPurpose: "addPhotos",
        })
      );
    }
  };

export const actionUpdateReportNotes =
  (data: any) => async (dispatch: AppDispatch) => {
    const { token } = await getToken();
    axios.defaults.headers.common["Authorization"] = token;

    const response = await axios.patch(
      `${BASE_URL}/json/reports/${data.reportId}/update/notes`,
      { ...data.data }
    );

    dispatch(reducerUserSingleReport({ data: response.data }));
  };

export const actionSetSingleReportSettings =
  (key: string, entity: any) => async () => {
    const { token } = await getToken();
    axios.defaults.headers.common["Authorization"] = token;

    axios.post(`${BASE_URL}/json/auth/config/update?key=${key}`, {
      entity,
    });
  };

export const actionGetSingleReportSettings =
  (key: string) => async (dispatch: AppDispatch) => {
    const { token } = await getToken();
    axios.defaults.headers.common["Authorization"] = token;

    const response = await axios.get(`${BASE_URL}/json/auth/config?key=${key}`);

    dispatch(reducerSingleReportSettingsOptions(response.data));
  };
