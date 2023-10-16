import { FC, useCallback, useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import DatePicker, { registerLocale } from "react-datepicker";

import throttle from "lodash.throttle";
import ru from "date-fns/locale/ru";
import moment from "moment";
import clsx from "clsx";

import {
  actionGetCronUnloadingsFilters,
  actionGetCronUnloadings,
} from "../../../redux/action/unloadings/actionCronUnloadings";
import {
  formatUnloadingsDate,
  formatUnloadingsTime,
} from "../../../utils/formatDate";
import { reducerCronUnloadingsInputValues } from "../../../redux/reducer/unloadings/reducers/cronUnloadings";
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

const TableAdminUnloadingCron: FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const {
    cronUnloadingsInputValues,
    cronUnloadingsCount,
    cronUnloadings,
    filters,
    limit,
    page,
  } = useSelector((state: any) => state.unloadings.cronUnloadings);
  const { isOpenSidebar } = useSelector((state: any) => state.user.user);

  const actualLimit =
    JSON.parse(localStorage.getItem("pageLimit") as string) || limit;
  const tableRef = useRef<any>(null);

  const [selectedDate, setSelectedDate] = useState<any>(
    cronUnloadingsInputValues.date && new Date(cronUnloadingsInputValues.date)
  );
  const [selectedStatusOption, setSelectedStatusOption] = useState<string>("");
  const [isPending, setIsPending] = useState<boolean>(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [displayStart, setDisplayStart] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [displayEnd, setDisplayEnd] = useState(0);
  const [startPage, setStartPage] = useState(1);

  const itemRowHeight = 30;
  const tableHeight =
    Math.max(tableRef.current && tableRef.current.offsetHeight) || 0;
  const rowsToRender = Math.floor((tableHeight * 2) / itemRowHeight);

  useEffect(() => {
    dispatch(actionGetCronUnloadings(actualLimit, page));
    dispatch(actionGetCronUnloadingsFilters());
    registerLocale("ru", ru);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selectChange = (event: any, name: string) => {
    if (event.value === "") {
      if (name === "status") {
        setSelectedStatusOption("all");
      }

      const updatedInputValues = { ...cronUnloadingsInputValues };
      delete updatedInputValues[name];

      dispatch(reducerCronUnloadingsInputValues(updatedInputValues));
    } else {
      dispatch(
        reducerCronUnloadingsInputValues({
          ...cronUnloadingsInputValues,
          [name]:
            name === "moreThanMin" ? parseFloat(event.value) : event.value,
        })
      );
    }

    dispatch(actionGetCronUnloadings(limit, page));
    resetPages();
  };

  const handleDatePickerChange = (date: any) => {
    setSelectedDate(date);

    const formattedDate = moment(date).format("YYYY-MM-DD");

    dispatch(
      reducerCronUnloadingsInputValues({
        ...cronUnloadingsInputValues,
        date: formattedDate,
      })
    );

    dispatch(actionGetCronUnloadings(limit, page));
  };

  const handleDateKeyDown = (event: any) => {
    event.preventDefault();
  };

  const handleClearDate = () => {
    if (selectedDate) {
      setSelectedDate(null);

      dispatch(
        reducerCronUnloadingsInputValues({
          ...cronUnloadingsInputValues,
          date: "",
        })
      );

      dispatch(actionGetCronUnloadings(limit, page));
    }
  };

  const resetPages = () => {
    setCurrentPage(1);
    setStartPage(1);
  };

  const handleChange = (newLimit: number, newPage: number) => {
    setIsPending(true);
    dispatch(actionGetCronUnloadings(newLimit, newPage)).then(() => {
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
    dispatch(actionGetCronUnloadings(limit, page)).then(() => {
      setIsPending(false);
    });
  };

  const setDisplayPositions = useCallback(
    (scroll: any) => {
      const scrollWithOffset = Math.floor(
        scroll - rowsToRender - tableHeight / 2
      );

      const displayStartPosition = Math.round(
        Math.max(0, Math.floor(scrollWithOffset / itemRowHeight))
      );

      const displayEndPosition = Math.round(
        Math.min(
          displayStartPosition + rowsToRender,
          cronUnloadings && cronUnloadings.length
        )
      );

      setDisplayStart(
        displayEndPosition < displayStartPosition ? 0 : displayStartPosition
      );
      setDisplayEnd(displayEndPosition);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [cronUnloadings && cronUnloadings.length, rowsToRender]
  );

  useEffect(() => {
    setDisplayPositions(scrollPosition);
  }, [scrollPosition, setDisplayPositions]);

  useEffect(() => {
    const table = tableRef.current && tableRef.current;

    const onScroll = throttle(() => {
      const scrollTop = table.scrollTop;

      if (cronUnloadings && cronUnloadings.length !== 0) {
        setDisplayPositions(scrollTop);
        setScrollPosition(scrollTop);
      }
    }, 100);

    table?.addEventListener("scroll", onScroll);

    return () => {
      table?.removeEventListener("scroll", onScroll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setDisplayPositions, cronUnloadings && cronUnloadings.length]);

  const renderVisibleRows = () => {
    const visibleRows = [];

    visibleRows.push(
      <tr
        key="startRowFiller"
        style={{ height: displayStart * itemRowHeight }}
      ></tr>
    );

    for (let i = displayStart; i < displayEnd; ++i) {
      const elem = cronUnloadings[i];

      if (elem !== undefined) {
        visibleRows.push(
          <tr key={i}>
            <td>{elem?.order?.id}</td>
            <td>{formatUnloadingsDate(elem?.date)}</td>
            <td>{elem?.type}</td>
            <td>{elem?.params}</td>
            <td>{Object.values(elem.status)}</td>
            <td>{formatUnloadingsTime(elem.time)}</td>
            <td>
              {Object.keys(elem.status).toString() === "Done" && (
                <span>Выполнено</span>
              )}
              {Object.keys(elem.status).toString() === "Error" && (
                <span
                  className="report__link"
                  onClick={() => dispatch(actionGetCronUnloadings(limit, page))}
                >
                  Повторить
                </span>
              )}
            </td>
            <td></td>
          </tr>
        );
      }
    }

    visibleRows.push(
      <tr
        key="endRowFiller"
        style={{
          height:
            (cronUnloadings && cronUnloadings.length - displayEnd) *
            itemRowHeight,
        }}
      ></tr>
    );

    return visibleRows;
  };

  return (
    <>
      <div className="loader__wrapper">
        {(!cronUnloadings || isPending) && <Loader />}
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
        <div className="table__wrapper" ref={tableRef}>
          <table>
            <thead>
              <tr className="unloadings__filter_tr">
                <th className="reports__number_th">№</th>
                <th>
                  <div className="filter__data_picker">
                    <DatePicker
                      onChange={handleDatePickerChange}
                      onKeyDown={handleDateKeyDown}
                      dateFormat="dd.MM.yyyy"
                      selected={selectedDate}
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
                <th style={{ minWidth: "230px" }}>
                  <div className="filter__block">
                    <Select
                      defaultValue={
                        cronUnloadingsInputValues.type &&
                        createOptions(filters, "types")?.find(
                          (option: any) =>
                            option.value === cronUnloadingsInputValues.type
                        )
                      }
                      propsChange={(event: any) => selectChange(event, "type")}
                      isShowPlaceholder={
                        !!cronUnloadingsInputValues.type ||
                        cronUnloadingsInputValues.type === undefined
                      }
                      options={createOptions(filters, "types")}
                      className="users__filter"
                      placeholder="Тип"
                    />
                  </div>
                </th>
                <th style={{ minWidth: "420px" }}>Параметры</th>
                <th>
                  <div className="filter__block">
                    <Select
                      defaultValue={
                        cronUnloadingsInputValues.status &&
                        statusesOptions.find(
                          (option: any) =>
                            option.value === cronUnloadingsInputValues.status
                        )
                      }
                      propsChange={(event: any) =>
                        selectChange(event, "status")
                      }
                      isShowPlaceholder={
                        !!cronUnloadingsInputValues.status ||
                        selectedStatusOption === "all"
                      }
                      className="users__filter"
                      options={statusesOptions}
                      placeholder="Статус"
                    />
                  </div>
                </th>
                <th>
                  <div className="filter__block">
                    <Select
                      defaultValue={
                        cronUnloadingsInputValues.moreThanMin &&
                        timeOptions.find(
                          (option: any) =>
                            parseFloat(option.value) ===
                            cronUnloadingsInputValues.moreThanMin
                        )
                      }
                      propsChange={(event: any) => {
                        selectChange(event, "moreThanMin");
                      }}
                      isShowPlaceholder={
                        !!cronUnloadingsInputValues.moreThanMin ||
                        cronUnloadingsInputValues.moreThanMin === undefined
                      }
                      placeholder="Время выполнения"
                      className="users__filter"
                      options={timeOptions}
                    />
                  </div>
                </th>
                <th style={{ minWidth: "100px" }}>Ссылка</th>
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
            <tbody className="optimized__table_body">
              {renderVisibleRows()}
            </tbody>
          </table>
        </div>
        <div className="pagination">
          <div className="pagination__count">Всего: {cronUnloadingsCount}</div>
          <div className="pagination__str">
            <span>Отображать строки</span>
            <LimitSelect limit={actualLimit} propsChange={handleChangeLimits} />
          </div>
          <Pagination
            setCurrentPage={setCurrentPage}
            setStartPage={setStartPage}
            handleChange={handleChange}
            count={cronUnloadingsCount}
            currentPage={currentPage}
            pageName="userReports"
            startPage={startPage}
            limit={actualLimit}
          />
        </div>
      </div>
    </>
  );
};

export default TableAdminUnloadingCron;
