import { FC, useEffect, useState } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import ru from "date-fns/locale/ru";
import moment from "moment";
import clsx from "clsx";

import {
  actionGetTablesUnloadingsFilters,
  actionGetTablesUnloadings,
} from "../../../redux/action/unloadings/actionTablesUnloadings";
import {
  formatUnloadingsDate,
  formatUnloadingsTime,
} from "../../../utils/formatDate";
import { reducerTablesUnloadingsInputValues } from "../../../redux/reducer/unloadings/reducers/tablesUnloadinds";
import { createOptions } from "../../../utils/createOptions";
import { AppDispatch } from "../../../redux/reducer/store";

import LimitSelect from "../../custom/limitSelect/limitSelect";
import Pagination from "../../pagination/pagination";
import Select from "../../custom/select/select";
import Loader from "../../custom/loader/loader";

import RefreshIcon from "../../../assets/icons/refresh.svg";

import "../table.scss";

const IS_VISIBLE_SIDEBAR = process.env.REACT_APP_IS_VISIBLE_SIDEBAR;

const statusesOptions = [
  { value: "", label: "Все" },
  { value: "Ordered", label: "В очереди" },
  { value: "Error", label: "Ошибка" },
  { value: "Done", label: "Сформирован" },
  { value: "Deleted", label: "Удален" },
  { value: "Empty", label: "Фото не найдено" },
];

const timeOptions = [
  { value: "", label: "Все" },
  { value: "1", label: "Больше минуты" },
  { value: "10", label: "Больше 10 минут" },
];

