import { createSlice, Draft, PayloadAction } from "@reduxjs/toolkit";
import { startOfMonth, subMonths } from "date-fns";
import moment from "moment";

import { stateDate } from "../../../../utils/formatDate";

const userDataContracts =
  JSON.parse(localStorage.getItem("userData") as string)?.settings?.contracts ||
  [];

const initialState: any = {
  reports: null,
  reportsCount: null,
  limit: JSON.parse(localStorage.getItem("pageLimit") as string) || 10,
  page: 1,
  reportsInputValues: {
    fromDate: stateDate(startOfMonth(subMonths(new Date(), 1))),
    toDate: stateDate(new Date()),
    regions: [],
    contracts:
      userDataContracts.length === 1 ? [userDataContracts[0]?.contract.id] : [],
    projects: [],
    rateStatuses: [],
    reviewStatuses: [],
    deliveryStatuses: [],
    mediaStatus: null,
    inRange: null,
    supervisors: [],
  },
  formattedDateFrom: moment(
    stateDate(startOfMonth(subMonths(new Date(), 1)))
  ).format("DD/MM/YYYY"),
  formattedDateTo: moment(stateDate(new Date())).format("DD/MM/YYYY"),
  reportsSettings: JSON.parse(
    localStorage.getItem("selectedReportsTabs") as string
  ) || ["date", "chain", "address", "rate", "review", "contract"],
  adminReportsSettings: JSON.parse(
    localStorage.getItem("selectedAdminReportsTabs") as string
  ) || [
    "reportId",
    "date",
    "review",
    "delivery",
    "rate",
    "geo",
    "photo",
    "contract",
    "chain",
    "region",
    "address",
    "project",
    "sv",
    "vsv",
    "merch",
    "clientId",
  ],
  actualPurpose: null,
  actualModalTitle: null,
};

export const reportsSlice = createSlice({
  name: "reports",
  initialState,
  reducers: {
    reducerUserReports: (state: Draft<any>, action: PayloadAction<any>) => {
      state.reports = action.payload.data?.data || [];
      state.reportsCount = action.payload.data?.count || 0;
      state.limit = action.payload?.limit;
      state.page = action.payload?.page;
      state.checkboxes = action.payload.data?.data?.reduce(
        (acc: any, report: any) => {
          acc[report.reportId] = false;
          return acc;
        },
        {}
      );
    },
    reducerGetUserReportsFilters: (
      state: Draft<any>,
      action: PayloadAction<any>
    ) => {
      state.filters = action.payload.data;
      state.regionsOptions = action.payload.data[0]?.regions?.map(
        (option: any) => ({
          value: option.id,
          label: option.name,
        })
      );
      state.chainsOptions = action.payload.data[0]?.chains?.map(
        (option: any) => ({
          value: option.id,
          label: option.name,
        })
      );
      state.contractsOptions = action.payload.data[0]?.contracts?.map(
        (option: any) => ({
          value: option.id,
          label: option.name,
        })
      );
      state.projectOptions = action.payload.data[0]?.projects?.map(
        (option: any) => ({
          value: option.id,
          label: option.name,
        })
      );
      state.svsOptions = action.payload.data[0]?.svs?.map((option: any) => ({
        value: option.id,
        label: option.name,
      }));
      state.merchsOptions = action.payload.data[0]?.merchs?.map(
        (option: any) => ({
          value: option.id,
          label: option.name,
        })
      );
      state.responsibleCustomersOptions =
        action.payload.data[0]?.responsibleCustomers?.map((option: any) => ({
          value: option,
          label: option,
        }));
      state.vsvsOptions = action.payload.data[0]?.vsvs?.map((option: any) => ({
        value: option.id,
        label: option.name,
      }));
    },
    reducerGetUnloadReportsPhotoFilters: (
      state: Draft<any>,
      action: PayloadAction<any>
    ) => {
      state.photoFilters = action.payload.data;
      state.customServicesOptions = action.payload.data.customServices?.map(
        (option: any, index: number) => ({
          value: index,
          label: option,
        })
      );
      state.actionOptions = action.payload.data.actions?.map(
        (option: any, index: number) => ({
          value: index,
          label: option,
        })
      );
    },
    reducerUserReportsInputValues: (
      state: Draft<any>,
      action: PayloadAction<any>
    ) => {
      state.reportsInputValues = action.payload;
      state.reportContracts = action.payload?.contracts;
      state.formattedDateFrom = moment(action.payload.fromDate).format(
        "DD/MM/YYYY"
      );
      state.formattedDateTo = moment(action.payload.toDate).format(
        "DD/MM/YYYY"
      );
    },
    reducerReportsStatus: (state: Draft<any>, action: PayloadAction<any>) => {
      state.reportsStatus = action?.payload?.reportsStatus;
      state.reportsRequestPurpose = action?.payload?.reportsRequestPurpose;
    },
    reducerSelectedReports: (state: Draft<any>, action: PayloadAction<any>) => {
      state.selectedReportsId = action.payload;
    },
    reducerSelectedUpdateStatus: (
      state: Draft<any>,
      action: PayloadAction<any>
    ) => {
      state.updateStatus = action.payload;
    },
    reducerReportsSettings: (state: Draft<any>, action: PayloadAction<any>) => {
      state.reportsSettings = action.payload;
    },
    reducerAdminReportsSettings: (
      state: Draft<any>,
      action: PayloadAction<any>
    ) => {
      state.adminReportsSettings = action.payload;
    },
    reducerHeaderBtn: (state: Draft<any>, action: PayloadAction<any>) => {
      state.actualPurpose = action.payload.purpose;
      state.actualModalTitle = action.payload.title;
    },
  },
});

export const {
  reducerGetUnloadReportsPhotoFilters,
  reducerUserReportsInputValues,
  reducerGetUserReportsFilters,
  reducerSelectedUpdateStatus,
  reducerAdminReportsSettings,
  reducerSelectedReports,
  reducerReportsSettings,
  reducerReportsStatus,
  reducerUserReports,
  reducerHeaderBtn,
} = reportsSlice.actions;

export default reportsSlice.reducer;
