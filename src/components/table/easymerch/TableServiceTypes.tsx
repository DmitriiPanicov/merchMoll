import { useState, useEffect, FC } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast, { Toaster } from "react-hot-toast";

import clsx from "clsx";

import {
  reducerGetServiceTypes,
  reducerServiceTypesStatus,
} from "../../../redux/reducer/easymerch/reducers/reducerServiceTypes";
import { generateStyles } from "../../../utils/generateToastStyles";
import { AppDispatch } from "../../../redux/reducer/store";
import {
  actionGetServiceTypesSelect,
  actionRemoveServiceType,
  actionUpdateServiceType,
  actionPostServiceTypes,
  actionGetServiceTypes,
} from "../../../redux/action/easymerch/actionServiceTypes";

import LimitSelect from "../../custom/limitSelect/limitSelect";
import ToastPopup from "../../custom/toastPopup/toastPopup";
import Pagination from "../../pagination/pagination";
import Select from "../../custom/select/select";
import Loader from "../../custom/loader/loader";

import Checkbox from "../../../assets/images/checkbox.png";
import Delete from "../../../assets/images/delete.png";
import Edit from "../../../assets/images/edit.png";

import "../table.scss";

const IS_VISIBLE_SIDEBAR = process.env.REACT_APP_IS_VISIBLE_SIDEBAR;

const requestStatusOptions = [
  {
    status: 200,
    successMessage: "Тип обслуживания успешно добавлен!",
  },
  {
    status: 0,
    errorMessage: "При добавлении типа обслуживания произошла ошибка!",
  },
  {
    status: "noData",
    errorMessage: "Необходимо заполнить недостающие значения!",
  },
];

