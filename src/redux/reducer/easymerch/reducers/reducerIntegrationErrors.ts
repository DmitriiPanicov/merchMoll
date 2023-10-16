import { createSlice, Draft, PayloadAction } from "@reduxjs/toolkit";

const initialState: any = {
  integrationErrors: null,
  integrationErrorsCount: null,
  limit: JSON.parse(localStorage.getItem("pageLimit") as string) || 10,
  offset: 0,
  filters: [],
  integrationErrorsInputValues: {
    date: "",
    types: null,
    description: "",
    visitNo: "",
    address: "",
    contracts: [],
    projects: [],
    merchs: [],
    sv: [],
    vsv: [],
    personId: "",
    userId: "",
  },
};

export const integrationErrorsSlice = createSlice({
  name: "integrationErrors",
  initialState,
  reducers: {
    reducerGetIntegrationErrors: (
      state: Draft<any>,
      action: PayloadAction<any>
    ) => {
      state.integrationErrors = action?.payload?.data?.incidents?.data || [];
      state.integrationErrorsCount = action?.payload?.data?.incidents?.count;
      state.integrationErrorsFilter = action?.payload?.data?.incidentFilter;
      state.limit = action.payload.limit;
      state.offset = action.payload.offset;
      state.lastUpdate = action?.payload?.data?.lastUpdate;
      state.contractOptions =
        action?.payload?.data?.incidentFilter?.contracts.map((option: any) => ({
          value: option.id,
          label: option.name,
        }));
      state.projectOptions =
        action?.payload?.data?.incidentFilter?.projects.map((option: any) => ({
          value: option.id,
          label: option.name,
        }));
      state.merchsOptions = action?.payload?.data?.incidentFilter?.merchs.map(
        (option: any) => ({
          value: option.id,
          label: option.name,
        })
      );
      state.svOptions = action?.payload?.data?.incidentFilter?.sv.map(
        (option: any) => ({
          value: option.id,
          label: option.name,
        })
      );
      state.vsvOptions = action?.payload?.data?.incidentFilter?.vsv.map(
        (option: any) => ({
          value: option.id,
          label: option.name,
        })
      );
    },
    reducerIntegrationErrorsInputValues: (
      state: Draft<any>,
      action: PayloadAction<any>
    ) => {
      state.integrationErrorsInputValues = action?.payload;
    },
    reducerIntegrationErrorsStatus: (
      state: Draft<any>,
      action: PayloadAction<any>
    ) => {
      state.status = action.payload;
    },
  },
});

export const {
  reducerIntegrationErrorsInputValues,
  reducerIntegrationErrorsStatus,
  reducerGetIntegrationErrors,
} = integrationErrorsSlice.actions;

export default integrationErrorsSlice.reducer;
