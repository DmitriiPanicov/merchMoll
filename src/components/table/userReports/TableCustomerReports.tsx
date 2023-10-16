import { FC, useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast, { Toaster } from "react-hot-toast";

import throttle from "lodash.throttle";
import clsx from "clsx";

import {
  actionGetUserReportsFilter,
  actionGetUserReports,
} from "../../../redux/action/userReports/actionUserReports";
import {
  reducerUserReportsInputValues,
  reducerReportsStatus,
} from "../../../redux/reducer/userReports/reducers/userReports";
import { generateStyles } from "../../../utils/generateToastStyles";
import { formatHistoryDateTime } from "../../../utils/formatDate";
import { AppDispatch } from "../../../redux/reducer/store";

import CustomMultiSelect from "../../custom/customMultiSelect/customMultiSelect";
import RangeDatePicker from "../../custom/rangeDatePicker/rangeDatePicker";
import LimitSelect from "../../custom/limitSelect/limitSelect";
import ToastPopup from "../../custom/toastPopup/toastPopup";
import Pagination from "../../pagination/pagination";
import Select from "../../custom/select/select";
import Loader from "../../custom/loader/loader";

import "../table.scss";

const IS_VISIBLE_SIDEBAR = process.env.REACT_APP_IS_VISIBLE_SIDEBAR;
const userData = JSON.parse(localStorage.getItem("userData") as string);

const requestStatusOptions = [
  {
    status: 200,
    purpose: "unloadCustomerReportsData",
    successMessage: `Отчет будет доступен в пункте Выгрузки, когда будет сформирован!`,
  },
  {
    status: 0,
    purpose: "unloadCustomerReportsData",
    errorMessage: "При выгрузке данных произошла ошибка!",
  },
  {
    status: 200,
    purpose: "unloadCustomerReports",
    successMessage: `Отчет будет доступен в пункте Выгрузки, когда будет сформирован!`,
  },
  {
    status: 0,
    purpose: "unloadCustomerReports",
    errorMessage: "При выгрузке данных произошла ошибка!",
  },
  {
    status: 200,
    purpose: "unloadReportsPhotos",
    successMessage: `Ссылка на архив будет отправлена на почту ${userData?.email}, когда будет сформирована!`,
  },
  {
    status: 0,
    purpose: "unloadReportsPhotos",
    errorMessage: "При выгрузке фотографий произошла ошибка!",
  },
  {
    status: 200,
    purpose: "unloadHotline",
    successMessage: `Отчет будет доступен в пункте Выгрузки, когда будет сформирован!`,
  },
  {
    status: 0,
    purpose: "unloadHotline",
    errorMessage: "При выгрузке горячей линии произошла ошибка!",
  },
  {
    status: 200,
    purpose: "averageFacing",
    successMessage:
      "Отчет будет доступен в пункте Выгрузки, когда будет сформирован!",
  },
  {
    status: 0,
    purpose: "averageFacing",
    errorMessage: "При выгрузке среднего фейсинга произошла ошибка!",
  },
  {
    status: 200,
    purpose: "osa",
    successMessage:
      "Отчет будет доступен в пункте Выгрузки, когда будет сформирован!",
  },
  {
    status: 0,
    purpose: "osa",
    errorMessage: "При выгрузке OSA за период произошла ошибка!",
  },
  {
    status: 200,
    purpose: "unloadClientReport",
    successMessage: `Отчет будет доступен в пункте Выгрузки, когда будет сформирован!`,
  },
  {
    status: 0,
    purpose: "unloadClientReport",
    errorMessage: "При выгрузке данных произошла ошибка!",
  },
  {
    status: 200,
    purpose: "shelfShare",
    successMessage:
      "Отчет будет доступен в пункте Выгрузки, когда будет сформирован!",
  },
  {
    status: 0,
    purpose: "shelfShare",
    errorMessage: "При выгрузке доли полки произошла ошибка!",
  },
];

const reviewStatusesOptions = [
  { value: "Improved", label: "Доработан" },
  { value: "Revision", label: "Доработка" },
  { value: "Fixed", label: "Исправлен" },
  { value: "NotChecked", label: "Не проверен" },
  { value: "Rejected", label: "Отклонен" },
  { value: "PartiallyRejected", label: "Отклонен (частично)" },
  { value: "Malfunction", label: "Тех. сбой" },
  { value: "Approved", label: "Утвержден" },
];

const rateStatusesOptions = [
  { value: "", label: "Все" },
  { value: "Fixed", label: "Исправлен" },
  { value: "FixedRequest", label: "Исправлен (тр. подтверждения)" },
  { value: "NotChecked", label: "Не проверен" },
  { value: "Declined", label: "Отклонен" },
  { value: "PartiallyDeclined", label: "Отклонен (частично)" },
  { value: "Claim", label: "Претензия в обработке" },
  { value: "ClaimDeclined", label: "Претензия отклонена" },
  { value: "ClaimRequest", label: "Претензия (тр. подтверждения)" },
  { value: "Accepted", label: "Принят" },
  { value: "RecommendationFixed", label: "Рекомендация выполнена" },
  { value: "Recommendation", label: "Рекомендация в обработке" },
  { value: "RecommendationNotFixed", label: "Рекомендация не выполнена" },
  { value: "RecommendationDeclined", label: "Рекомендация отклонена" },
  { value: "RecommendationFixedRequest", label: "Рекомендация проработана" },
];

const checkTypesOptions = [
  { value: "AUDIT", label: "Аудит в ТТ" },
  { value: "DISTANCE", label: "Дистанционная проверка" },
];

const TableCustomerReports: FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { data, isOpenSidebar, contractsLength } = useSelector(
    (state: any) => state.user.user
  );
  const {
    responsibleCustomersOptions,
    reportsRequestPurpose,
    reportsInputValues,
    formattedDateFrom,
    contractsOptions,
    formattedDateTo,
    reportsSettings,
    projectOptions,
    regionsOptions,
    chainsOptions,
    merchsOptions,
    reportsStatus,
    reportsCount,
    checkboxes,
    svsOptions,
    filters,
    reports,
    limit,
    page,
  } = useSelector((state: any) => state.userReports.userReports);

  const filterDate =
    data &&
    data?.settings?.reportsFrom &&
    new Date(data?.settings?.reportsFrom);

  const filteredStatuses =
    filters &&
    filters[0].reviewStatuses
      .map((elem: any) => Object.keys(elem).toString())
      .filter((status: any) =>
        data?.settings?.reviewStatuses?.value
          .map((elem: any) => Object.keys(elem)?.toString())
          ?.includes(status)
      );

  const settingsReviewStatuses = data.settings?.reviewStatuses?.value?.map(
    (elem: any) => Object.keys(elem)?.toString()
  );

  const filteredReviewStatusesOptions = reviewStatusesOptions.filter((option) =>
    settingsReviewStatuses.includes(option.value)
  );
  filteredReviewStatusesOptions &&
    filteredReviewStatusesOptions.unshift({
      value: "",
      label: "Все",
    });

  const [isHeaderCheckboxChecked, setIsHeaderCheckboxChecked] =
    useState<boolean>(false);
  const [isCheckedRows, setIsCheckedRows] = useState<any>(checkboxes);
  const [isInputChange, setIsInputChange] = useState<boolean>(false);
  const [isPending, setIsPending] = useState<boolean>(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [displayStart, setDisplayStart] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [displayEnd, setDisplayEnd] = useState(0);
  const [startPage, setStartPage] = useState(1);

  const actualLimit =
    JSON.parse(localStorage.getItem("pageLimit") as string) || limit;
  const detectedBasename = window.location.pathname.startsWith("/react")
    ? "/react"
    : "";
  const tableRef = useRef<any>(null);

  const itemRowHeight = 44;
  const tableHeight =
    Math.max(tableRef.current && tableRef.current.offsetHeight) || 0;
  const rowsToRender = Math.floor((tableHeight * 3) / itemRowHeight);

  useEffect(() => {
    dispatch(actionGetUserReports(actualLimit, page));
    dispatch(actionGetUserReportsFilter());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    requestStatusOptions.forEach((option) => {
      if (
        reportsStatus === option.status &&
        reportsRequestPurpose === option.purpose
      ) {
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

    dispatch(reducerReportsStatus(null));
  }, [reportsRequestPurpose, reportsStatus, dispatch]);

  useEffect(() => {
    const updatedCheckedRows =
      reports &&
      reports.reduce((acc: any, report: any) => {
        acc[report.reportId] = isHeaderCheckboxChecked ? true : false;
        return acc;
      }, {});

    setIsCheckedRows(updatedCheckedRows);
  }, [isHeaderCheckboxChecked, reports]);

  useEffect(() => {
    const handleDocumentClick = () => {
      dispatch(actionGetUserReports(limit, page));
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
  }, [dispatch, isInputChange, limit, page]);

  const resetPages = () => {
    setCurrentPage(1);
    setStartPage(1);
  };

  const handleHeaderCheckboxChange = () => {
    setIsHeaderCheckboxChecked(!isHeaderCheckboxChecked);
  };

  const handleRowCheckboxChange = (reportId: number) => {
    setIsCheckedRows((prevCheckedRows: any) => ({
      ...prevCheckedRows,
      [reportId]: !prevCheckedRows[reportId],
    }));
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    if (value === "") {
      const updatedInputValues = { ...reportsInputValues };
      delete updatedInputValues[name];

      dispatch(reducerUserReportsInputValues(updatedInputValues));
    } else {
      dispatch(
        reducerUserReportsInputValues({
          ...reportsInputValues,
          [name]: value,
        })
      );
    }

    setIsInputChange(true);
  };

  const handleKeyPress = (event: any) => {
    if (event.key === "Enter") {
      dispatch(actionGetUserReports(limit, page));
      setIsInputChange(false);
      resetPages();
    }
  };

  const selectChange = (event: any, name: string) => {
    if (event.value === "") {
      const updatedInputValues = { ...reportsInputValues };
      delete updatedInputValues[name];

      dispatch(reducerUserReportsInputValues(updatedInputValues));
    } else {
      dispatch(
        reducerUserReportsInputValues({
          ...reportsInputValues,
          [name]: name === "mediaStatus" ? event.value : [event.value],
        })
      );
    }

    dispatch(actionGetUserReports(limit, page));
    setIsInputChange(false);
    resetPages();
  };

  const handleChange = (newLimit: number, newPage: number) => {
    setIsPending(true);
    dispatch(actionGetUserReports(newLimit, newPage)).then(() => {
      setIsPending(false);
    });
    localStorage.setItem("pageLimit", JSON.stringify(newLimit));
  };

  const handleChangeLimits = (option: any) => {
    handleChange(option.value, 1);
    resetPages();
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
        Math.min(displayStartPosition + rowsToRender, reports && reports.length)
      );

      setDisplayStart(
        displayEndPosition < displayStartPosition ? 0 : displayStartPosition
      );
      setDisplayEnd(displayEndPosition);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [reports && reports.length, rowsToRender]
  );

  useEffect(() => {
    setDisplayPositions(scrollPosition);
  }, [scrollPosition, setDisplayPositions]);

  useEffect(() => {
    const table = tableRef.current && tableRef.current;

    const onScroll = throttle(() => {
      const scrollTop = table.scrollTop;

      if (reports && reports.length !== 0) {
        setScrollPosition(scrollTop);
        setDisplayPositions(scrollTop);
      }
    }, 100);

    table?.addEventListener("scroll", onScroll);

    return () => {
      table?.removeEventListener("scroll", onScroll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setDisplayPositions, reports && reports.length]);

  const renderVisibleRows = () => {
    const visibleRows = [];

    visibleRows.push(
      <tr
        key="startRowFiller"
        style={{ height: displayStart * itemRowHeight }}
      ></tr>
    );

    for (let i = displayStart; i < displayEnd; ++i) {
      const report =
        data &&
        reports &&
        !data?.settings?.reportsFrom &&
        !data?.settings?.reviewStatuses?.value?.length
          ? reports[i]
          : reports
              ?.slice()
              ?.filter((obj: any) => {
                const objDate = new Date(obj.expected);
                if (filterDate) {
                  return objDate >= filterDate;
                } else return true;
              })
              ?.filter((obj: any) => {
                if (
                  data &&
                  data?.settings?.reviewStatuses?.value?.length &&
                  reports &&
                  reports.every((report: any) => report.reviewStatus)
                ) {
                  const reviewStatus = Object.keys(obj.reviewStatus).toString();
                  return (
                    filteredStatuses && filteredStatuses.includes(reviewStatus)
                  );
                } else return true;
              })[i];

      if (report !== undefined) {
        visibleRows.push(
          <tr className="active__link_tr" key={i}>
            <td>
              <input
                onChange={() => handleRowCheckboxChange(report.reportId)}
                checked={
                  (isCheckedRows && isCheckedRows[report.reportId]) || false
                }
                onClick={(event) => event.stopPropagation()}
                className="relative__elem"
                type="checkbox"
              />
            </td>
            {reportsSettings.includes("reportId") && (
              <td>
                <span className="relative__elem">{report.reportId}</span>
              </td>
            )}
            {reportsSettings.includes("date") && (
              <td>
                <span className="relative__elem">
                  {report.expected?.split("-")?.reverse()?.join(".")}
                </span>
              </td>
            )}
            {reportsSettings.includes("region") && (
              <td>
                <span className="relative__elem">{report.region}</span>
              </td>
            )}
            {reportsSettings.includes("chain") && (
              <td>
                <span className="relative__elem">{report.chain}</span>
              </td>
            )}
            {reportsSettings.includes("address") && (
              <td>
                <span className="relative__elem">
                  {"г." + report.city + ", " + report.address}
                </span>
              </td>
            )}
            {reportsSettings.includes("rate") && (
              <td>
                <span className="relative__elem">
                  {Object.values(report.rateStatus)}
                </span>
              </td>
            )}
            {data &&
              data?.settings?.showReportCheckTypes &&
              reportsSettings.includes("checkTypes") && (
                <td>{report.checkType && Object.values(report.checkType)}</td>
              )}
            {reportsSettings.includes("fixDate") && (
              <td>
                <span className="relative__elem">
                  {report.fixDate && formatHistoryDateTime(report.fixDate)}
                </span>
              </td>
            )}
            {data &&
              data?.settings?.reviewStatus &&
              reportsSettings.includes("review") && (
                <td>
                  <span className="relative__elem">
                    {Object.values(report.reviewStatus)}
                  </span>
                </td>
              )}
            {data &&
              contractsLength >= 2 &&
              reportsSettings.includes("contract") && (
                <td>
                  <span className="relative__elem">{report.contract}</span>
                </td>
              )}
            {reportsSettings.includes("project") && (
              <td>
                <span className="relative__elem">{report.project}</span>
              </td>
            )}
            {reportsSettings.includes("sv") && (
              <td>
                <span className="relative__elem">{report.sv}</span>
              </td>
            )}
            {reportsSettings.includes("merch") && (
              <td>
                <span className="relative__elem">{report.merch}</span>
              </td>
            )}
            {reportsSettings.includes("responsible") && (
              <td>
                <span className="relative__elem">
                  {report?.responsibleCustomer}
                </span>
              </td>
            )}
            {reportsSettings.includes("clientId") && (
              <td>
                <span className="relative__elem">{report.clientId}</span>
              </td>
            )}
            <td className="invisible__reports_cell">
              <a
                className="link__tr"
                href={`${detectedBasename}/reports/${report.reportId}`}
                target="_blank"
                rel="noreferrer"
              >
                {" "}
              </a>
            </td>
          </tr>
        );
      }
    }

    visibleRows.push(
      <tr
        key="endRowFiller"
        style={{
          height: (reports && reports.length - displayEnd) * itemRowHeight,
        }}
      ></tr>
    );

    return visibleRows;
  };

  return (
    <>
      <div className="loader__wrapper">
        {(!reports || isPending) && <Loader />}
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
        <div className="table__wrapper" ref={tableRef}>
          <table>
            <thead>
              <tr>
                <th className="reports__checkbox_block">
                  <input
                    onChange={handleHeaderCheckboxChange}
                    checked={isHeaderCheckboxChecked}
                    type="checkbox"
                  />
                </th>
                {reportsSettings.includes("reportId") && (
                  <th>
                    <div className="filter__number_block">
                      <input
                        defaultValue={
                          reportsInputValues.reportId &&
                          reportsInputValues.reportId
                        }
                        onChange={handleInputChange}
                        onKeyPress={handleKeyPress}
                        name="reportIdText"
                        placeholder=" "
                        type="number"
                      />
                      <label>№</label>
                    </div>
                  </th>
                )}
                {reportsSettings.includes("date") && (
                  <th>
                    <div>
                      <RangeDatePicker
                        reducer={reducerUserReportsInputValues}
                        defaultDateFrom={formattedDateFrom}
                        inputValues={reportsInputValues}
                        defaultDateTo={formattedDateTo}
                        setCurrentPage={setCurrentPage}
                        action={actionGetUserReports}
                        setStartPage={setStartPage}
                        limit={limit}
                        page={page}
                      />
                    </div>
                  </th>
                )}
                {reportsSettings.includes("region") && (
                  <th>
                    <div className="reports__region_block">
                      <CustomMultiSelect
                        reducer={reducerUserReportsInputValues}
                        inputValues={reportsInputValues}
                        action={actionGetUserReports}
                        options={regionsOptions}
                        isShowPlaceholder={true}
                        resetPages={resetPages}
                        pageName="userReports"
                        placeholder="Регион"
                        name="regions"
                        limit={limit}
                      />
                    </div>
                  </th>
                )}
                {reportsSettings.includes("chain") && (
                  <th>
                    <div className="reports__chain_block">
                      <CustomMultiSelect
                        reducer={reducerUserReportsInputValues}
                        inputValues={reportsInputValues}
                        action={actionGetUserReports}
                        isShowPlaceholder={true}
                        options={chainsOptions}
                        resetPages={resetPages}
                        pageName="userReports"
                        name="retailChains"
                        placeholder="Сеть"
                        limit={limit}
                      />
                    </div>
                  </th>
                )}
                {reportsSettings.includes("address") && (
                  <th style={{ minWidth: "280px" }}>
                    <div className="filter__block">
                      <input
                        defaultValue={
                          reportsInputValues.address &&
                          reportsInputValues.address
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
                )}
                {reportsSettings.includes("rate") && (
                  <th>
                    <div className="filter__block">
                      <Select
                        defaultValue={
                          reportsInputValues.rateStatuses &&
                          reportsInputValues.rateStatuses.length &&
                          rateStatusesOptions.find(
                            (option) =>
                              option.value ===
                              reportsInputValues.rateStatuses[0]
                          )
                        }
                        propsChange={(event: any) =>
                          selectChange(event, "rateStatuses")
                        }
                        isShowPlaceholder={
                          !!reportsInputValues.rateStatuses?.length ||
                          reportsInputValues.rateStatuses === undefined
                        }
                        options={rateStatusesOptions}
                        className="users__filter"
                        placeholder="Оценка"
                        name="rateStatuses"
                      />
                    </div>
                  </th>
                )}
                {data &&
                  data?.settings?.showReportCheckTypes &&
                  reportsSettings.includes("checkTypes") && (
                    <th>
                      <div className="multiselect__filter_block">
                        <CustomMultiSelect
                          reducer={reducerUserReportsInputValues}
                          inputValues={reportsInputValues}
                          action={actionGetUserReports}
                          options={checkTypesOptions}
                          placeholder="Тип проверки"
                          isShowPlaceholder={true}
                          resetPages={resetPages}
                          pageName="userReports"
                          name="checkTypes"
                          limit={limit}
                        />
                      </div>
                    </th>
                  )}
                {reportsSettings.includes("fixDate") && (
                  <th>Дата исправления</th>
                )}
                {data &&
                  data?.settings?.reviewStatus &&
                  reportsSettings.includes("review") && (
                    <th>
                      <div className="filter__block">
                        <Select
                          defaultValue={
                            reportsInputValues.reviewStatuses &&
                            reportsInputValues.reviewStatuses.length &&
                            reviewStatusesOptions.find(
                              (option) =>
                                option.value ===
                                reportsInputValues.reviewStatuses[0]
                            )
                          }
                          propsChange={(event: any) =>
                            selectChange(event, "reviewStatuses")
                          }
                          isShowPlaceholder={
                            !!reportsInputValues.reviewStatuses?.length ||
                            reportsInputValues.reviewStatuses === undefined
                          }
                          options={filteredReviewStatusesOptions}
                          className="users__filter"
                          placeholder="Проверка"
                          name="reviewStatuses"
                        />
                      </div>
                    </th>
                  )}
                {data &&
                  contractsLength >= 2 &&
                  reportsSettings.includes("contract") && (
                    <th>
                      <div className="reports__contract_block">
                        <CustomMultiSelect
                          reducer={reducerUserReportsInputValues}
                          inputValues={reportsInputValues}
                          action={actionGetUserReports}
                          options={contractsOptions}
                          isShowPlaceholder={true}
                          resetPages={resetPages}
                          placeholder="Контракт"
                          pageName="userReports"
                          name="contracts"
                          limit={limit}
                        />
                      </div>
                    </th>
                  )}
                {reportsSettings.includes("project") && (
                  <th>
                    <div className="multiselect__filter_block">
                      <CustomMultiSelect
                        reducer={reducerUserReportsInputValues}
                        inputValues={reportsInputValues}
                        action={actionGetUserReports}
                        options={projectOptions}
                        isShowPlaceholder={true}
                        resetPages={resetPages}
                        pageName="userReports"
                        placeholder="Проект"
                        name="projects"
                        limit={limit}
                      />
                    </div>
                  </th>
                )}
                {reportsSettings.includes("sv") && (
                  <th>
                    <div className="multiselect__filter_block">
                      <CustomMultiSelect
                        reducer={reducerUserReportsInputValues}
                        inputValues={reportsInputValues}
                        action={actionGetUserReports}
                        placeholder="Супервайзер"
                        isShowPlaceholder={true}
                        resetPages={resetPages}
                        pageName="userReports"
                        options={svsOptions}
                        name="supervisors"
                        limit={limit}
                      />
                    </div>
                  </th>
                )}
                {reportsSettings.includes("merch") && (
                  <th>
                    <div className="multiselect__filter_block">
                      <CustomMultiSelect
                        reducer={reducerUserReportsInputValues}
                        inputValues={reportsInputValues}
                        action={actionGetUserReports}
                        placeholder="Мерчендайзер"
                        isShowPlaceholder={true}
                        resetPages={resetPages}
                        options={merchsOptions}
                        pageName="userReports"
                        name="merchs"
                        limit={limit}
                      />
                    </div>
                  </th>
                )}
                {reportsSettings.includes("responsible") && (
                  <th>
                    <div className="multiselect__filter_block">
                      <CustomMultiSelect
                        reducer={reducerUserReportsInputValues}
                        options={responsibleCustomersOptions}
                        inputValues={reportsInputValues}
                        action={actionGetUserReports}
                        placeholder="Ответственный"
                        name="responsibleCustomers"
                        isShowPlaceholder={true}
                        resetPages={resetPages}
                        pageName="userReports"
                        limit={limit}
                      />
                    </div>
                  </th>
                )}
                {reportsSettings.includes("clientId") && (
                  <th>
                    <div className="filter__number_block">
                      <input
                        defaultValue={
                          reportsInputValues.posClientId &&
                          reportsInputValues.posClientId
                        }
                        onChange={handleInputChange}
                        onKeyPress={handleKeyPress}
                        name="posClientId"
                        placeholder=" "
                        type="number"
                      />
                      <label>ID ТТ</label>
                    </div>
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="optimized__table_body">
              {renderVisibleRows()}
            </tbody>
          </table>
        </div>
        <div className="pagination">
          <div className="pagination__count">Всего: {reportsCount}</div>
          <div className="pagination__str">
            <span>Отображать строки</span>
            <LimitSelect limit={actualLimit} propsChange={handleChangeLimits} />
          </div>
          <Pagination
            setCurrentPage={setCurrentPage}
            setStartPage={setStartPage}
            handleChange={handleChange}
            currentPage={currentPage}
            pageName="userReports"
            startPage={startPage}
            count={reportsCount}
            limit={actualLimit}
          />
        </div>
      </div>
    </>
  );
};

export default TableCustomerReports;
