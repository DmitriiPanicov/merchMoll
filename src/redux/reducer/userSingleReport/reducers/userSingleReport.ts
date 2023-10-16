import { createSlice, Draft, PayloadAction } from "@reduxjs/toolkit";

import { sortByDate } from "../../../../utils/singleReportSorting";

const data = JSON.parse(localStorage.getItem("userData") as string);

const initialState: any = {
  report: null,
  settings: JSON.parse(localStorage.getItem("selectedTabs") as string) || [
    "mainInfo",
    "geo",
    "photos",
    "files",
    "planogramms",
    "cv",
    "skus",
    "actions",
    "actionsTT",
    "skuCv",
    "review",
    "rate",
    "history",
  ],
  adminSettings: JSON.parse(
    localStorage.getItem("selectedAdminTabs") as string
  ) || [
    "mainInfo",
    "easymerch",
    "geo",
    "photos",
    "files",
    "planogramms",
    "cv",
    "skus",
    "actions",
    "actionsTT",
    "skuCv",
    "review",
    "rate",
    "history",
    "techCard",
  ],
  isVisibleTunderSignals: false,
};

export const singleReportSlice = createSlice({
  name: "singleReport",
  initialState,
  reducers: {
    reducerUserSingleReport: (
      state: Draft<any>,
      action: PayloadAction<any>
    ) => {
      state.report = action.payload.data;
      state.sortedNearReports = [...action.payload.data.nearReports]?.sort(
        (firstRep: any, secondRep: any) =>
          new Date(firstRep.date).getTime() - new Date(secondRep.date).getTime()
      );
      state.beforeMedias = sortByDate(
        action.payload.data?.medias?.filter((elem: any) => !elem.revision)
      );
      state.afterMedias = sortByDate(
        action.payload.data?.medias?.filter((elem: any) => elem.revision)
      );
      state.files = action.payload.data?.medias?.filter(
        (elem: any) => elem.category === "CustomerCheck"
      );
      state.filteredReviewHistory = action.payload.data?.history?.filter(
        (item: any) =>
          Object.keys(item.type).toString() === "REVIEW_STATUS" ||
          Object.keys(item.type).toString() === "SELF_COST_PERCENT"
      );
      state.filteredRateHistory = action.payload.data?.history?.filter(
        (item: any) =>
          Object.keys(item.type).toString() === "RATE_STATUS" ||
          Object.keys(item.type).toString() === "COST_PERCENT" ||
          Object.keys(item.type).toString() === "RATE_NOTES" ||
          Object.keys(item.type).toString() === "CLAIM_REASON" ||
          Object.keys(item.type).toString() === "CLAIM_NOTE" ||
          Object.keys(item.type).toString() === "CLAIM_DATE"
      );
      state.allHistory = action.payload.data?.history;
      state.mapPoints = action.payload.data?.geolocationModel?.map(
        (elem: any) => ({
          coords: [elem.latitude, elem.longitude],
          radius: elem.accuracy,
          isPhoto: elem.photo,
          type: elem.type,
          date: elem.date,
          error: elem.error,
          distance: elem.distance.toFixed(0),
        })
      );
      state.initialAdminReportOptions = [
        {
          value: "mainInfo",
          label: "Основная",
        },
        action.payload.data?.emReport && {
          value: "easymerch",
          label: "Easy Merch",
        },
        {
          value: "geo",
          label: "Координаты ТТ",
        },
        {
          value: "photos",
          label: "Фотографии",
        },
        !!action.payload.data?.medias?.filter(
          (elem: any) => elem.category === "CustomerCheck"
        ).length && { value: "files", label: "Файлы отчета" },
        !!action.payload.data?.planograms?.length && {
          value: "planogramms",
          label: "Планограммы",
        },
        !!action.payload.data?.cv?.length && {
          value: "cv",
          label: "Данные по ТТ",
        },
        !!action.payload.data?.skus?.length && {
          value: "skus",
          label: "Данные",
        },
        !!action.payload.data?.actions?.length && {
          value: "actionsTT",
          label: "Акции по ТТ",
        },
        !!action.payload.data?.skuActions?.length && {
          value: "actions",
          label: "Акции по товарам",
        },
        !!action.payload.data?.skuCv?.length && {
          value: "skuCv",
          label: "Доп. данные по товарам",
        },
        {
          value: "review",
          label: "Проверка",
        },
        {
          value: "rate",
          label: "Оценка",
        },
        !!action.payload.data?.history?.length && {
          value: "history",
          label: "История изменений",
        },
        {
          value: "techCard",
          label: "Тех. карта",
        },
      ].filter((option: any) => option);
      state.initialCustomerReportOptions = [
        {
          value: "mainInfo",
          label: "Основная",
        },
        data?.settings?.geo && {
          value: "geo",
          label: "Координаты ТТ",
        },
        !!action.payload.data?.medias?.length && {
          value: "photos",
          label: "Фотографии",
        },
        !!action.payload.data?.medias?.filter(
          (elem: any) => elem.category === "CustomerCheck"
        ).length && { value: "files", label: "Файлы отчета" },
        !!action.payload.data?.planograms?.length &&
          !data?.settings?.onlyPhotoAndGeo && {
            value: "planogramms",
            label: "Планограммы",
          },
        !data?.settings?.onlyPhotoAndGeo &&
          !!action.payload.data?.cv?.length && {
            value: "cv",
            label: "Данные по ТТ",
          },
        !data?.settings?.onlyPhotoAndGeo &&
          !!action.payload.data?.skus?.length && {
            value: "skus",
            label: "Данные",
          },
        !data?.settings?.onlyPhotoAndGeo &&
          !!action.payload.data?.actions?.length && {
            value: "actionsTT",
            label: "Акции по ТТ",
          },
        !data?.settings?.onlyPhotoAndGeo &&
          !!action.payload.data?.skuActions?.length && {
            value: "actions",
            label: "Акции по товарам",
          },
        !data?.settings?.onlyPhotoAndGeo &&
          !!action.payload.data?.skuCv?.length && {
            value: "skuCv",
            label: "Доп. данные по товарам",
          },
        data?.settings?.reviewStatus &&
          Object.keys(
            action.payload.data?.reviewModel?.reviewStatus
          ).toString() !== "NotChecked" && {
            value: "review",
            label: "Проверка",
          },
        Object.keys(action.payload.data?.rateModel?.rateStatus).toString() !==
          "NotChecked" && {
          value: "rate",
          label: "Оценка",
        },
        !!action.payload.data?.history?.length && {
          value: "history",
          label: "История изменений",
        },
      ].filter((option: any) => option);
    },
    reducerTunderSignals: (state: Draft<any>, action: PayloadAction<any>) => {
      state.isVisibleTunderSignals = action.payload.status;
      state.tunderSignals = action.payload.signals;
    },
    reducerCriteriasList: (state: Draft<any>, action: PayloadAction<any>) => {
      state.list = action.payload;
      state.clientReportCheckList = action.payload
        ?.slice()
        ?.filter((elem: any) => elem.clientCheck);
      state.criteriasList = action.payload
        ?.slice()
        ?.filter(
          (elem: any) =>
            Object.keys(elem.type).toString() === "Report" ||
            Object.keys(elem.type).toString() === "ReportAudit"
        );
      state.criteriasListIds = state.criteriasList?.map(
        (item: any) => item.reason.id
      );
      state.isCriteriasListExist = !!state.criteriasList?.length;
      state.checkedIds = state.report?.reviewModel?.checks
        ?.slice()
        ?.filter((check: any) => check?.passed)
        ?.map((check: any) => check?.id);
    },
    reducerReportStatus: (state: Draft<any>, action: PayloadAction<any>) => {
      state.status = action?.payload?.status;
      state.requestPurpose = action?.payload?.requestPurpose;
    },
    reducerDeletePhotosId: (state: Draft<any>, action: PayloadAction<any>) => {
      state.photos = action.payload;
    },
    reducerTechCardData: (state: Draft<any>, action: PayloadAction<any>) => {
      state.techCardData = action.payload;
    },
    reducerSelectedReportSettings: (
      state: Draft<any>,
      action: PayloadAction<any>
    ) => {
      state.settings = action.payload;
    },
    reducerSelectedAdminReportSettings: (
      state: Draft<any>,
      action: PayloadAction<any>
    ) => {
      state.adminSettings = action.payload;
    },
    reducerSingleReportSettingsOptions: (
      state: Draft<any>,
      action: PayloadAction<any>
    ) => {
      state.reorderedOptions = action.payload?.entity;
    },
  },
});

export const {
  reducerSelectedAdminReportSettings,
  reducerSingleReportSettingsOptions,
  reducerSelectedReportSettings,
  reducerUserSingleReport,
  reducerDeletePhotosId,
  reducerTunderSignals,
  reducerCriteriasList,
  reducerReportStatus,
  reducerTechCardData,
} = singleReportSlice.actions;

export default singleReportSlice.reducer;
