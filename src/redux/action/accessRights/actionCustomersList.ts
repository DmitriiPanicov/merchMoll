import axios from "axios";
import jsSHA from "jssha";

import {
  reducerClientsFilters,
  reducerClientsStatus,
  reducerCustomerList,
} from "../../reducer/accessRights/reducers/customersList";
import { AppDispatch } from "../../reducer/store";
import { getToken } from "../axiosToken";

const BASE_URL = process.env.REACT_APP_BASE_URL;

export const actionGetCustomersList =
  (limit: any, offset: any) =>
  async (dispatch: AppDispatch, getState: () => any) => {
    const { token } = await getToken();
    axios.defaults.headers.common["Authorization"] = token;

    const store = getState();
    const filter = store.roles.customerList.customerInputValues;

    const response = await axios.post(`${BASE_URL}/json/auth/customer/list`, {
      limit,
      offset,
      ...filter,
    });

    dispatch(reducerCustomerList(response.data));
  };

export const actionGetCustomersFilters =
  () => async (dispatch: AppDispatch) => {
    const { token } = await getToken();
    axios.defaults.headers.common["Authorization"] = token;

    const response = await axios.get(
      `${BASE_URL}/json/auth/customer/list/filters`
    );

    dispatch(reducerClientsFilters(response.data));
  };

export const actionDeleteCustomer =
  (id: any) => async (dispatch: AppDispatch, getState: () => any) => {
    const { token } = await getToken();
    axios.defaults.headers.common["Authorization"] = token;

    const store = getState();
    const customerList = store.roles.customerList;

    try {
      await axios.delete(`${BASE_URL}/json/auth/customer/delete/${id}`);

      dispatch(
        reducerCustomerList({
          ...customerList,
          data: customerList.customers.filter(
            (elem: any) => elem?.customer?.id !== id
          ),
          count: customerList.customersCount,
        })
      );

      dispatch(reducerClientsStatus("deleteSuccess"));
    } catch (err) {
      dispatch(reducerClientsStatus("deleteError"));
    }
  };

export const actionAddNewCustomer =
  (data: any) => async (dispatch: AppDispatch, getState: () => any) => {
    const { token } = await getToken();
    axios.defaults.headers.common["Authorization"] = token;

    const store = getState();
    const customerList = store.roles.customerList;

    const shaObj = new jsSHA("SHA-1", "TEXT", { encoding: "UTF8" });
    shaObj.update(data.password);
    const hashedPassword = shaObj.getHash("B64");

    try {
      const response = await axios.post(
        `${BASE_URL}/json/auth/customer/create`,
        { ...data, passwordHash: hashedPassword }
      );

      dispatch(
        reducerCustomerList({
          ...customerList,
          data: [...customerList.customers, response.data],
          count: customerList.customersCount,
        })
      );

      dispatch(reducerClientsStatus(response.status));
    } catch (err) {
      dispatch(reducerClientsStatus(0));
    }
  };

export const actionUpdateCustomer =
  (data: any, id: any) =>
  async (dispatch: AppDispatch, getState: () => any) => {
    const { token } = await getToken();
    axios.defaults.headers.common["Authorization"] = token;

    const store = getState();
    const customerList = store.roles.customerList;

    const shaObj = new jsSHA("SHA-1", "TEXT", { encoding: "UTF8" });
    shaObj.update(data.password);
    const hashedPassword = shaObj.getHash("B64");

    try {
      await axios.patch(`${BASE_URL}/json/auth/customer/update`, {
        ...data,
        passwordHash: hashedPassword,
        customer: {
          id: id,
        },
      });

      const updatedData = customerList.customers.map((elem: any) => {
        return elem.customer.id === id
          ? {
              ...elem,
              customer: {
                id: id,
                name: data.login,
              },
              password: data.password,
              email: data.email,
            }
          : elem;
      });

      dispatch(
        reducerCustomerList({
          ...customerList,
          data: updatedData,
          count: customerList.customersCount,
        })
      );

      dispatch(reducerClientsStatus("updateSuccess"));
    } catch (err) {
      dispatch(reducerClientsStatus("updateError"));
    }
  };
