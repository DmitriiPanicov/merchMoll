import { FC, useCallback, useEffect, useRef, useState } from "react";
import { registerLocale } from "react-datepicker";
import { DateRange } from "react-date-range";
import { useDispatch } from "react-redux";

import {
  startOfMonth,
  startOfWeek,
  endOfMonth,
  endOfWeek,
  subMonths,
  subWeeks,
  addDays,
} from "date-fns";
import ru from "date-fns/locale/ru";
import moment from "moment";
import clsx from "clsx";

import { AppDispatch } from "../../../redux/reducer/store";
import { stateDate } from "../../../utils/formatDate";

import Calendar from "../../../assets/icons/calendar.svg";

import "react-date-range/dist/theme/default.css";
import "react-date-range/dist/styles.css";
import "./rangeDatePicker.scss";

interface IRangeDatePickerProps {
  defaultDateFrom?: any;
  setInputValues?: any;
  setCurrentPage?: any;
  defaultDateTo?: any;
  setStartPage?: any;
  inputValues?: any;
  reducer?: any;
  action?: any;
  limit?: any;
  page?: any;
}

const RangeDatePicker: FC<IRangeDatePickerProps> = ({
  defaultDateFrom,
  setCurrentPage,
  defaultDateTo,
  setStartPage,
  inputValues,
  reducer,
  action,
  limit,
  page,
}) => {
  const dispatch = useDispatch<AppDispatch>();

  const [isClickOnAcceptBtn, setIsClickOnAcceptBtn] = useState<boolean>(false);
  const [isClickOnClearBtn, setIsClickOnClearBtn] = useState<boolean>(false);
  const [isOpenDateBlock, setIsOpenDateBlock] = useState<boolean>(false);
  const [selectedOptions, setSelectedOptions] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [date, setDate] = useState<any>([
    {
      startDate: startOfMonth(subMonths(new Date(), 1)),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  const actualLimit = JSON.parse(localStorage.getItem("pageLimit") as string);
  const selectRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const calendarRef = useRef<any>(null);

  const handleClickAcceptBtn = useCallback(() => {
    setIsClickOnAcceptBtn(true);
    setCurrentPage(1);
    setIsOpen(false);
    setStartPage(1);
  }, [setCurrentPage, setStartPage]);

  const options = [
    { value: "Выбрать период", option: () => setIsOpenDateBlock(true) },
    { value: "Сегодня", option: () => setDateRange(new Date(), new Date()) },
    {
      value: "Вчера",
      option: () =>
        setDateRange(addDays(new Date(), -1), addDays(new Date(), -1)),
    },
    {
      value: "Прошлая неделя",
      option: () =>
        setDateRange(
          startOfWeek(subWeeks(new Date(), 1), {
            weekStartsOn: 1,
          }),
          endOfWeek(subWeeks(new Date(), 1), { weekStartsOn: 1 })
        ),
    },
    {
      value: "Последние 7 дней",
      option: () => setDateRange(addDays(new Date(), -6), new Date()),
    },
    {
      value: "Последние 30 дней",
      option: () => setDateRange(addDays(new Date(), -29), new Date()),
    },
    {
      value: "Этот месяц",
      option: () =>
        setDateRange(startOfMonth(new Date()), endOfMonth(new Date())),
    },
    {
      value: "Предыдущий месяц",
      option: () =>
        setDateRange(
          startOfMonth(subMonths(new Date(), 1)),
          endOfMonth(subMonths(new Date(), 1))
        ),
    },
  ];

  useEffect(() => {
    registerLocale("ru", ru);
  }, []);

  useEffect(() => {
    if (isClickOnAcceptBtn) {
      const formattedDateFrom = moment(date && date[0]?.startDate).format(
        "YYYY-MM-DD"
      );
      const formattedDateTo = moment(date && date[0]?.endDate).format(
        "YYYY-MM-DD"
      );

      handleDateUpdate(formattedDateFrom, formattedDateTo);
      setIsClickOnAcceptBtn(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isClickOnAcceptBtn]);

  useEffect(() => {
    if (isClickOnClearBtn) {
      const fromDate = stateDate(startOfMonth(subMonths(new Date(), 1)));
      const toDate = stateDate(new Date());

      setDateRange(startOfMonth(subMonths(new Date(), 1)), new Date());
      handleDateUpdate(fromDate, toDate);
      setIsClickOnClearBtn(false);
      setCurrentPage(1);
      setStartPage(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isClickOnClearBtn]);

  useEffect(() => {
    const handleClickOutsideModal = (e: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(e.target as Node) &&
        selectRef.current &&
        !selectRef.current.contains(e.target as Node)
      ) {
        handleClickAcceptBtn();
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutsideModal);

    return () => {
      document.removeEventListener("mousedown", handleClickOutsideModal);
    };
  }, [handleClickAcceptBtn]);

  const handleDateUpdate = (fromDate: any, toDate: any) => {
    dispatch(
      reducer({
        ...inputValues,
        fromDate,
        toDate,
      })
    );
    dispatch(action(actualLimit ? actualLimit : limit, page));
  };

  const setDateRange = (startDate: any, endDate: any) => {
    setDate([
      {
        startDate,
        endDate,
        key: "selection",
      },
    ]);
  };

  const handleOpenModal = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (option: any) => {
    const isSelected = selectedOptions?.some(
      (selectedOption) => selectedOption === option
    );

    if (isSelected) {
      setSelectedOptions([]);
      setDateRange(startOfMonth(subMonths(new Date(), 1)), new Date());

      if (option === "Выбрать период") {
        setIsOpenDateBlock(false);
      }
    } else {
      setSelectedOptions([option]);

      const selectedOption = options.find((item: any) => item.value === option);

      if (selectedOption) {
        selectedOption.option();
      }
    }
  };

  const handleDatePickerChange = (item: any) => {
    setSelectedOptions(["Выбрать период"]);
    setDate([item.selection]);
  };

  const handleClickClearBtn = () => {
    setIsClickOnClearBtn(true);
    setIsOpenDateBlock(false);
    setSelectedOptions([]);
    setCurrentPage(1);
    setIsOpen(false);
    setStartPage(1);
  };

  return (
    <div className="wrapper">
      <div
        className="input__date_wrapper"
        onClick={handleOpenModal}
        ref={selectRef}
        id="date"
      >
        <img src={Calendar} alt="calendar" className="calendar__icon" />
        <div className="date__column_block">
          <span>{defaultDateFrom}</span>
          <span>{defaultDateTo}</span>
        </div>
      </div>
      {isOpen && (
        <div className="modal" ref={modalRef}>
          <div className="filter__elem__block">
            {options.map((option: any) => (
              <div
                key={option.value}
                className={`elem ${
                  selectedOptions?.some(
                    (selectedOption) => selectedOption === option.value
                  )
                    ? "active__elem"
                    : ""
                }`}
                onClick={() => handleOptionClick(option.value)}
              >
                {option.value}
              </div>
            ))}
            <div className="btns__block">
              <button className="accept__btn" onClick={handleClickAcceptBtn}>
                Выбрать
              </button>
              <button className="clear__btn" onClick={handleClickClearBtn}>
                Очистить
              </button>
            </div>
          </div>
          <div
            className={clsx(
              "date__block",
              isOpenDateBlock && "date__block_active"
            )}
          >
            {isOpenDateBlock && (
              <>
                <DateRange
                  retainEndDateOnFirstSelection={true}
                  onChange={handleDatePickerChange}
                  moveRangeOnFirstSelection={false}
                  dateDisplayFormat="dd/MM/yyyy"
                  startDatePlaceholder="От"
                  className="first__range"
                  direction="horizontal"
                  editableDateInputs
                  ref={calendarRef}
                  ranges={date}
                  locale={ru}
                  months={1}
                />
                <DateRange
                  retainEndDateOnFirstSelection={true}
                  moveRangeOnFirstSelection={false}
                  onChange={handleDatePickerChange}
                  dateDisplayFormat="dd/MM/yyyy"
                  className="second__range"
                  endDatePlaceholder="До"
                  direction="horizontal"
                  editableDateInputs
                  ref={calendarRef}
                  ranges={date}
                  locale={ru}
                  months={1}
                />
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default RangeDatePicker;
