import { FC, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast, { Toaster } from "react-hot-toast";
import { Link } from "react-router-dom";

import clsx from "clsx";

import {
  reducerVisitScheduleInputValues,
  reducerVisitSchedulaStatus,
} from "../../../redux/reducer/userSingleReport/reducers/visitSchedule";
import { actionGetVisitScheduleData } from "../../../redux/action/userSingleReport/actionVisitSchedule";
import { actionGetUserReportsFilter } from "../../../redux/action/userReports/actionUserReports";
import { generateStyles } from "../../../utils/generateToastStyles";
import { AppDispatch } from "../../../redux/reducer/store";

import CustomMultiSelect from "../../custom/customMultiSelect/customMultiSelect";
import LimitSelect from "../../custom/limitSelect/limitSelect";
import ToastPopup from "../../custom/toastPopup/toastPopup";
import Pagination from "../../pagination/pagination";
import HeaderBtn from "../../headerBtn/headerBtn";
import Select from "../../custom/select/select";
import Loader from "../../custom/loader/loader";

import "../table.scss";

const IS_VISIBLE_SIDEBAR = process.env.REACT_APP_IS_VISIBLE_SIDEBAR;

const employeeStatusesOptions = [
  { value: "Active", label: "Активный" },
  { value: "Vacant", label: "Вакант" },
  { value: "Vacation", label: "Отпуск" },
  { value: "OutSick", label: "Больничный" },
  { value: "Replacement", label: "Замена" },
  { value: "Unprofitable", label: "Нерентабельный" },
  { value: "LingeringVacant", label: "Долгий вакант" },
  { value: "DayOff", label: "Отгул" },
];

const dayOptions = [
  { value: "Пн." },
  { value: "Вт." },
  { value: "Ср." },
  { value: "Чт." },
  { value: "Пт." },
  { value: "Сб." },
  { value: "Вс." },
];

const daysOfWeek = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
];

