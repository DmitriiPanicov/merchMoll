import { FC, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import DatePicker, { registerLocale } from "react-datepicker";

import ru from "date-fns/locale/ru";
import moment from "moment";
import clsx from "clsx";

import {
  actionGetExcelUnloadingsFilters,
  actionGetExcelUnloadings,
} from "../../../redux/action/unloadings/actionExcelUnloadings";
import {
  formatUnloadingsDate,
  formatUnloadingsTime,
} from "../../../utils/formatDate";
import { reducerExcelUnloadingsInputValues } from "../../../redux/reducer/unloadings/reducers/excelUnloadings";
import { createOptions } from "../../../utils/createOptions";
import { AppDispatch } from "../../../redux/reducer/store";

import LimitSelect from "../../custom/limitSelect/limitSelect";
import Pagination from "../../pagination/pagination";
import Loader from "../../custom/loader/loader";
import Select from "../../custom/select/select";

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

const TableAdminUnloadingExcel: FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const {
    excelUnloadingsInputValues,
    excelUnloadingsCount,
    excelUnloadings,
    filters,
    limit,
    page,
  } = useSelector((state: any) => state.unloadings.excelUnloadings);
  const { isOpenSidebar } = useSelector((state: any) => state.user.user);

  const [selectedDate, setSelectedDate] = useState<any>(
    excelUnloadingsInputValues.date && new Date(excelUnloadingsInputValues.date)
  );
  const [selectedStatusOption, setSelectedStatusOption] = useState<string>("");
  const [isPending, setIsPending] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [startPage, setStartPage] = useState(1);

  const actualLimit =
    JSON.parse(localStorage.getItem("pageLimit") as string) || limit;

  useEffect(() => {
    dispatch(actionGetExcelUnloadings(actualLimit, page));
    dispatch(actionGetExcelUnloadingsFilters());
    registerLocale("ru", ru);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selectChange = (event: any, name: string) => {
    if (event.value === "") {
      if (name === "status") {
        setSelectedStatusOption("all");
      }

      const updatedInputValues = { ...excelUnloadingsInputValues };
      delete updatedInputValues[name];

      dispatch(reducerExcelUnloadingsInputValues(updatedInputValues));
    } else {
      dispatch(
        reducerExcelUnloadingsInputValues({
          ...excelUnloadingsInputValues,
          [name]:
            name === "moreThanMin"
              ? parseFloat(event.value)
              : name === "employee" || name === "customer"
              ? { id: event.value }
              : event.value,
        })
      );
    }

    dispatch(actionGetExcelUnloadings(limit, page));
    resetPages();
  };

  const handleDatePickerChange = (date: any) => {
    setSelectedDate(date);

    const formattedDate = moment(date).format("YYYY-MM-DD");

    dispatch(
      reducerExcelUnloadingsInputValues({
        ...excelUnloadingsInputValues,
        date: formattedDate,
      })
    );

    dispatch(actionGetExcelUnloadings(limit, page));
  };

  const handleDateKeyDown = (event: any) => {
    event.preventDefault();
  };

  const handleClearDate = () => {
    if (selectedDate) {
      setSelectedDate(null);

      dispatch(
        reducerExcelUnloadingsInputValues({
          ...excelUnloadingsInputValues,
          date: "",
        })
      );

      dispatch(actionGetExcelUnloadings(limit, page));
    }
  };

  const resetPages = () => {
    setCurrentPage(1);
    setStartPage(1);
  };

  const handleChange = (newLimit: number, newPage: number) => {
    setIsPending(true);
    dispatch(actionGetExcelUnloadings(newLimit, newPage)).then(() => {
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
    dispatch(actionGetExcelUnloadings(limit, page)).then(() => {
      setIsPending(false);
    });
  };

  return (
    <>
      <div className="loader__wrapper">
        {(!excelUnloadings || isPending) && <Loader />}
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
                <th>
                  <div className="filter__block">
                    <Select
                      defaultValue={
                        excelUnloadingsInputValues.type &&
                        createOptions(filters, "types").find(
                          (option: any) =>
                            option.value === excelUnloadingsInputValues.type
                        )
                      }
                      propsChange={(event: any) => selectChange(event, "type")}
                      isShowPlaceholder={
                        !!excelUnloadingsInputValues.type ||
                        excelUnloadingsInputValues.type === undefined
                      }
                      options={createOptions(filters, "types")}
                      className="users__filter"
                      placeholder="Тип"
                    />
                  </div>
                </th>
                <th>
                  <div className="filter__block">
                    <Select
                      defaultValue={
                        excelUnloadingsInputValues.employee &&
                        createOptions(filters, "employees")?.find(
                          (option: any) =>
                            option.value ===
                            excelUnloadingsInputValues.employee.id
                        )
                      }
                      propsChange={(event: any) =>
                        selectChange(event, "employee")
                      }
                      isShowPlaceholder={
                        (excelUnloadingsInputValues?.employee &&
                          !!Object.keys(excelUnloadingsInputValues?.employee)
                            .length) ||
                        excelUnloadingsInputValues?.employee === undefined
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
                        excelUnloadingsInputValues.customer &&
                        createOptions(filters, "customers")?.find(
                          (option: any) =>
                            option.value ===
                            excelUnloadingsInputValues.customer.id
                        )
                      }
                      propsChange={(event: any) =>
                        selectChange(event, "customer")
                      }
                      isShowPlaceholder={
                        (excelUnloadingsInputValues?.customer &&
                          !!Object.keys(excelUnloadingsInputValues?.customer)
                            .length) ||
                        excelUnloadingsInputValues?.customer === undefined
                      }
                      options={createOptions(filters, "customers")}
                      className="users__filter"
                      placeholder="Клиент"
                    />
                  </div>
                </th>
                <th>
                  <div className="filter__block">
                    <Select
                      defaultValue={
                        excelUnloadingsInputValues.status &&
                        statusesOptions.find(
                          (option: any) =>
                            option.value === excelUnloadingsInputValues.status
                        )
                      }
                      propsChange={(event: any) =>
                        selectChange(event, "status")
                      }
                      isShowPlaceholder={
                        !!excelUnloadingsInputValues.status ||
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
                        excelUnloadingsInputValues.moreThanMin &&
                        timeOptions.find(
                          (option: any) =>
                            parseFloat(option.value) ===
                            excelUnloadingsInputValues.moreThanMin
                        )
                      }
                      propsChange={(event: any) => {
                        selectChange(event, "moreThanMin");
                      }}
                      isShowPlaceholder={
                        !!excelUnloadingsInputValues.moreThanMin ||
                        excelUnloadingsInputValues.moreThanMin === undefined
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
              {excelUnloadings &&
                excelUnloadings.map((elem: any, index: number) => (
                  <tr key={index}>
                    <td>{elem?.order?.id}</td>
                    <td>{formatUnloadingsDate(elem?.date)}</td>
                    <td>{elem?.type}</td>
                    <td>{elem?.employee}</td>
                    <td>{elem?.customer}</td>
                    <td>{Object.values(elem.status)}</td>
                    <td>{formatUnloadingsTime(elem.time)}</td>
                    <td>
                      {Object.keys(elem.status).toString() === "Done" && (
                        <a href={elem?.url} download className="report__link">
                          Скачать
                        </a>
                      )}
                      {Object.keys(elem.status).toString() === "Error" && (
                        <span
                          className="report__link"
                          onClick={() =>
                            dispatch(actionGetExcelUnloadings(limit, page))
                          }
                        >
                          Повторить
                        </span>
                      )}
                    </td>
                    <td></td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        <div className="pagination">
          <div className="pagination__count">Всего: {excelUnloadingsCount}</div>
          <div className="pagination__str">
            <span>Отображать строки</span>
            <LimitSelect limit={actualLimit} propsChange={handleChangeLimits} />
          </div>
          <Pagination
            setCurrentPage={setCurrentPage}
            count={excelUnloadingsCount}
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

export default TableAdminUnloadingExcel;
