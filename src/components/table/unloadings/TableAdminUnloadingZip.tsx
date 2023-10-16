import { FC, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import DatePicker, { registerLocale } from "react-datepicker";

import ru from "date-fns/locale/ru";
import moment from "moment";
import clsx from "clsx";

import {
  actionGetZipUnloadingsFilters,
  actionGetZipUnloadings,
} from "../../../redux/action/unloadings/actionZipUnloadings";
import {
  formatUnloadingsDate,
  formatUnloadingsTime,
} from "../../../utils/formatDate";
import { reducerZipUnloadingsInputValues } from "../../../redux/reducer/unloadings/reducers/zipUnloadings";
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

const TableAdminUnloadingZip: FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const {
    zipUnloadingsInputValues,
    zipUnloadingsCount,
    zipUnloadings,
    filters,
    limit,
    page,
  } = useSelector((state: any) => state.unloadings.zipUnloadings);
  const { isOpenSidebar } = useSelector((state: any) => state.user.user);

  const [selectedDate, setSelectedDate] = useState<any>(
    zipUnloadingsInputValues.date && new Date(zipUnloadingsInputValues.date)
  );
  const [selectedStatusOption, setSelectedStatusOption] = useState<string>("");
  const [isPending, setIsPending] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [startPage, setStartPage] = useState(1);

  const actualLimit =
    JSON.parse(localStorage.getItem("pageLimit") as string) || limit;

  useEffect(() => {
    dispatch(actionGetZipUnloadings(actualLimit, page));
    dispatch(actionGetZipUnloadingsFilters());
    registerLocale("ru", ru);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selectChange = (event: any, name: string) => {
    if (event.value === "") {
      if (name === "status") {
        setSelectedStatusOption("all");
      }

      const updatedInputValues = { ...zipUnloadingsInputValues };
      delete updatedInputValues[name];

      dispatch(reducerZipUnloadingsInputValues(updatedInputValues));
    } else {
      dispatch(
        reducerZipUnloadingsInputValues({
          ...zipUnloadingsInputValues,
          [name]:
            name === "moreThanMin"
              ? parseFloat(event.value)
              : name === "employee" || name === "customer"
              ? { id: event.value }
              : event.value,
        })
      );
    }

    dispatch(actionGetZipUnloadings(limit, page));
    resetPages();
  };

  const handleDatePickerChange = (date: any) => {
    setSelectedDate(date);

    const formattedDate = moment(date).format("YYYY-MM-DD");

    dispatch(
      reducerZipUnloadingsInputValues({
        ...zipUnloadingsInputValues,
        date: formattedDate,
      })
    );

    dispatch(actionGetZipUnloadings(limit, page));
  };

  const handleDateKeyDown = (event: any) => {
    event.preventDefault();
  };

  const handleClearDate = () => {
    if (selectedDate) {
      setSelectedDate(null);

      dispatch(
        reducerZipUnloadingsInputValues({
          ...zipUnloadingsInputValues,
          date: "",
        })
      );

      dispatch(actionGetZipUnloadings(limit, page));
    }
  };

  const resetPages = () => {
    setCurrentPage(1);
    setStartPage(1);
  };

  const handleChange = (newLimit: number, newPage: number) => {
    setIsPending(true);
    dispatch(actionGetZipUnloadings(newLimit, newPage)).then(() => {
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
    dispatch(actionGetZipUnloadings(limit, page)).then(() =>
      setIsPending(false)
    );
  };

  return (
    <>
      <div className="loader__wrapper">
        {(!zipUnloadings || isPending) && <Loader />}
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
                        zipUnloadingsInputValues.employee &&
                        createOptions(filters, "employees")?.find(
                          (option: any) =>
                            option.value ===
                            zipUnloadingsInputValues.employee.id
                        )
                      }
                      propsChange={(event: any) =>
                        selectChange(event, "employee")
                      }
                      isShowPlaceholder={
                        (zipUnloadingsInputValues?.employee &&
                          !!Object.keys(zipUnloadingsInputValues?.employee)
                            .length) ||
                        zipUnloadingsInputValues?.employee === undefined
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
                        zipUnloadingsInputValues.customer &&
                        createOptions(filters, "customers")?.find(
                          (option: any) =>
                            option.value ===
                            zipUnloadingsInputValues.customer.id
                        )
                      }
                      propsChange={(event: any) =>
                        selectChange(event, "customer")
                      }
                      isShowPlaceholder={
                        (zipUnloadingsInputValues?.customer &&
                          !!Object.keys(zipUnloadingsInputValues?.customer)
                            .length) ||
                        zipUnloadingsInputValues?.customer === undefined
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
                        zipUnloadingsInputValues.status &&
                        statusesOptions.find(
                          (option: any) =>
                            option.value === zipUnloadingsInputValues.status
                        )
                      }
                      propsChange={(event: any) =>
                        selectChange(event, "status")
                      }
                      isShowPlaceholder={
                        !!zipUnloadingsInputValues.status ||
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
                        zipUnloadingsInputValues.moreThanMin &&
                        timeOptions.find(
                          (option: any) =>
                            parseFloat(option.value) ===
                            zipUnloadingsInputValues.moreThanMin
                        )
                      }
                      propsChange={(event: any) => {
                        selectChange(event, "moreThanMin");
                      }}
                      isShowPlaceholder={
                        !!zipUnloadingsInputValues.moreThanMin ||
                        zipUnloadingsInputValues.moreThanMin === undefined
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
              {zipUnloadings &&
                zipUnloadings.map((elem: any, index: number) => (
                  <tr key={index}>
                    <td>{elem?.order?.id}</td>
                    <td>{formatUnloadingsDate(elem?.date)}</td>
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
                            dispatch(actionGetZipUnloadings(limit, page))
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
          <div className="pagination__count">Всего: {zipUnloadingsCount}</div>
          <div className="pagination__str">
            <span>Отображать строки</span>
            <LimitSelect limit={actualLimit} propsChange={handleChangeLimits} />
          </div>
          <Pagination
            setCurrentPage={setCurrentPage}
            setStartPage={setStartPage}
            handleChange={handleChange}
            count={zipUnloadingsCount}
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

export default TableAdminUnloadingZip;