const TableVisitSchedule: FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const {
    visitScheduleInputValues,
    scheduleContractOptions,
    scheduleRegionsOptions,
    scheduleChainsOptions,
    scheduleMerchsOptions,
    scheduleAreasOptions,
    isFilteredByTrainee,
    visitReportsCount,
    scheduleStatus,
    isOpenHistory,
    scheduleData,
    contract,
    limit,
    page,
  } = useSelector((state: any) => state.userSingleReport.visitSchedule);
  const { data, isOpenSidebar, contractsLength } = useSelector(
    (state: any) => state.user.user
  );

  const [selectedContractOption, setSelectedContractOption] =
    useState<string>("");
  const [isInputChange, setIsInputChange] = useState<boolean>(false);
  const [isPending, setIsPending] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [startPage, setStartPage] = useState(1);

  const actualLimit =
    JSON.parse(localStorage.getItem("pageLimit") as string) || limit;
  const maxLimit = 100;

  useEffect(() => {
    dispatch(
      actionGetVisitScheduleData(
        actualLimit > maxLimit ? maxLimit : actualLimit,
        page
      )
    );
    dispatch(actionGetUserReportsFilter());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (scheduleStatus === 200) {
      toast.dismiss();
      toast(
        (t) => (
          <ToastPopup
            title="Выгрузка добавлена в очередь!"
            isSuccess={true}
            toast={toast}
            t={t}
          />
        ),
        generateStyles(true)
      );
    } else if (scheduleStatus === 0) {
      toast.dismiss();
      toast(
        (t) => (
          <ToastPopup
            title="При выгрузке произошла ошибка!"
            isSuccess={false}
            toast={toast}
            t={t}
          />
        ),
        generateStyles()
      );
    }

    dispatch(reducerVisitSchedulaStatus(null));
  }, [dispatch, scheduleStatus]);

  useEffect(() => {
    const handleDocumentClick = () => {
      dispatch(actionGetVisitScheduleData(limit, page));
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
  }, [dispatch, isInputChange, limit, page]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    if (value === "") {
      const updatedInputValues = { ...visitScheduleInputValues };
      delete updatedInputValues[name];

      dispatch(reducerVisitScheduleInputValues(updatedInputValues));
    } else {
      dispatch(
        reducerVisitScheduleInputValues({
          ...visitScheduleInputValues,
          [name]: value,
        })
      );
    }

    setIsInputChange(true);
  };

  const handleKeyPress = (event: any) => {
    if (event.key === "Enter") {
      dispatch(actionGetVisitScheduleData(limit, page));
      setIsInputChange(false);
      resetPages();
    }
  };

  const selectChange = (event: any, name: string) => {
    if (event.value === "") {
      if (name === "contract") {
        const updatedInputValues = {
          ...visitScheduleInputValues,
          contract: {},
        };

        dispatch(reducerVisitScheduleInputValues(updatedInputValues));
        setSelectedContractOption("all");
      } else {
        const updatedInputValues = { ...visitScheduleInputValues };
        delete updatedInputValues[name];

        dispatch(reducerVisitScheduleInputValues(updatedInputValues));
      }
    } else {
      dispatch(
        reducerVisitScheduleInputValues({
          ...visitScheduleInputValues,
          [name]:
            name === "contract" ? { id: event.value } : [{ id: event.value }],
        })
      );
    }

    dispatch(actionGetVisitScheduleData(limit, page));
    setIsInputChange(false);
    resetPages();
  };

  const resetPages = () => {
    setCurrentPage(1);
    setStartPage(1);
  };

  const handleChange = (newLimit: number, newPage: number) => {
    setIsPending(true);
    dispatch(actionGetVisitScheduleData(newLimit, newPage)).then(() => {
      setIsPending(false);
    });
    localStorage.setItem("pageLimit", JSON.stringify(newLimit));
  };

  const handleChangeLimits = (option: any) => {
    handleChange(option.value, 1);
    resetPages();
  };

  const getHistoryCellClassName = (cellHistoryData: any) => {
    const expired = cellHistoryData?.expired;
    const rateStatus = cellHistoryData?.rateStatus;

    if (expired) {
      return "violet__history_cell";
    } else if (!expired && rateStatus === "NotChecked") {
      return "yellow__history_cell";
    } else if (
      !expired &&
      (rateStatus === "Declined" || rateStatus === "PartiallyDeclined")
    ) {
      return "red__history_cell";
    } else if (
      !expired &&
      rateStatus !== "NotChecked" &&
      rateStatus !== "Declined" &&
      rateStatus !== "PartiallyDeclined"
    ) {
      return "green__history_cell";
    }

    return "white__history_cell";
  };

  const getRowClassName = (report: any) => {
    const status = report?.merch?.status;
    const trainee = report?.merch?.trainee;

    if (trainee) {
      return "yellow__row";
    } else if (status === "Vacant") {
      return "red__row";
    } else if (status === "Unprofitable" || status === "LingeringVacant") {
      return "dark__red_row";
    }

    return "";
  };

  return (
    <>
      <div className="loader__wrapper">
        {(!scheduleData || isPending) && <Loader />}
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
                {data &&
                  contractsLength >= 2 &&
                  scheduleContractOptions &&
                  contract && (
                    <th>
                      <div className="reports__region_block">
                        <Select
                          propsChange={(event: any) =>
                            selectChange(event, "contract")
                          }
                          isShowPlaceholder={
                            !!Object.keys(visitScheduleInputValues.contract)
                              .length || selectedContractOption === "all"
                          }
                          defaultValue={{
                            value: contract?.id,
                            label: contract?.name,
                          }}
                          options={scheduleContractOptions}
                          className="users__filter"
                          placeholder="Контракт"
                          name="contract"
                        />
                      </div>
                    </th>
                  )}
                <th>
                  <div className="filter__number_block">
                    <input
                      defaultValue={
                        visitScheduleInputValues.posClientId &&
                        visitScheduleInputValues.posClientId
                      }
                      onChange={handleInputChange}
                      onKeyPress={handleKeyPress}
                      placeholder=" "
                      type="number"
                      name="posClientId"
                    />
                    <label className="short__filter_label">ID ТТ</label>
                  </div>
                </th>
                <th>
                  <div className="reports__region_block">
                    <CustomMultiSelect
                      reducer={reducerVisitScheduleInputValues}
                      inputValues={visitScheduleInputValues}
                      action={actionGetVisitScheduleData}
                      options={scheduleRegionsOptions}
                      isShowPlaceholder={true}
                      pageName="visitSchedule"
                      resetPages={resetPages}
                      placeholder="Регион"
                      name="regions"
                      limit={limit}
                      page={page}
                    />
                  </div>
                </th>
                <th>
                  <div className="multiselect__filter_block">
                    <CustomMultiSelect
                      reducer={reducerVisitScheduleInputValues}
                      inputValues={visitScheduleInputValues}
                      action={actionGetVisitScheduleData}
                      options={scheduleAreasOptions}
                      isShowPlaceholder={true}
                      pageName="visitSchedule"
                      resetPages={resetPages}
                      placeholder="Область"
                      limit={limit}
                      name="areas"
                      page={page}
                    />
                  </div>
                </th>
                <th>
                  <div className="reports__chain_block">
                    <CustomMultiSelect
                      reducer={reducerVisitScheduleInputValues}
                      inputValues={visitScheduleInputValues}
                      action={actionGetVisitScheduleData}
                      options={scheduleChainsOptions}
                      isShowPlaceholder={true}
                      pageName="visitSchedule"
                      resetPages={resetPages}
                      placeholder="Сеть"
                      limit={limit}
                      name="chains"
                      page={page}
                    />
                  </div>
                </th>
                <th>
                  <div className="filter__block">
                    <input
                      defaultValue={
                        visitScheduleInputValues.address &&
                        visitScheduleInputValues.address
                      }
                      onChange={handleInputChange}
                      onKeyPress={handleKeyPress}
                      autoComplete="off"
                      placeholder=" "
                      name="address"
                      type="text"
                    />
                    <label>Адрес</label>
                  </div>
                </th>
                <th>
                  <div className="multiselect__filter_block">
                    <CustomMultiSelect
                      reducer={reducerVisitScheduleInputValues}
                      inputValues={visitScheduleInputValues}
                      action={actionGetVisitScheduleData}
                      options={scheduleMerchsOptions}
                      placeholder="Мерчендайзер"
                      isShowPlaceholder={true}
                      pageName="visitSchedule"
                      resetPages={resetPages}
                      limit={limit}
                      name="merchs"
                      page={page}
                    />
                  </div>
                </th>
                <th>
                  <div className="multiselect__filter_block">
                    <CustomMultiSelect
                      reducer={reducerVisitScheduleInputValues}
                      inputValues={visitScheduleInputValues}
                      action={actionGetVisitScheduleData}
                      options={employeeStatusesOptions}
                      isShowPlaceholder={true}
                      pageName="visitSchedule"
                      resetPages={resetPages}
                      placeholder="Статус"
                      name="statuses"
                      limit={limit}
                      page={page}
                    />
                  </div>
                </th>
                <th className="reports__number_th">Дата выхода</th>
                <th className="visit__schedule_btnBlock">
                  <HeaderBtn
                    content={
                      !isOpenHistory ? "Показать историю" : "Cкрыть историю"
                    }
                    purpose="showVisitScheduleHistory"
                    modalTitle="История"
                  />
                </th>
                {isOpenHistory &&
                  Array.from({ length: 21 }).map((_, index) => {
                    const date = new Date();
                    date.setDate(date.getDate() - (20 - index));
                    const options: any = {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    };
                    const formattedDate = date.toLocaleString("ru-Ru", options);

                    return (
                      <th key={index}>{formattedDate.split(".").join("/")}</th>
                    );
                  })}
                {dayOptions.map((option: any) => (
                  <th key={option.value}>
                    <div className="table__day_block">{option.value}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {scheduleData &&
                scheduleData
                  ?.slice()
                  ?.filter((elem: any) => {
                    if (isFilteredByTrainee) {
                      return elem?.merch?.trainee;
                    } else return true;
                  })
                  ?.map((report: any, index: any) => {
                    return (
                      <tr key={index} className={getRowClassName(report)}>
                        {data && contractsLength >= 2 && (
                          <td>{contract?.name}</td>
                        )}
                        <td>{report?.pos?.clientId}</td>
                        <td>{report?.pos?.region}</td>
                        <td>{report?.pos?.area}</td>
                        <td>{report?.pos?.chain}</td>
                        <td>
                          <HeaderBtn
                            content={report?.pos?.address}
                            purpose="addressInfo"
                            modalTitle="Информация о посещении торговой точки"
                          />
                        </td>
                        <td>{report?.merch?.employee?.name}</td>
                        <td>{Object.values(report.merch.status)}</td>
                        <td>
                          {report?.merch?.statusDate
                            ?.split("-")
                            ?.reverse()
                            ?.join(".")}
                        </td>
                        <td></td>
                        {isOpenHistory &&
                          Array.from({ length: 21 }).map((_, index) => {
                            const date = new Date();
                            date.setDate(date.getDate() - (20 - index));
                            const options: any = {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                            };

                            const cellHistoryData = report?.history?.find(
                              (obj: any) =>
                                obj.date ===
                                date
                                  .toLocaleString("ru-Ru", options)
                                  .split(".")
                                  .reverse()
                                  .join("-")
                            );

                            if (cellHistoryData) {
                              return (
                                <td
                                  className={getHistoryCellClassName(
                                    cellHistoryData
                                  )}
                                  key={index}
                                >
                                  {!cellHistoryData.expired ? (
                                    <Link
                                      to={`/reports/${cellHistoryData?.report?.id}`}
                                      className="visit__history_link"
                                      target="_blank"
                                    >
                                      {"+"}
                                    </Link>
                                  ) : (
                                    <span className="visit__history_link">
                                      {"-"}
                                    </span>
                                  )}
                                </td>
                              );
                            } else {
                              return (
                                <td key={index} className="white__history_cell">
                                  -
                                </td>
                              );
                            }
                          })}
                        {daysOfWeek.map((day) => {
                          const actualDay = report?.days.find(
                            (elem: any) => elem.day === day
                          );

                          return (
                            <td key={day}>
                              {actualDay?.time
                                ? actualDay?.time.slice(0, 5)
                                : "ВХ."}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
            </tbody>
          </table>
        </div>
        <div className="pagination">
          <div className="pagination__count">Всего: {visitReportsCount}</div>
          <div className="pagination__str">
            <span>Отображать строки</span>
            <LimitSelect
              limit={actualLimit > maxLimit ? maxLimit : actualLimit}
              propsChange={handleChangeLimits}
              pageName="visitSchedule"
            />
          </div>
          <Pagination
            limit={actualLimit > maxLimit ? maxLimit : actualLimit}
            setCurrentPage={setCurrentPage}
            setStartPage={setStartPage}
            handleChange={handleChange}
            count={visitReportsCount}
            currentPage={currentPage}
            pageName="userReports"
            startPage={startPage}
          />
        </div>
      </div>
    </>
  );
};

export default TableVisitSchedule;