const TableAdminUnloadingTables: FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const {
    tablesUnloadingsInputValues,
    tablesUnloadingsCount,
    tablesUnloadings,
    filters,
    limit,
    page,
  }: any = useSelector((state: any) => state.unloadings.tablesUnloadings);
  const { isOpenSidebar } = useSelector((state: any) => state.user.user);

  const [selectedDate, setSelectedDate] = useState<any>(
    tablesUnloadingsInputValues.date &&
      new Date(tablesUnloadingsInputValues.date)
  );
  const [selectedStatusOption, setSelectedStatusOption] = useState<string>("");
  const [isPending, setIsPending] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [startPage, setStartPage] = useState(1);

  const actualLimit =
    JSON.parse(localStorage.getItem("pageLimit") as string) || limit;

  useEffect(() => {
    dispatch(actionGetTablesUnloadings(actualLimit, page));
    dispatch(actionGetTablesUnloadingsFilters());
    registerLocale("ru", ru);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selectChange = (event: any, name: string) => {
    if (event.value === "") {
      if (name === "status") {
        setSelectedStatusOption("all");
      }

      const updatedInputValues = { ...tablesUnloadingsInputValues };
      delete updatedInputValues[name];

      dispatch(reducerTablesUnloadingsInputValues(updatedInputValues));
    } else {
      dispatch(
        reducerTablesUnloadingsInputValues({
          ...tablesUnloadingsInputValues,
          [name]:
            name === "moreThanMin"
              ? parseFloat(event.value)
              : name === "employee"
              ? { id: event.value }
              : event.value,
        })
      );
    }

    dispatch(actionGetTablesUnloadings(limit, page));
    resetPages();
  };

  const handleDatePickerChange = (date: any) => {
    setSelectedDate(date);

    const formattedDate = moment(date).format("YYYY-MM-DD");

    dispatch(
      reducerTablesUnloadingsInputValues({
        ...tablesUnloadingsInputValues,
        date: formattedDate,
      })
    );

    dispatch(actionGetTablesUnloadings(limit, page));
  };

  const handleDateKeyDown = (event: any) => {
    event.preventDefault();
  };

  const handleClearDate = () => {
    if (selectedDate) {
      setSelectedDate(null);

      dispatch(
        reducerTablesUnloadingsInputValues({
          ...tablesUnloadingsInputValues,
          date: "",
        })
      );

      dispatch(actionGetTablesUnloadings(limit, page));
    }
  };

  const resetPages = () => {
    setCurrentPage(1);
    setStartPage(1);
  };

  const handleChange = (newLimit: number, newPage: number) => {
    setIsPending(true);
    dispatch(actionGetTablesUnloadings(newLimit, newPage)).then(() => {
      setIsPending(false);
    });
    localStorage.setItem("pageLimit", JSON.stringify(newLimit));
  };

  const handleChangeLimits = (option: any) => {
    handleChange(option.value, 1);
    resetPages();
  };

  const handleClickRefreshBtn = () => {
    setIsPending(true);
    dispatch(actionGetTablesUnloadings(limit, page)).then(() => {
      setIsPending(false);
    });
  };

  return (
    <>
      <div className="loader__wrapper">
        {(!tablesUnloadings || isPending) && <Loader />}
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
        <div className="table__wrapper">
          <table>
            <thead>
              <tr className="unloadings__filter_tr">
                <th className="reports__number_th">№</th>
                <th>
                  <div className="filter__data_picker">
                    <DatePicker
                      onChange={handleDatePickerChange}
                      onKeyDown={handleDateKeyDown}
                      selected={selectedDate}
                      dateFormat="dd.MM.yyyy"
                      placeholderText="Дата"
                      autoComplete="off"
                      locale="ru"
                      name="date"
                    />
                    {selectedDate && (
                      <div className="clear__icon" onClick={handleClearDate} />
                    )}
                  </div>
                </th>
                <th className="filter__block">Название</th>
                <th>
                  <div className="filter__block">
                    <Select
                      defaultValue={
                        tablesUnloadingsInputValues.employee &&
                        createOptions(filters, "employees")?.find(
                          (option: any) =>
                            option.value ===
                            tablesUnloadingsInputValues.employee.id
                        )
                      }
                      propsChange={(event: any) =>
                        selectChange(event, "employee")
                      }
                      isShowPlaceholder={
                        (tablesUnloadingsInputValues?.employee &&
                          !!Object.keys(tablesUnloadingsInputValues?.employee)
                            .length) ||
                        tablesUnloadingsInputValues?.employee === undefined
                      }
                      options={createOptions(filters, "employees")}
                      className="users__filter"
                      placeholder="Сотрудник"
                    />
                  </div>
                </th>
                <th>
                  <div className="filter__block">
                    <Select
                      defaultValue={
                        tablesUnloadingsInputValues.status &&
                        statusesOptions.find(
                          (option: any) =>
                            option.value === tablesUnloadingsInputValues.status
                        )
                      }
                      propsChange={(event: any) =>
                        selectChange(event, "status")
                      }
                      isShowPlaceholder={
                        !!tablesUnloadingsInputValues.status ||
                        selectedStatusOption === "all"
                      }
                      options={statusesOptions}
                      className="users__filter"
                      placeholder="Статус"
                    />
                  </div>
                </th>
                <th>
                  <div className="filter__block">
                    <Select
                      defaultValue={
                        tablesUnloadingsInputValues.moreThanMin &&
                        timeOptions.find(
                          (option: any) =>
                            parseFloat(option.value) ===
                            tablesUnloadingsInputValues.moreThanMin
                        )
                      }
                      propsChange={(event: any) => {
                        selectChange(event, "moreThanMin");
                      }}
                      isShowPlaceholder={
                        !!tablesUnloadingsInputValues.moreThanMin ||
                        tablesUnloadingsInputValues.moreThanMin === undefined
                      }
                      placeholder="Время выполнения"
                      className="users__filter"
                      options={timeOptions}
                    />
                  </div>
                </th>
                <th className="unloadings__link_cell">Ссылка</th>
                <th>
                  <div className="refresh__btn" onClick={handleClickRefreshBtn}>
                    <img
                      className="refresh__icon"
                      src={RefreshIcon}
                      alt="refresh"
                    />
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {tablesUnloadings &&
                tablesUnloadings.map((elem: any, index: number) => (
                  <tr key={index}>
                    <td>{elem?.order?.id}</td>
                    <td>{formatUnloadingsDate(elem?.date)}</td>
                    <td>{elem?.type}</td>
                    <td>{elem?.employee}</td>
                    <td>{Object.values(elem.status)}</td>
                    <td>{formatUnloadingsTime(elem.time)}</td>
                    <td>
                      {Object.keys(elem.status).toString() === "Done" && (
                        <Link
                          to={`/finance/payroll/info/${elem.payroll.id}`}
                          className="report__link"
                        >
                          Перейти
                        </Link>
                      )}
                    </td>
                    <td></td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        <div className="pagination">
          <div className="pagination__count">
            Всего: {tablesUnloadingsCount}
          </div>
          <div className="pagination__str">
            <span>Отображать строки</span>
            <LimitSelect limit={actualLimit} propsChange={handleChangeLimits} />
          </div>
          <Pagination
            setCurrentPage={setCurrentPage}
            count={tablesUnloadingsCount}
            setStartPage={setStartPage}
            handleChange={handleChange}
            currentPage={currentPage}
            startPage={startPage}
            limit={actualLimit}
            pageName="userReports"
          />
        </div>
      </div>
    </>
  );
};

export default TableAdminUnloadingTables;
