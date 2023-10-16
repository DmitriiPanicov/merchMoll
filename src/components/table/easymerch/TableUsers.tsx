import { FC, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast, { Toaster } from "react-hot-toast";

import clsx from "clsx";

import {
  actionGetUsersSelect,
  actionGetUsers,
} from "../../../redux/action/easymerch/actionUsers";
import {
  reducerSelectedContracts,
  reducerUsersInputValues,
  reducerUsersStatus,
} from "../../../redux/reducer/easymerch/reducers/reducerUsers";
import { generateStyles } from "../../../utils/generateToastStyles";
import { AppDispatch } from "../../../redux/reducer/store";

import LimitSelect from "../../custom/limitSelect/limitSelect";
import ToastPopup from "../../custom/toastPopup/toastPopup";
import Pagination from "../../pagination/pagination";
import Select from "../../custom/select/select";
import Loader from "../../custom/loader/loader";

import "../table.scss";

const IS_VISIBLE_SIDEBAR = process.env.REACT_APP_IS_VISIBLE_SIDEBAR;

const requestStatusOptions = [
  {
    status: 200,
    successMessage: "Маршрут отправлен в EasyMerch!",
  },
  {
    status: 0,
    errorMessage: "Ошибка. Маршрут не отправлен в EasyMerch!",
  },
  {
    status: "emptyList",
    errorMessage: "Выделите хотя бы одну запись в таблице!",
  },
];

const TableUsers: FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const {
    usersRequestStatus,
    usersInputValues,
    selectedUsers,
    rolesOptions,
    usersCount,
    offset,
    users,
    limit,
  } = useSelector((state: any) => state.easymerch.users);
  const { isOpenSidebar } = useSelector((state: any) => state.user.user);

  const [isInputChange, setIsInputChange] = useState<boolean>(false);
  const [checkedRows, setCheckedRows] = useState<any>([]);
  const [isPending, setIsPending] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [startPage, setStartPage] = useState(1);

  const actualLimit =
    JSON.parse(localStorage.getItem("pageLimit") as string) || limit;

  useEffect(() => {
    dispatch(actionGetUsers(actualLimit, offset));
    dispatch(actionGetUsersSelect());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (selectedUsers && !selectedUsers.length) {
      setCheckedRows([]);
    }
  }, [selectedUsers]);

  useEffect(() => {
    requestStatusOptions.forEach((option: any) => {
      if (usersRequestStatus === option.status) {
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

    dispatch(reducerUsersStatus(null));
  }, [dispatch, usersRequestStatus]);

  const selectRolesOptions = rolesOptions && [
    { value: "", label: "Не указано" },
    ...rolesOptions,
  ];

  useEffect(() => {
    const handleDocumentClick = () => {
      dispatch(actionGetUsers(limit, offset));
      setIsInputChange(false);
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
  }, [isInputChange, dispatch, limit, offset]);

  const handleRowCheckboxChange = (id: number) => {
    if (checkedRows.includes(id)) {
      setCheckedRows((prevCheckedRows: any) =>
        prevCheckedRows.filter((row: any) => row !== id)
      );

      const filteredSelectedUsers =
        users &&
        users
          ?.slice()
          ?.filter((user: any) => checkedRows?.includes(user.emData.emId))
          ?.filter((row: any) => row.emData.emId !== id)
          ?.map((elem: any) => elem.idMol);

      dispatch(reducerSelectedContracts(filteredSelectedUsers));
    } else {
      setCheckedRows((prevCheckedRows: any) => [...prevCheckedRows, id]);

      const filteredSelectedUsers =
        users &&
        users
          ?.slice()
          ?.filter((user: any) => checkedRows?.includes(user.emData.emId))
          ?.map((elem: any) => elem.idMol);

      const elementToAdd =
        users && users.find((elem: any) => elem.emData.emId === id).idMol;

      dispatch(
        reducerSelectedContracts([...filteredSelectedUsers, elementToAdd])
      );
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    dispatch(reducerUsersInputValues({ ...usersInputValues, [name]: value }));
    setIsInputChange(true);
  };

  const selectChange = (event: any) => {
    if (event.value === "") {
      const updatedInputValues = { ...usersInputValues };
      delete updatedInputValues.role;

      dispatch(reducerUsersInputValues(updatedInputValues));
    } else {
      dispatch(
        reducerUsersInputValues({ ...usersInputValues, role: event.value })
      );
    }

    dispatch(actionGetUsers(limit, offset));
    setIsInputChange(false);
  };

  const handleKeyPress = (event: any) => {
    if (event.key === "Enter") {
      dispatch(actionGetUsers(limit, offset));
      setIsInputChange(false);
    }
  };

  const handleChange = (newLimit: number, newOffset: number) => {
    setIsPending(true);
    dispatch(actionGetUsers(newLimit, newOffset)).then(() => {
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
        {(!users || isPending) && <Loader />}
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
              <tr>
                <th className="reports__checkbox_block"></th>
                <th>
                  <div className="filter__block">
                    <input
                      value={usersInputValues.idMol}
                      onChange={handleInputChange}
                      onKeyPress={handleKeyPress}
                      placeholder=" "
                      name="idMol"
                      type="text"
                      id="idMoll"
                    />
                    <label>ID MOL</label>
                  </div>
                </th>
                <th>
                  <div className="filter__block">
                    <input
                      value={usersInputValues.login}
                      onChange={handleInputChange}
                      onKeyPress={handleKeyPress}
                      placeholder=" "
                      name="login"
                      type="text"
                      id="login"
                    />
                    <label>Логин</label>
                  </div>
                </th>
                <th>
                  <div className="filter__block">
                    <input
                      value={usersInputValues.fullname}
                      onChange={handleInputChange}
                      onKeyPress={handleKeyPress}
                      placeholder=" "
                      name="fullname"
                      id="fullname"
                      type="text"
                    />
                    <label>ФИО</label>
                  </div>
                </th>
                <th>
                  <div className="filter__block">
                    <Select
                      defaultValue={
                        usersInputValues.role &&
                        selectRolesOptions.find(
                          (option: any) =>
                            option.value === usersInputValues.role
                        )
                      }
                      isShowPlaceholder={
                        !!usersInputValues.role ||
                        usersInputValues.role === undefined
                      }
                      options={selectRolesOptions}
                      propsChange={selectChange}
                      className="users__filter"
                      placeholder="Должность"
                    />
                  </div>
                </th>
                <th>
                  <div className="filter__block">
                    <input
                      value={usersInputValues.emPersonId}
                      onChange={handleInputChange}
                      onKeyPress={handleKeyPress}
                      name="emPersonId"
                      placeholder=" "
                      id="emPersonId"
                      type="text"
                    />
                    <label>ID физ. лица</label>
                  </div>
                </th>
                <th>
                  <div className="filter__block">
                    <input
                      value={usersInputValues.emId}
                      onChange={handleInputChange}
                      onKeyPress={handleKeyPress}
                      placeholder=" "
                      name="emId"
                      type="text"
                      id="emId"
                    />
                    <label>ID EM</label>
                  </div>
                </th>
                <th>
                  <div className="filter__block">
                    <input
                      value={usersInputValues.emLogin}
                      onChange={handleInputChange}
                      onKeyPress={handleKeyPress}
                      id="emUserLogin"
                      placeholder=" "
                      name="emLogin"
                      type="text"
                    />
                    <label>Логин EM</label>
                  </div>
                </th>
                <th>
                  <div className="filter__block">
                    <input
                      value={usersInputValues.emName}
                      onChange={handleInputChange}
                      onKeyPress={handleKeyPress}
                      placeholder=" "
                      id="emFullName"
                      name="emName"
                      type="text"
                    />
                    <label>Имя EM</label>
                  </div>
                </th>
                <th>
                  <span className="filter__title">Начало действия</span>
                </th>
                <th>
                  <span className="filter__title">Окончание действия</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {users &&
                users.map((report: any) => {
                  return (
                    <tr
                      className={!report.enabled ? "active__tr" : ""}
                      key={report.id}
                    >
                      <td>
                        {report.enabled && (
                          <input
                            onChange={() =>
                              handleRowCheckboxChange(report.emData.emId)
                            }
                            checked={
                              (checkedRows &&
                                checkedRows.includes(report.emData.emId)) ||
                              false
                            }
                            type="checkbox"
                          />
                        )}
                      </td>
                      <td>{report.idMol}</td>
                      <td>{report.login}</td>
                      <td>{report.fullname}</td>
                      <td>{Object.values(report.role)}</td>
                      <td>{report.emData.personId}</td>
                      <td>{report.emData.emId}</td>
                      <td>{report.emData.userLogin}</td>
                      <td>{report.emData.fullName}</td>
                      <td>
                        {report.emData.dateHire
                          ?.split("-")
                          ?.reverse()
                          ?.join(".")}
                      </td>
                      <td>
                        {report.emData.dateFire
                          ?.split("-")
                          ?.reverse()
                          ?.join(".")}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
        <div className="pagination">
          <div className="pagination__count">Всего: {usersCount}</div>
          <div className="pagination__str">
            <span>Отображать строки</span>
            <LimitSelect limit={actualLimit} propsChange={handleChangeLimits} />
          </div>
          <Pagination
            setCurrentPage={setCurrentPage}
            setStartPage={setStartPage}
            handleChange={handleChange}
            currentPage={currentPage}
            startPage={startPage}
            limit={actualLimit}
            count={usersCount}
          />
        </div>
      </div>
    </>
  );
};

export default TableUsers;
