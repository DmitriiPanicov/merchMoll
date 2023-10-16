import { FC, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast, { Toaster } from "react-hot-toast";
import { Link } from "react-router-dom";

import clsx from "clsx";

import {
  actionGetCustomersFilters,
  actionGetCustomersList,
  actionDeleteCustomer,
  actionAddNewCustomer,
  actionUpdateCustomer,
} from "../../../redux/action/accessRights/actionCustomersList";
import {
  reducerClientsInputValues,
  reducerClientsStatus,
} from "../../../redux/reducer/accessRights/reducers/customersList";
import { generateStyles } from "../../../utils/generateToastStyles";
import { AppDispatch } from "../../../redux/reducer/store";

import CustomMultiSelect from "../../custom/customMultiSelect/customMultiSelect";
import LimitSelect from "../../custom/limitSelect/limitSelect";
import ToastPopup from "../../custom/toastPopup/toastPopup";
import Pagination from "../../pagination/pagination";
import Loader from "../../custom/loader/loader";

import Checkbox from "../../../assets/images/checkbox.png";
import Delete from "../../../assets/images/delete.png";
import Edit from "../../../assets/images/edit.png";

import "../table.scss";

const IS_VISIBLE_SIDEBAR = process.env.REACT_APP_IS_VISIBLE_SIDEBAR;

const requestStatusOptions = [
  {
    status: 200,
    successMessage: "Новый клиент успешно добавлен!",
  },
  {
    status: 0,
    errorMessage: "При добавлении клиента произошла ошибка!",
  },
  {
    status: "deleteSuccess",
    successMessage: "Клиент успешно удален!",
  },
  {
    status: "deleteError",
    errorMessage: "При удалении клиента произошла ошибка!",
  },
  {
    status: "invalidEmail",
    errorMessage: "Некорректный адрес электронной почты!",
  },
  {
    status: "noData",
    errorMessage: "Необходимо заполнить недостающие значения!",
  },
  {
    status: "updateSuccess",
    successMessage: "Данные клиента успешно обновлены!",
  },
  {
    status: "updateError",
    errorMessage: "При обновлении данных клиента произошла ошибка!",
  },
];

const TableCustomersList: FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const {
    customerInputValues,
    contractsOptions,
    customersCount,
    clientsStatus,
    customers,
    limit,
    pages,
  } = useSelector((state: any) => state.roles.customerList);
  const { isOpenSidebar } = useSelector((state: any) => state.user.user);

  const [submitButtonClicked, setSubmitButtonClicked] =
    useState<boolean>(false);
  const [editButtonClicked, setEditButtonClicked] = useState<boolean>(false);
  const [isInputChange, setIsInputChange] = useState<boolean>(false);
  const [isPending, setIsPending] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [editRowId, setEditRowId] = useState(null);
  const [startPage, setStartPage] = useState(1);
  const [newUserData, setNewUserData] = useState({
    login: "",
    password: "",
    email: "",
  });
  const [editedData, setEditedData] = useState({
    login: "",
    password: "",
    email: "",
  });

  const actualLimit =
    JSON.parse(localStorage.getItem("pageLimit") as string) || limit;

  useEffect(() => {
    dispatch(actionGetCustomersList(limit, pages));
    dispatch(actionGetCustomersFilters());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    requestStatusOptions.forEach((option: any) => {
      if (clientsStatus === option.status) {
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

    dispatch(reducerClientsStatus(null));
  }, [dispatch, clientsStatus]);

  useEffect(() => {
    const handleDocumentClick = () => {
      dispatch(actionGetCustomersList(limit, pages));
      setIsInputChange(false);
      resetPages();
    };

    if (isInputChange) {
      document.addEventListener("click", handleDocumentClick);

      return () => {
        document.removeEventListener("click", handleDocumentClick);
      };
    } else
      return () => {
        document.removeEventListener("click", handleDocumentClick);
      };
  }, [dispatch, isInputChange, limit, pages]);

  const handleInputChange = (event: any, name: string, isEdit?: boolean) => {
    if (!isEdit) {
      setNewUserData((prevUserData) => ({
        ...prevUserData,
        [name]: event.target.value,
      }));
    } else {
      setEditedData((prevData) => ({
        ...prevData,
        [name]: event.target.value,
      }));
    }
  };

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const resetEditedData = () => {
    setEditedData({
      login: "",
      password: "",
      email: "",
    });
  };

  const saveRow = (id: any) => {
    setEditButtonClicked(true);

    if (!editedData.login || !editedData.password || !editedData.email) {
      return;
    } else {
      if (!isValidEmail(editedData.email)) {
        dispatch(reducerClientsStatus("invalidEmail"));
      } else {
        dispatch(actionUpdateCustomer(editedData, id));
        setEditButtonClicked(false);
        setEditRowId(null);
        resetEditedData();
      }
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
      login: rowData.customer.name,
      password: rowData.password,
      email: rowData.email,
    });
  };

  const handleAddNewClient = () => {
    setSubmitButtonClicked(true);

    if (!newUserData.login || !newUserData.password || !newUserData.email) {
      dispatch(reducerClientsStatus("noData"));
    } else {
      if (!isValidEmail(newUserData.email)) {
        dispatch(reducerClientsStatus("invalidEmail"));
      } else {
        dispatch(actionAddNewCustomer(newUserData));
        setSubmitButtonClicked(false);
        setNewUserData({
          login: "",
          password: "",
          email: "",
        });
      }
    }
  };

  const resetPages = () => {
    setCurrentPage(1);
    setStartPage(1);
  };

  const handleKeyPress = (event: any) => {
    if (event.key === "Enter") {
      dispatch(actionGetCustomersList(limit, pages));
      setIsInputChange(false);
      resetPages();
    }
  };

  const handleFilterInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = event.target;

    if (value === "") {
      const updatedInputValues = { ...customerInputValues };
      delete updatedInputValues[name];

      dispatch(reducerClientsInputValues(updatedInputValues));
    } else {
      dispatch(
        reducerClientsInputValues({
          ...customerInputValues,
          [name]: value,
        })
      );
    }

    setIsInputChange(true);
  };

  const handleChange = (newLimit: number, newOffset: number) => {
    setIsPending(true);
    dispatch(actionGetCustomersList(newLimit, newOffset)).then(() => {
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
        {(!customers || isPending) && <Loader />}
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
              <tr className="clients__list_head">
                <th>
                  <div className="filter__number_block">
                    <input
                      defaultValue={
                        customerInputValues.login && customerInputValues.login
                      }
                      onChange={handleFilterInputChange}
                      onKeyPress={handleKeyPress}
                      placeholder=" "
                      name="login"
                      type="text"
                    />
                    <label>Логин</label>
                  </div>
                </th>
                <th>
                  <span className="filter__title">Пароль</span>
                </th>
                <th>
                  <span className="filter__title">Email</span>
                </th>
                <th colSpan={3}>
                  <div className="reports__contract_block">
                    <CustomMultiSelect
                      reducer={reducerClientsInputValues}
                      inputValues={customerInputValues}
                      action={actionGetCustomersList}
                      options={contractsOptions}
                      isShowPlaceholder={true}
                      resetPages={resetPages}
                      placeholder="Контракты"
                      pageName="clientsList"
                      name="contracts"
                      offset={pages}
                      limit={limit}
                    />
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {customers &&
                customers.map((elem: any, index: number) => (
                  <tr key={index}>
                    <td className="error__td">
                      {editRowId === elem.customer.id ? (
                        <>
                          <input
                            className={
                              editButtonClicked && !editedData.login
                                ? "error__edit_input"
                                : "edit__input"
                            }
                            value={editedData.login}
                            onChange={(event) =>
                              handleInputChange(event, "login", true)
                            }
                            name="login"
                            type="text"
                          />
                          {editButtonClicked && !editedData.login && (
                            <div className="edit__error_message">
                              Вы должны указать значение логина.
                            </div>
                          )}
                        </>
                      ) : (
                        <Link
                          to={`info/${elem?.customer?.id}`}
                          className="file__link"
                        >
                          {elem?.customer?.name}
                        </Link>
                      )}
                    </td>
                    <td className="error__td">
                      {editRowId === elem.customer.id ? (
                        <>
                          <input
                            className={
                              editButtonClicked && !editedData.password
                                ? "error__edit_input"
                                : "edit__input"
                            }
                            value={editedData.password}
                            onChange={(event) =>
                              handleInputChange(event, "password", true)
                            }
                            name="password"
                            type="text"
                          />
                          {editButtonClicked && !editedData.password && (
                            <div className="edit__error_message">
                              Вы должны указать значение пароля.
                            </div>
                          )}
                        </>
                      ) : (
                        elem?.password
                      )}
                    </td>
                    <td className="error__td">
                      {editRowId === elem.customer.id ? (
                        <>
                          <input
                            className={
                              editButtonClicked && !editedData.email
                                ? "error__edit_input"
                                : "edit__input"
                            }
                            value={editedData.email}
                            onChange={(event) =>
                              handleInputChange(event, "email", true)
                            }
                            name="email"
                            type="text"
                          />
                          {editButtonClicked && !editedData.email && (
                            <div className="edit__error_message">
                              Вы должны указать значение почты.
                            </div>
                          )}
                        </>
                      ) : (
                        <a
                          className="file__link"
                          href={`mailto::${elem?.email}`}
                        >
                          {elem?.email}
                        </a>
                      )}
                    </td>
                    <td>{elem?.contracts?.join(", ")}</td>
                    <td>
                      {editRowId === elem?.customer?.id ? (
                        <>
                          <img
                            onClick={() => saveRow(elem?.customer?.id)}
                            className="customers__icon"
                            src={Checkbox}
                            alt="save"
                          />
                        </>
                      ) : (
                        <>
                          <img
                            onClick={() =>
                              handleEditClick(elem?.customer?.id, elem)
                            }
                            className="customers__icon"
                            src={Edit}
                            alt="edit"
                          />
                        </>
                      )}
                    </td>
                    <td>
                      <img
                        onClick={
                          !editRowId
                            ? () =>
                                dispatch(
                                  actionDeleteCustomer(elem?.customer?.id)
                                )
                            : handleCancelEditClick
                        }
                        className="customers__icon"
                        src={Delete}
                        alt="delete"
                      />
                    </td>
                  </tr>
                ))}
              <tr className="new__client_block">
                <td>
                  <div className={clsx("filter__block", "new__client_block")}>
                    <input
                      className={
                        (submitButtonClicked &&
                          !newUserData.login &&
                          "error__input") ||
                        ""
                      }
                      onChange={(event) => handleInputChange(event, "login")}
                      value={newUserData.login}
                      placeholder=" "
                      name="login"
                      type="text"
                    />
                    <label>Логин</label>
                  </div>
                </td>
                <td>
                  <div className={clsx("filter__block", "new__client_block")}>
                    <input
                      className={
                        (submitButtonClicked &&
                          !newUserData.password &&
                          "error__input") ||
                        ""
                      }
                      onChange={(event) => handleInputChange(event, "password")}
                      value={newUserData.password}
                      placeholder=" "
                      name="password"
                      type="text"
                    />
                    <label>Пароль</label>
                  </div>
                </td>
                <td>
                  <div className={clsx("filter__block", "new__client_block")}>
                    <input
                      className={
                        (submitButtonClicked &&
                          !newUserData.email &&
                          "error__input") ||
                        ""
                      }
                      onChange={(event) => handleInputChange(event, "email")}
                      value={newUserData.email}
                      placeholder=" "
                      name="email"
                      type="text"
                    />
                    <label>Email</label>
                  </div>
                </td>
                <td colSpan={3}>
                  <button onClick={handleAddNewClient} className="table-button">
                    Добавить клиента
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="pagination">
          <div className="pagination__count">Всего: {customersCount}</div>
          <div className="pagination__str">
            <span>Отображать строки</span>
            <LimitSelect limit={actualLimit} propsChange={handleChangeLimits} />
          </div>
          <Pagination
            setCurrentPage={setCurrentPage}
            setStartPage={setStartPage}
            handleChange={handleChange}
            currentPage={currentPage}
            count={customersCount}
            startPage={startPage}
            limit={actualLimit}
          />
        </div>
      </div>
    </>
  );
};

export default TableCustomersList;