const TableServiceTypes: FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const {
    serviceTypesCount,
    selectContact,
    serviceStatus,
    serviceTypes,
    limit,
    offset,
  } = useSelector((state: any) => state.easymerch.serviceTypes);
  const { isOpenSidebar } = useSelector((state: any) => state.user.user);

  const [submitButtonClicked, setSubmitButtonClicked] =
    useState<boolean>(false);
  const [editButtonClicked, setEditButtonClicked] = useState<boolean>(false);
  const [isPending, setIsPending] = useState<boolean>(false);
  const [editRowId, setEditRowId] = useState(null);
  const [editedData, setEditedData] = useState({
    id: 0,
    contractId: 0,
    contractName: "",
    emId: "",
    emCode: "",
    emName: "",
  });
  const [newUserData, setNewUserData] = useState({
    emId: "",
    contractName: "",
    emCode: "",
    emName: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [startPage, setStartPage] = useState(1);

  const actualLimit =
    JSON.parse(localStorage.getItem("pageLimit") as string) || limit;

  const defaultContractValue = selectContact?.data?.find(
    (option: any) => option.name === editedData.contractName
  );
  const contractCondition = submitButtonClicked && !newUserData.contractName;

  useEffect(() => {
    dispatch(actionGetServiceTypes(actualLimit, offset));
    dispatch(actionGetServiceTypesSelect());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    requestStatusOptions.forEach((option: any) => {
      if (serviceStatus === option.status) {
        toast.dismiss();

        toast(
          (t) => (
            <ToastPopup
              title={
                option.successMessage
                  ? option.successMessage
                  : option.errorMessage
              }
              isSuccess={option.successMessage ? true : false}
              toast={toast}
              t={t}
            />
          ),
          generateStyles(option.successMessage ? true : false)
        );
      }
    });

    dispatch(reducerServiceTypesStatus(null));
  }, [dispatch, serviceStatus]);

  const deleteType = (id: any) => {
    dispatch(actionRemoveServiceType(id));

    const filteredServicesTypes = serviceTypes.filter(
      (serviceType: any) => serviceType.id !== id
    );

    dispatch(
      reducerGetServiceTypes({
        data: { data: filteredServicesTypes, count: serviceTypesCount - 1 },
        limit,
        offset,
      })
    );
  };

  const resetEditedData = () => {
    setEditedData({
      id: 0,
      contractId: 0,
      contractName: "",
      emId: "",
      emCode: "",
      emName: "",
    });
  };

  const sendRequestToServer = () => {
    setSubmitButtonClicked(true);

    if (
      !newUserData.emId ||
      !newUserData.emCode ||
      !newUserData.emName ||
      !newUserData.contractName
    ) {
      dispatch(reducerServiceTypesStatus("noData"));
    } else {
      dispatch(actionPostServiceTypes(newUserData)).then(() => {
        handleChange(limit, 0);
        setCurrentPage(1);
        setStartPage(1);
      });

      setSubmitButtonClicked(false);
      setNewUserData({
        contractName: "",
        emId: "",
        emCode: "",
        emName: "",
      });
    }
  };

  const saveRow = (id: any) => {
    setEditButtonClicked(true);

    if (
      !editedData.contractId ||
      !editedData.emId ||
      !editedData.emCode ||
      !editedData.emName
    ) {
      return;
    } else {
      dispatch(
        actionUpdateServiceType({
          ...editedData,
          emId: parseFloat(editedData.emId),
        })
      );

      const updateServiceType = serviceTypes.map((service: any) => {
        return service.id === id ? editedData : service;
      });

      dispatch(
        reducerGetServiceTypes({
          data: { data: updateServiceType, count: serviceTypesCount },
          limit,
          offset,
        })
      );

      setEditButtonClicked(false);
      setEditRowId(null);
      resetEditedData();
    }
  };

  const handleCancelEditClick = () => {
    setEditButtonClicked(false);
    setEditRowId(null);
    resetEditedData();
  };

  const handleEditClick = (id: any, rowData: any) => {
    setEditRowId(id);

    setEditedData({
      id: rowData.id,
      contractId: rowData.contractId,
      contractName: rowData.contractName,
      emId: rowData.emId,
      emCode: rowData.emCode,
      emName: rowData.emName,
    });
  };

  const inputChange = (event: any) => {
    const { name, value } = event.target;

    setEditedData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const selectChange = (event: any) => {
    setEditedData((prevData) => ({
      ...prevData,
      contractId: event.value,
      contractName: event.label || prevData.contractName,
    }));
  };

  const handleInputChange = (event: any, name: string) => {
    setNewUserData((prevUserData) => ({
      ...prevUserData,
      [name]: event.target.value,
    }));
  };

  const handleSelectChange = (event: any) => {
    setNewUserData((prevUserData) => ({
      ...prevUserData,
      contractId: event.value,
      contractName: event.label,
    }));
  };

  const handleChange = (newLimit: number, newOffset: number) => {
    setIsPending(true);
    dispatch(actionGetServiceTypes(newLimit, newOffset)).then(() => {
      setIsPending(false);
    });
    localStorage.setItem("pageLimit", JSON.stringify(newLimit));
  };

  const handleChangeLimits = (option: any) => {
    handleChange(option.value, 0);
    setCurrentPage(1);
    setStartPage(1);
  };

  return (
    <>
      <div className="loader__wrapper">
        {(!serviceTypes || isPending) && <Loader />}
      </div>
      <div
        className={clsx(
          JSON.parse(IS_VISIBLE_SIDEBAR as string) &&
            isOpenSidebar &&
            "active__table",
          !isOpenSidebar && "closed__table",
          "table"
        )}
      >
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 5000,
          }}
        />
        <div className="table__wrapper">
          <table>
            <thead>
              <tr className="services__types_tr">
                <th>
                  <span className="filter__title">ID</span>
                </th>
                <th>
                  <div className="filter__block">
                    <Select
                      options={
                        typeof selectContact !== "undefined" &&
                        selectContact?.data?.map((option: any) => ({
                          value: option.id,
                          label: option.name,
                        }))
                      }
                      value={
                        newUserData.contractName
                          ? { value: "", label: newUserData.contractName }
                          : null
                      }
                      isDifStyles={contractCondition && true}
                      className={clsx(
                        "users__filter",
                        contractCondition && "contract__select_error"
                      )}
                      isShowPlaceholder={!!newUserData.contractName}
                      propsChange={handleSelectChange}
                      placeholder="Контракт"
                    />
                  </div>
                </th>
                <th>
                  <div className="filter__block">
                    <input
                      className={
                        (submitButtonClicked &&
                          !newUserData.emId &&
                          "error__input") ||
                        ""
                      }
                      onChange={(event) => handleInputChange(event, "emId")}
                      value={newUserData.emId}
                      placeholder=" "
                      name="newEmId"
                      type="number"
                    />
                    <label>ID EM</label>
                  </div>
                </th>
                <th>
                  <div className="filter__block">
                    <input
                      className={
                        (submitButtonClicked &&
                          !newUserData.emCode &&
                          "error__input") ||
                        ""
                      }
                      onChange={(event) => handleInputChange(event, "emCode")}
                      value={newUserData.emCode}
                      name="newEmCode"
                      placeholder=" "
                      type="text"
                    />
                    <label>Внешн. код EM</label>
                  </div>
                </th>
                <th>
                  <div className="filter__block">
                    <input
                      className={
                        (submitButtonClicked &&
                          !newUserData.emName &&
                          "error__input") ||
                        ""
                      }
                      onChange={(event) => handleInputChange(event, "emName")}
                      value={newUserData.emName}
                      name="newEmName"
                      placeholder=" "
                      type="text"
                    />
                    <label>Название</label>
                  </div>
                </th>
                <th className="th__without_border" colSpan={2}>
                  <button
                    className="table-button"
                    onClick={sendRequestToServer}
                  >
                    Добавить тип обслуживания
                  </button>
                </th>
              </tr>
            </thead>
            <tbody>
              {serviceTypes &&
                serviceTypes.map((report: any, index: number) => {
                  const menuPlacement =
                    serviceTypes.length > 5 && index >= serviceTypes.length - 5
                      ? "top"
                      : "auto";

                  return (
                    <tr key={index}>
                      <td>{report.id}</td>
                      <td>
                        {editRowId === report.id ? (
                          <Select
                            options={
                              typeof selectContact !== "undefined" &&
                              selectContact?.data?.map((option: any) => ({
                                value: option.id,
                                label: option.name,
                              }))
                            }
                            defaultValue={{
                              value: defaultContractValue.id,
                              label: defaultContractValue.name,
                            }}
                            menuPlacement={menuPlacement}
                            propsChange={selectChange}
                            className="selectEdit"
                          />
                        ) : (
                          report.contractName
                        )}
                      </td>
                      <td className="error__td">
                        {editRowId === report.id ? (
                          <>
                            <input
                              className={
                                editButtonClicked && !editedData.emId
                                  ? "error__edit_input"
                                  : "edit__input"
                              }
                              value={editedData.emId}
                              onChange={inputChange}
                              type="number"
                              name="emId"
                            />
                            {editButtonClicked && !editedData.emId && (
                              <div className="edit__error_message">
                                Вы должны указать значение для Em Id Field.
                              </div>
                            )}
                          </>
                        ) : (
                          report.emId
                        )}
                      </td>
                      <td className="error__td">
                        {editRowId === report.id ? (
                          <>
                            <input
                              className={
                                editButtonClicked && !editedData.emCode
                                  ? "error__edit_input"
                                  : "edit__input"
                              }
                              value={editedData.emCode}
                              onChange={inputChange}
                              name="emCode"
                              type="text"
                            />
                            {editButtonClicked && !editedData.emCode && (
                              <div className="edit__error_message">
                                Вы должны указать значение для Em Code Field.
                              </div>
                            )}
                          </>
                        ) : (
                          report.emCode
                        )}
                      </td>
                      <td className="error__td">
                        {editRowId === report.id ? (
                          <>
                            <input
                              className={
                                editButtonClicked && !editedData.emName
                                  ? "error__edit_input"
                                  : "edit__input"
                              }
                              value={editedData.emName}
                              onChange={inputChange}
                              name="emName"
                              type="text"
                            />
                            {editButtonClicked && !editedData.emName && (
                              <div className="edit__error_message">
                                Вы должны указать значение для Em Name Field.
                              </div>
                            )}
                          </>
                        ) : (
                          report.emName
                        )}
                      </td>
                      <td>
                        {editRowId === report.id ? (
                          <>
                            <img
                              onClick={() => saveRow(report.id)}
                              className="table-button-img"
                              src={Checkbox}
                              alt=""
                            />
                          </>
                        ) : (
                          <>
                            <img
                              onClick={() => handleEditClick(report.id, report)}
                              className="table-button-img"
                              src={Edit}
                              alt=""
                            />
                          </>
                        )}
                      </td>
                      <td>
                        <img
                          onClick={
                            !editRowId
                              ? () => deleteType(report.id)
                              : handleCancelEditClick
                          }
                          className="table-button-img"
                          src={Delete}
                          alt=""
                        />
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
        <div className="pagination">
          <div className="pagination__count">Всего: {serviceTypesCount}</div>
          <div className="pagination__str">
            <span>Отображать строки</span>
            <LimitSelect limit={actualLimit} propsChange={handleChangeLimits} />
          </div>
          <Pagination
            setCurrentPage={setCurrentPage}
            setStartPage={setStartPage}
            handleChange={handleChange}
            currentPage={currentPage}
            count={serviceTypesCount}
            startPage={startPage}
            limit={actualLimit}
          />
        </div>
      </div>
    </>
  );
};

export default TableServiceTypes;
