import { FC, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast, { Toaster } from "react-hot-toast";

import throttle from "lodash.throttle";
import clsx from "clsx";

import {
  actionGetUserReportsFilter,
  actionGetUserReports,
} from "../../../redux/action/userReports/actionUserReports";
import { reducerReportStatus } from "../../../redux/reducer/userSingleReport/reducers/userSingleReport";
import {
  reducerUserReportsInputValues,
  reducerSelectedReports,
  reducerReportsStatus,
} from "../../../redux/reducer/userReports/reducers/userReports";
import { generateStyles } from "../../../utils/generateToastStyles";
import { getLabelByValue } from "../../../utils/getLabelByValue";
import { formatReports } from "../../../utils/formatReports";
import { AppDispatch } from "../../../redux/reducer/store";

import CustomMultiSelect from "../../custom/customMultiSelect/customMultiSelect";
import RangeDatePicker from "../../custom/rangeDatePicker/rangeDatePicker";
import LimitSelect from "../../custom/limitSelect/limitSelect";
import ToastPopup from "../../custom/toastPopup/toastPopup";
import Pagination from "../../pagination/pagination";
import Select from "../../custom/select/select";
import Loader from "../../custom/loader/loader";

import { ReactComponent as LocationIcon } from "../../../assets/icons/location.svg";
import Photo from "../../../assets/icons/photo.svg";

import "../table.scss";

const IS_VISIBLE_SIDEBAR = process.env.REACT_APP_IS_VISIBLE_SIDEBAR;

const reviewStatusesOptions = [
  { value: "", label: "Все" },
  { value: "Improved", label: "Доработан" },
  { value: "Revision", label: "Доработка" },
  { value: "Fixed", label: "Исправлен" },
  { value: "NotChecked", label: "Не проверен" },
  { value: "Rejected", label: "Отклонен" },
  { value: "PartiallyRejected", label: "Отклонен (частично)" },
  { value: "Malfunction", label: "Тех. сбой" },
  { value: "Approved", label: "Утвержден" },
];

const deliveryStatusesOptions = [
  { value: "", label: "Все" },
  { value: "OnTime", label: "Вовремя" },
  { value: "Expired", label: "Просрочен" },
  { value: "Manual", label: "Создан" },
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

const geoStatusesOptions = [
  { value: "", label: "Все" },
  { value: "IN_RANGE", label: "Корректная" },
  { value: "NOT_IN_RANGE", label: "Некорректная" },
  { value: "NOT_FOUND", label: "Нет" },
  { value: "PHOTO", label: "Фото" },
];

const mediaStatusesOptions = [
  { value: "", label: "Все" },
  { value: "ContentUploaded", label: "Есть" },
  { value: "NoMedia", label: "Нет" },
  { value: "ContentMissing", label: "Нет файлов" },
];

const TableAdminReports: FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const {
    reportsRequestPurpose,
    adminReportsSettings,
    reportsInputValues,
    selectedReportsId,
    formattedDateFrom,
    contractsOptions,
    formattedDateTo,
    regionsOptions,
    projectOptions,
    chainsOptions,
    reportsStatus,
    merchsOptions,
    reportsCount,
    updateStatus,
    vsvsOptions,
    checkboxes,
    svsOptions,
    reports,
    limit,
    page,
  } = useSelector((state: any) => state.userReports.userReports);
  const { report } = useSelector(
    (state: any) => state.userSingleReport.userSingleReport
  );
  const { data, isOpenSidebar } = useSelector((state: any) => state.user.user);

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
  const rowsToRender = Math.floor((tableHeight * 2) / itemRowHeight);

  const requestStatusOptions = useMemo(
    () => [
      {
        status: 200,
        purpose: "delete",
        successMessage: `Отчет №${
          report && report?.reportId?.id
        } успешно удален.`,
      },
      {
        status: 0,
        purpose: "delete",
        errorMessage: "При удалении отчета произошла ошибка!",
      },
      {
        status: 200,
        purpose: "unloadReportsList",
        successMessage: `Отчет будет отправлен на почту ${data?.email}, когда будет сформирован!`,
      },
      {
        status: 0,
        purpose: "unloadReportsList",
        errorMessage: "При выгрузке списка произошла ошибка!",
      },
      {
        status: 200,
        purpose: "unloadWithLinks",
        successMessage: `Отчет будет отправлен на почту ${data?.email}, когда будет сформирован!`,
      },
      {
        status: 0,
        purpose: "unloadWithLinks",
        errorMessage: "При выгрузке данных с ссылками произошла ошибка!",
      },
      {
        status: 200,
        purpose: "unloadReportsPhotos",
        successMessage: `Ссылка на архив будет отправлена на почту ${data?.email}, когда будет сформирована!`,
      },
      {
        status: 0,
        purpose: "unloadReportsPhotos",
        errorMessage: "При выгрузке фотографий произошла ошибка!",
      },
      {
        status: 200,
        purpose: "createGeo",
        successMessage: `У ${selectedReportsId?.length} отчетов геолокация успешно создана!`,
        action: () => {
          dispatch(reducerSelectedReports([]));
        },
      },
      {
        status: 0,
        purpose: "createGeo",
        errorMessage: `У ${selectedReportsId?.length} отчетов не удалось создать геолокацию!`,
        action: () => {
          dispatch(reducerSelectedReports([]));
        },
      },
      {
        status: 200,
        purpose: "copyReports",
        successMessage: `Скопировано ${selectedReportsId?.length} отчетов!`,
        action: () => {
          dispatch(reducerSelectedReports([]));
        },
      },
      {
        status: 0,
        purpose: "copyReports",
        errorMessage: "При копировании отчетов произошла ошибка!",
      },
      {
        status: 200,
        purpose: "updateDeliveryStatus",
        successMessage: `У ${
          selectedReportsId?.length
        } отчетов изменен статус доставки. Новый статус: ${getLabelByValue(
          updateStatus,
          deliveryStatusesOptions
        )}!`,
        action: () => {
          dispatch(actionGetUserReports(limit, page));
          dispatch(reducerSelectedReports([]));
          resetPages();
        },
      },
      {
        status: 0,
        purpose: "updateDeliveryStatus",
        errorMessage: "При обновлении статуса доставки произошла ошибка!",
        action: () => {
          dispatch(reducerSelectedReports([]));
          resetPages();
        },
      },
      {
        status: 200,
        purpose: "osa",
        successMessage: `Отчет будет отправлен на почту ${data?.email}, когда будет сформирован!`,
      },
      {
        status: 0,
        purpose: "osa",
        errorMessage: "При выгрузке OSA произошла ошибка!",
      },
      {
        status: 200,
        purpose: "averageFacing",
        successMessage: `Отчет будет отправлен на почту ${data?.email}, когда будет сформирован!`,
      },
      {
        status: 0,
        purpose: "averageFacing",
        errorMessage: "При выгрузке среднего фейсинга произошла ошибка!",
      },
      {
        status: 200,
        purpose: "unloadHotline",
        successMessage: `Отчет будет отправлен на почту ${data?.email}, когда будет сформирован!`,
      },
      {
        status: 0,
        purpose: "unloadHotline",
        errorMessage: "При выгрузке горячей линии произошла ошибка!",
      },
      {
        status: 200,
        purpose: "updateRateStatus",
        successMessage: `У ${
          selectedReportsId?.length
        } отчетов изменен статус оценки. Новый статус: ${getLabelByValue(
          updateStatus,
          rateStatusesOptions
        )}!`,
        action: () => {
          dispatch(actionGetUserReports(limit, page));
          dispatch(reducerSelectedReports([]));
          resetPages();
        },
      },
      {
        status: 0,
        purpose: "updateRateStatus",
        errorMessage: "При обновлении статуса оценки произошла ошибка!",
        action: () => {
          dispatch(reducerSelectedReports([]));
          resetPages();
        },
      },
      {
        status: 200,
        purpose: "updateReviewStatus",
        successMessage: `У ${
          selectedReportsId?.length
        } отчетов изменен статус проверки. Новый статус: ${getLabelByValue(
          updateStatus,
          reviewStatusesOptions
        )}!`,
        action: () => {
          dispatch(actionGetUserReports(limit, page));
          dispatch(reducerSelectedReports([]));
          resetPages();
        },
      },
      {
        status: 0,
        purpose: "updateReviewStatus",
        errorMessage: "При обновлении статуса проверки произошла ошибка!",
        action: () => {
          dispatch(reducerSelectedReports([]));
          resetPages();
        },
      },
      {
        status: 200,
        purpose: "unloadReportsConsolidated",
        successMessage: `Отчет будет отправлен на почту ${data?.email}, когда будет сформирован!`,
      },
      {
        status: 0,
        purpose: "unloadReportsConsolidated",
        errorMessage: "При выгрузке данных произошла ошибка!",
      },
      {
        status: 200,
        purpose: "unloadClientReport",
        successMessage: `Отчет будет отправлен на почту ${data?.email}, когда будет сформирован!`,
      },
      {
        status: 0,
        purpose: "unloadClientReport",
        errorMessage: "При выгрузке отчета произошла ошибка!",
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
    ],
    [selectedReportsId, updateStatus, dispatch, report, limit, page, data]
  );

  useEffect(() => {
    dispatch(actionGetUserReports(actualLimit, page));
    dispatch(actionGetUserReportsFilter());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (selectedReportsId && !selectedReportsId.length) {
      setIsCheckedRows(reports && checkboxes);
      setIsHeaderCheckboxChecked(false);
    }
  }, [checkboxes, reports, selectedReportsId]);

  useEffect(() => {
    const updatedCheckedRows =
      reports &&
      reports.reduce((acc: any, report: any) => {
        acc[report.reportId] = isHeaderCheckboxChecked ? true : false;
        return acc;
      }, {});

    dispatch(reducerSelectedReports(formatReports(updatedCheckedRows)));
    setIsCheckedRows(updatedCheckedRows);
  }, [dispatch, isHeaderCheckboxChecked, reports]);

  useEffect(() => {
    requestStatusOptions.forEach((option: any) => {
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

        if (option.action) {
          option.action();
        }
      }
    });

    dispatch(reducerReportsStatus(null));
    dispatch(reducerReportStatus(null));
  }, [dispatch, reportsRequestPurpose, reportsStatus, requestStatusOptions]);

  useEffect(() => {
    const handleDocumentClick = () => {
      dispatch(actionGetUserReports(limit, page));
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

  const handleHeaderCheckboxChange = () => {
    setIsHeaderCheckboxChecked(!isHeaderCheckboxChecked);
  };

  const handleRowCheckboxChange = (reportId: number) => {
    setIsCheckedRows((prevCheckedRows: any) => ({
      ...prevCheckedRows,
      [reportId]: !prevCheckedRows[reportId],
    }));

    const updatedSelectedReports = formatReports({
      ...isCheckedRows,
      [reportId]: !isCheckedRows[reportId],
    });

    dispatch(reducerSelectedReports(updatedSelectedReports));
  };

  const resetPages = () => {
    setCurrentPage(1);
    setStartPage(1);
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
          [name]:
            name === "mediaStatus" || name === "inRange"
              ? event.value
              : [event.value],
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
      const report = reports[i];

      if (report !== undefined) {
        visibleRows.push(
          <tr className="active__link_tr" key={i}>
            <td>
              <input
                onChange={() => handleRowCheckboxChange(report.reportId)}
                checked={
                  (isCheckedRows && isCheckedRows[report.reportId]) || false
                }
                className="relative__elem"
                type="checkbox"
              />
            </td>
            {adminReportsSettings.includes("reportId") && (
              <td>
                <span className="relative__elem">{report.reportId}</span>
              </td>
            )}
            {adminReportsSettings.includes("date") && (
              <td>
                <span className="relative__elem">
                  {report.expected?.split("-")?.reverse()?.join(".")}
                </span>
              </td>
            )}
            {adminReportsSettings.includes("review") && (
              <td>
                <span className="relative__elem">
                  {Object.values(report.reviewStatus)}
                </span>
              </td>
            )}
            {adminReportsSettings.includes("delivery") && (
              <td>
                <span
                  className={
                    Object.keys(report.deliveryStatus).toString() === "OnTime"
                      ? "greenText"
                      : Object.keys(report.deliveryStatus).toString() ===
                        "Expired"
                      ? "yellowText"
                      : "redText"
                  }
                >
                  <span className="relative__elem">
                    {Object.values(report.deliveryStatus)}
                  </span>
                </span>
              </td>
            )}
            {adminReportsSettings.includes("rate") && (
              <td>
                <span className="relative__elem">
                  {Object.values(report.rateStatus)}
                </span>
              </td>
            )}
            {adminReportsSettings.includes("geo") && (
              <td>
                {Object.keys(report.inRange).toString() === "PHOTO" && (
                  <LocationIcon className="location__icon" />
                )}
                {Object.keys(report.inRange).toString() === "NOT_IN_RANGE" && (
                  <LocationIcon className="red__location_icon" />
                )}
                {Object.keys(report.inRange).toString() === "IN_RANGE" && (
                  <LocationIcon className="green__location_icon" />
                )}
              </td>
            )}
            {adminReportsSettings.includes("photo") && (
              <td>
                {Object.keys(report.mediaStatus).toString() ===
                  "ContentUploaded" && (
                  <img src={Photo} alt="" className="table-button-img" />
                )}
              </td>
            )}
            {adminReportsSettings.includes("contract") && (
              <td>
                <span className="relative__elem">{report.contract}</span>
              </td>
            )}
            {adminReportsSettings.includes("chain") && (
              <td>
                <span className="relative__elem">{report.chain}</span>
              </td>
            )}
            {adminReportsSettings.includes("region") && (
              <td>
                <span className="relative__elem">{report.region}</span>
              </td>
            )}
            {adminReportsSettings.includes("address") && (
              <td>
                <span className="relative__elem">
                  {"г." + report.city + ", " + report.address}
                </span>
              </td>
            )}
            {adminReportsSettings.includes("project") && (
              <td>
                <span className="relative__elem">{report.project}</span>
              </td>
            )}
            {adminReportsSettings.includes("sv") && (
              <td>
                <span className="relative__elem">{report.sv}</span>
              </td>
            )}
            {adminReportsSettings.includes("vsv") && (
              <td>
                <span className="relative__elem">{report.vsv}</span>
              </td>
            )}
            {adminReportsSettings.includes("merch") && (
              <td>
                <span className="relative__elem">{report.merch}</span>
              </td>
            )}
            {adminReportsSettings.includes("clientId") && (
              <td>
                <span className="relative__elem">{report.clientId}</span>
              </td>
            )}
            <td className="invisible__reports_cell">
              <a
                href={`${detectedBasename}/reports/${report.reportId}`}
                className="link__tr"
                draggable="false"
                rel="noreferrer"
                target="_blank"
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
                {adminReportsSettings.includes("reportId") && (
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
                {adminReportsSettings.includes("date") && (
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
                {adminReportsSettings.includes("review") && (
                  <th>
                    <div className="filter__number_block">
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
                        isShowPlaceholder={
                          !!reportsInputValues.reviewStatuses?.length ||
                          reportsInputValues.reviewStatuses === undefined
                        }
                        propsChange={(event: any) =>
                          selectChange(event, "reviewStatuses")
                        }
                        options={reviewStatusesOptions}
                        className="users__filter"
                        placeholder="Проверка"
                        name="reviewStatuses"
                      />
                    </div>
                  </th>
                )}
                {adminReportsSettings.includes("delivery") && (
                  <th>
                    <div className="filter__number_block">
                      <Select
                        defaultValue={
                          reportsInputValues.deliveryStatuses &&
                          reportsInputValues.deliveryStatuses.length &&
                          deliveryStatusesOptions.find(
                            (option) =>
                              option.value ===
                              reportsInputValues.deliveryStatuses[0]
                          )
                        }
                        isShowPlaceholder={
                          !!reportsInputValues.deliveryStatuses?.length ||
                          reportsInputValues.deliveryStatuses === undefined
                        }
                        propsChange={(event: any) =>
                          selectChange(event, "deliveryStatuses")
                        }
                        options={deliveryStatusesOptions}
                        className="users__filter"
                        name="deliveryStatuses"
                        placeholder="Статус"
                      />
                    </div>
                  </th>
                )}
                {adminReportsSettings.includes("rate") && (
                  <th style={{ minWidth: "120px" }}>
                    <div>
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
                        isShowPlaceholder={
                          !!reportsInputValues.rateStatuses?.length ||
                          reportsInputValues.rateStatuses === undefined
                        }
                        propsChange={(event: any) =>
                          selectChange(event, "rateStatuses")
                        }
                        options={rateStatusesOptions}
                        className="users__filter"
                        placeholder="Оценка"
                        name="rateStatuses"
                      />
                    </div>
                  </th>
                )}
                {adminReportsSettings.includes("geo") && (
                  <th>
                    <div className="geo__photo_filterBlock">
                      <Select
                        defaultValue={
                          reportsInputValues.inRange &&
                          geoStatusesOptions.find(
                            (option) =>
                              option.value === reportsInputValues.inRange
                          )
                        }
                        isShowPlaceholder={
                          !!reportsInputValues.inRange ||
                          reportsInputValues.inRange === undefined
                        }
                        propsChange={(event: any) =>
                          selectChange(event, "inRange")
                        }
                        options={geoStatusesOptions}
                        className="users__filter"
                        placeholder="Гео"
                        name="inRange"
                      />
                    </div>
                  </th>
                )}
                {adminReportsSettings.includes("photo") && (
                  <th>
                    <div className="geo__photo_filterBlock">
                      <Select
                        defaultValue={
                          reportsInputValues.mediaStatus &&
                          mediaStatusesOptions.find(
                            (option) =>
                              option.value === reportsInputValues.mediaStatus
                          )
                        }
                        isShowPlaceholder={
                          !!reportsInputValues.mediaStatus ||
                          reportsInputValues.mediaStatus === undefined
                        }
                        propsChange={(event: any) =>
                          selectChange(event, "mediaStatus")
                        }
                        options={mediaStatusesOptions}
                        className="users__filter"
                        placeholder="Фото"
                        name="mediaStatus"
                      />
                    </div>
                  </th>
                )}
                {adminReportsSettings.includes("contract") && (
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
                {adminReportsSettings.includes("chain") && (
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
                {adminReportsSettings.includes("region") && (
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
                {adminReportsSettings.includes("address") && (
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
                {adminReportsSettings.includes("project") && (
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
                {adminReportsSettings.includes("sv") && (
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
                {adminReportsSettings.includes("vsv") && (
                  <th>
                    <div className="multiselect__filter_block">
                      <CustomMultiSelect
                        reducer={reducerUserReportsInputValues}
                        inputValues={reportsInputValues}
                        placeholder="Вирт. Супервайзер"
                        action={actionGetUserReports}
                        isShowPlaceholder={true}
                        resetPages={resetPages}
                        pageName="userReports"
                        options={vsvsOptions}
                        limit={limit}
                        name="vsvs"
                      />
                    </div>
                  </th>
                )}
                {adminReportsSettings.includes("merch") && (
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
                {adminReportsSettings.includes("clientId") && (
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

export default TableAdminReports;
