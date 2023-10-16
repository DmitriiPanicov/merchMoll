import { createSlice, Draft, PayloadAction } from "@reduxjs/toolkit";

const initialState: any = {
  customers: null,
  customersCount: null,
  limit: JSON.parse(localStorage.getItem("pageLimit") as string) || 10,
  pages: 0,
  customerInputValues: {
    login: null,
    contracts: [],
  },
};

export const customerListSlice = createSlice({
  name: "customerList",
  initialState,
  reducers: {
    reducerCustomerList: (state: Draft<any>, action: PayloadAction<any>) => {
      state.customers = action.payload.data || [];
      state.customersCount = action.payload.count;
      state.limit = action.payload.limit;
    },
    reducerClientsInputValues: (
      state: Draft<any>,
      action: PayloadAction<any>
    ) => {
      state.customerInputValues = action.payload;
    },
    reducerClientsStatus: (state: Draft<any>, action: PayloadAction<any>) => {
      state.clientsStatus = action.payload;
    },
    reducerClientsFilters: (state: Draft<any>, action: PayloadAction<any>) => {
      state.clientsFilters = action.payload;
      state.contractsOptions = action.payload?.contracts?.map(
        (option: any) => ({
          value: option.id,
          label: option.name,
        })
      );
    },
    reducerClientContracts: (state: Draft<any>, action: PayloadAction<any>) => {
      state.clientContractsList = action.payload.sort((a: any, b: any) =>
        a.contract.name.localeCompare(b.contract.name)
      );
      state.clientContractsLength = action.payload?.length;
      state.allContractsForUpdate = action.payload?.map((elem: any) => {
        return {
          id: elem.contract.id,
        };
      });
      state.activeContracts = action.payload
        ?.filter((elem: any) => elem.active)
        ?.map((contract: any) => contract.contract.id);
    },
    reducerClientRegions: (state: Draft<any>, action: PayloadAction<any>) => {
      state.clientRegionsList = action.payload.sort((a: any, b: any) =>
        a.region.name.localeCompare(b.region.name)
      );
      state.clientRegionsLength = action.payload?.length;
      state.activeRegions = action.payload
        ?.filter((elem: any) => elem.active)
        ?.map((region: any) => region.region.id);
      state.allRegionsForUpdate = action.payload?.map((elem: any) => ({
        region: {
          id: elem.region.id,
        },
        areas: elem.areas.map((obj: any) => ({
          area: {
            id: obj.area.id,
          },
        })),
      }));
    },
    reducerClientSettings: (state: Draft<any>, action: PayloadAction<any>) => {
      state.clientSettings = action.payload;
    },
    reducerClientFilters: (state: Draft<any>, action: PayloadAction<any>) => {
      state.declineEndPeriodsOptions = Object.entries(
        action.payload.formData.declineEndPeriods
      ).map(([key, value]) => ({
        value: parseInt(key),
        label: value,
      }));

      state.selectedEndPeriodOption = state.declineEndPeriodsOptions.find(
        (option: any) =>
          option.value === action.payload.settings.declinePeriodEnd.value
      );

      state.declineStartPeriodsOptions = Object.entries(
        action.payload.formData.declineStartPeriods
      ).map(([key, value]) => ({
        value: parseInt(key),
        label: value,
      }));

      state.selectedStartPeriodOption = state.declineStartPeriodsOptions.find(
        (option: any) =>
          option.value === action.payload.settings.declinePeriodStart.value
      );

      state.reportDelaysOptions = Object.entries(
        action.payload.formData.reportDelays
      ).map(([key, value]) => ({
        value: parseInt(key),
        label: value,
      }));

      state.selectedReportDelayOption = state.reportDelaysOptions.find(
        (option: any) =>
          option.value === action.payload.settings.reportsDelay.value
      );
      state.fixHours = action.payload.settings.fixHours;
      state.geo = action.payload.settings.geo;
      state.regionRestriction = action.payload.settings.regionRestriction;
      state.visitSchedule = action.payload.settings.visitSchedule;
      state.reviewStatus = action.payload.settings.reviewStatus;
      state.reviewHistory = action.payload.settings.reviewHistory;
      state.onlyPhotoAndGeo = action.payload.settings.onlyPhotoAndGeo;
      state.fixByNextVisit = action.payload.settings.fixByNextVisit;
      state.hidePhotoGeo = action.payload.settings.hidePhotoGeo;
      state.showReportCheckTypes = action.payload.settings.showReportCheckTypes;
      state.reviewer = action.payload.settings.reviewer;
      state.multiReviewReason = action.payload.settings.multiReviewReason;
      state.periodOsa = action.payload.settings.periodOsa;
      state.averageFacing = action.payload.settings.averageFacing;
      state.shareOfShelf = action.payload.settings.shareOfShelf;
      state.acceptReviewReasons = action.payload.settings.acceptReviewReasons;
      state.reviewStatusesValue =
        action.payload.settings.reviewStatuses.value.map((elem: any) =>
          Object.keys(elem).toString()
        );
      state.reportsFromDate = action.payload.settings.reportsFrom
        .split("-")
        .reverse()
        .map((elem: any) => parseFloat(elem));
    },
  },
});

export const {
  reducerClientsInputValues,
  reducerClientContracts,
  reducerClientsFilters,
  reducerClientSettings,
  reducerClientFilters,
  reducerClientsStatus,
  reducerClientRegions,
  reducerCustomerList,
} = customerListSlice.actions;

export default customerListSlice.reducer;
