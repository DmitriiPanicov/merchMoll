import { FC, Fragment, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

import PhotoViewer from "photoviewer";
import clsx from "clsx";

import {
  actionGetSingleReportSettings,
  actionGetUserSingleReport,
  actionGetCriteriasList,
  actionShowTunderSignal,
  actionGetTechCardData,
} from "../../../redux/action/userSingleReport/actionUserSingleReport";
import {
  reducerSingleReportSettingsOptions,
  reducerReportStatus,
} from "../../../redux/reducer/userSingleReport/reducers/userSingleReport";
import { generateStyles } from "../../../utils/generateToastStyles";
import { createItemsArray } from "../../../utils/createPhotoArray";
import { AppDispatch } from "../../../redux/reducer/store";

import CustomerPhotoTableSection from "./customerSections/CustomerPhotoTableSection";
import ReviewStatusTableSection from "./customerSections/ReviewStatusTableSection";
import CustomerSkusTableSection from "./customerSections/CustomerSkusTableSection";
import RateStatusTableSection from "./customerSections/RateStatusTableSection";
import AdminHistorySection from "./adminSections/AdminHistorySection";
import ToastPopup from "../../custom/toastPopup/toastPopup";
import YandexMap from "../../custom/yandexMap/yandexMap";

import Chevron from "../../../assets/icons/chevron.svg";

import "../../../scss/photoviewer.scss";
import "../table.scss";

const requestStatusOptions = [
  {
    status: 200,
    purpose: "clientReportCheck",
    successMessage: "Статус успешно изменен!",
  },
  {
    status: 0,
    purpose: "clientReportCheck",
    errorMessage: "При изменении статуса произошла ошибка!",
  },
];

const IS_VISIBLE_SIDEBAR = process.env.REACT_APP_IS_VISIBLE_SIDEBAR;

const TableCustomerSingleReport: FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { id } = useParams<{ id: string }>();

  const {
    initialCustomerReportOptions,
    filteredReviewHistory,
    filteredRateHistory,
    sortedNearReports,
    reorderedOptions,
    requestPurpose,
    techCardData,
    beforeMedias,
    afterMedias,
    settings,
    status,
    report,
    files,
  } = useSelector((state: any) => state.userSingleReport.userSingleReport);
  const { data, isOpenSidebar } = useSelector((state: any) => state.user.user);

  const [selectedSkusPhoto, setSelectedSkusPhoto] = useState<any>(null);
  const [selectedPlanogram, setSelectedPlanogram] = useState<any>(null);
  const [isOpenFullMainInfo, setIsOpenFullMainInfo] = useState<boolean>(
    JSON.parse(localStorage.getItem("isOpenFullMainInfo") as string) || false
  );
  const [currentReviewHistoryPage, setCurrentReviewHistoryPage] =
    useState<number>(1);
  const [currentRateHistoryPage, setCurrentRateHistoryPage] =
    useState<number>(1);
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  const photoViewerInstance = document.querySelector(".photoviewer-modal");
  const previousReportIdRef = useRef<string | null>(null);
  const prevReportStatus = useRef<string | null>(null);

  useEffect(() => {
    dispatch(actionGetSingleReportSettings("customerReport"));
    dispatch(actionGetUserSingleReport(id as string));
  }, [dispatch, id]);

  useEffect(() => {
    if (report && report?.reportId?.id) {
      if (previousReportIdRef.current !== report?.reportId?.id) {
        dispatch(actionGetCriteriasList(report?.contract?.id));
        dispatch(actionGetTechCardData(report.pos.pos.id));
        dispatch(
          actionShowTunderSignal({
            contractId: report && report?.contract?.id,
            posId: report && report?.pos?.pos?.id,
            date: report && report?.expected,
          })
        );
      }
      previousReportIdRef.current = report.reportId.id;
    }
  }, [dispatch, initialCustomerReportOptions, report, reorderedOptions]);

  useEffect(() => {
    if (report && report?.reportId?.id) {
      if (
        previousReportIdRef.current !== report?.reportId?.id ||
        prevReportStatus.current !==
          Object.keys(report.rateModel.rateStatus).toString()
      ) {
        if (initialCustomerReportOptions && reorderedOptions) {
          const optionsToDelete =
            reorderedOptions &&
            reorderedOptions.filter(
              (option: any) =>
                initialCustomerReportOptions &&
                !initialCustomerReportOptions.some(
                  (elem: any) => option.value === elem.value
                )
            );

          const optionsToAdd =
            initialCustomerReportOptions &&
            initialCustomerReportOptions.filter(
              (option: any) =>
                reorderedOptions &&
                !reorderedOptions.some(
                  (elem: any) => option.value === elem.value
                )
            );

          const updatedOptions = reorderedOptions &&
            initialCustomerReportOptions && [
              ...(reorderedOptions || initialCustomerReportOptions)?.filter(
                (option: any) =>
                  optionsToDelete &&
                  !optionsToDelete.some(
                    (elem: any) => option.value === elem.value
                  )
              ),
              ...optionsToAdd,
            ];

          updatedOptions &&
            dispatch(
              reducerSingleReportSettingsOptions({
                entity: updatedOptions,
              })
            );
        }
      }
      previousReportIdRef.current = report.reportId.id;
      prevReportStatus.current = Object.keys(
        report.rateModel.rateStatus
      ).toString();
    }
  }, [dispatch, initialCustomerReportOptions, report, reorderedOptions]);

  useEffect(() => {
    requestStatusOptions.forEach((option) => {
      if (status === option.status && requestPurpose === option.purpose) {
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

    dispatch(reducerReportStatus(null));
  }, [dispatch, report, requestPurpose, status]);

  useEffect(() => {
    const openPhotoViewer = (items: any[], selected: string | null) => {
      if (selected) {
        const options = {
          index: items.findIndex((item: any) => item?.src?.includes(selected)),
        };

        if (photoViewerInstance) {
          photoViewerInstance.remove();
        }

        new PhotoViewer(items, options);
      }
    };

    if (selectedPhoto) {
      const items = createItemsArray(report.medias, "media.name");
      openPhotoViewer(items, selectedPhoto);
      setSelectedPhoto(null);
    }

    if (selectedPlanogram) {
      const items = createItemsArray(report.planograms);
      openPhotoViewer(items, selectedPlanogram);
      setSelectedPlanogram(null);
    }

    if (selectedSkusPhoto) {
      const items = createItemsArray(report.skus, "sku.name");
      openPhotoViewer(items, selectedSkusPhoto);
      setSelectedSkusPhoto(null);
    }
  }, [
    photoViewerInstance,
    selectedPlanogram,
    selectedSkusPhoto,
    selectedPhoto,
    report,
  ]);

  const handleNearReportClick = () => {
    if (photoViewerInstance) {
      photoViewerInstance.remove();
    }
  };

  return (
    <>
      <div className="fixed__singleReport_tabs">
        <div className="report__reports_block">
          {report &&
            sortedNearReports.map((nearRep: any, index: any) => (
              <Link
                to={`/reports/${nearRep.report.id}`}
                key={index}
                className={
                  nearRep.report.id.toString() === (id as string)
                    ? "report__block active__report"
                    : "report__block"
                }
                onClick={handleNearReportClick}
              >
                Отчет №{nearRep.report.id}{" "}
                {nearRep.date.split("-").reverse().join(".")}
              </Link>
            ))}
        </div>
      </div>
      <div
        className={clsx(
          JSON.parse(IS_VISIBLE_SIDEBAR as string) &&
            isOpenSidebar &&
            "customerSingle__report_activeTable",
          !isOpenSidebar && "customerSingle__report_closedTable",
          "customerSingle__report_table"
        )}
      >
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 5000,
          }}
        />
        {(reorderedOptions || initialCustomerReportOptions)?.map(
          (elem: any, index: number) => {
            if (elem.value === "mainInfo") {
              return (
                <div className="customerReport__info_block" key={index}>
                  <div className="customer__info_row">
                    <span>Торговая точка</span>
                    <span>
                      {report && report.chain}, г.{report && report.pos.city}
                      {", "}
                      {report && report.pos.address}
                    </span>
                  </div>
                  <div className="customer__info_row">
                    <span>Регион</span>
                    <span>{report && report.pos.region}</span>
                  </div>
                  <div className="customer__info_row">
                    <span>Контракт</span>
                    <span>{report && report.contract.name}</span>
                  </div>
                  <div className="customer__info_row">
                    <span>Комментарий</span>
                    <span>{report && report.notes}</span>
                  </div>
                  <div
                    className={clsx(
                      "full__info_block",
                      isOpenFullMainInfo && "active__full_infoBlock"
                    )}
                  >
                    <div className="customer__info_row">
                      <span>Проект</span>
                      <span>{report && report.project}</span>
                    </div>
                    <div className="customer__info_row">
                      <span>Мерчендайзер</span>
                      <span>
                        {report && report?.merch?.familyName}{" "}
                        {report && report?.merch?.givenName}{" "}
                        {report && report?.merch?.middleName} (
                        {report && report?.merch?.login})
                      </span>
                    </div>
                    <div className="customer__info_row">
                      <span>Супервайзер</span>
                      {report && report?.supervisor ? (
                        <span>
                          {report && report?.supervisor?.familyName}{" "}
                          {report && report?.supervisor?.givenName}{" "}
                          {report && report?.supervisor?.middleName}
                        </span>
                      ) : (
                        <span>—</span>
                      )}
                    </div>
                    <div className="customer__info_row">
                      <span>Виртуальный супервайзер</span>
                      {report && report?.vsupervisor ? (
                        <span>
                          {report && report?.vsupervisor?.familyName}{" "}
                          {report && report?.vsupervisor?.givenName}{" "}
                          {report && report?.vsupervisor?.middleName} (
                          {report && report?.vsupervisor?.login})
                        </span>
                      ) : (
                        <span>—</span>
                      )}
                    </div>
                    {techCardData &&
                      techCardData.map((elem: any, index: number) => (
                        <div className="customer__info_row" key={index}>
                          <span>{elem.question.name}</span>
                          <span>{elem.value}</span>
                        </div>
                      ))}
                  </div>
                  <img
                    onClick={() => {
                      localStorage.setItem(
                        "isOpenFullMainInfo",
                        JSON.stringify(!isOpenFullMainInfo)
                      );
                      setIsOpenFullMainInfo(!isOpenFullMainInfo);
                    }}
                    className={clsx(
                      "info__row_icon",
                      isOpenFullMainInfo && "info__row_activeIcon"
                    )}
                    src={Chevron}
                    alt="showMore"
                  />
                </div>
              );
            }

            if (elem.value === "geo") {
              return (
                <Fragment key={index}>
                  {data &&
                    data.settings.geo &&
                    report &&
                    report.pos.longitude &&
                    report.pos.latitude &&
                    settings.includes("geo") &&
                    previousReportIdRef.current === report?.reportId?.id && (
                      <div className="customer__geo_parentBlock">
                        <div className="customerGeo__block">
                          <span className="section__title">
                            Координаты торговой точки
                          </span>
                          <YandexMap />
                        </div>
                      </div>
                    )}
                </Fragment>
              );
            }

            if (elem.value === "photos") {
              return (
                <Fragment key={index}>
                  {settings.includes("photos") && (
                    <>
                      {report && !!report.medias.length && (
                        <>
                          {!!beforeMedias.length && (
                            <CustomerPhotoTableSection
                              setSelectedPhoto={setSelectedPhoto}
                              title="Фото при создании отчета"
                              medias={beforeMedias}
                            />
                          )}
                          {!!afterMedias.length && (
                            <CustomerPhotoTableSection
                              title="Фото после доработки отчета"
                              setSelectedPhoto={setSelectedPhoto}
                              medias={afterMedias}
                            />
                          )}
                        </>
                      )}
                    </>
                  )}
                </Fragment>
              );
            }

            if (elem.value === "files") {
              return (
                <Fragment key={index}>
                  {report && !!files.length && settings.includes("files") && (
                    <>
                      <span className="section__title">Файлы отчета</span>
                      <div className="report__files_section">
                        {report &&
                          files?.map((elem: any, index: number) => (
                            <div
                              key={elem.media.id}
                              className="report__file_block"
                            >
                              <Link
                                className="file__link"
                                to={`/${elem.media.name}`}
                                target="_blank"
                              >
                                {index + 1} файл
                              </Link>
                            </div>
                          ))}
                      </div>
                    </>
                  )}
                </Fragment>
              );
            }

            if (elem.value === "planogramms") {
              return (
                <Fragment key={index}>
                  {report &&
                    !!report?.planograms?.length &&
                    data &&
                    !data.settings.onlyPhotoAndGeo &&
                    settings.includes("planogramms") && (
                      <>
                        <span className="section__title">Планограммы</span>
                        <div className="planogramms__table">
                          {report &&
                            report.planograms.map(
                              (elem: any, index: number) => (
                                <img
                                  onClick={() =>
                                    setSelectedPlanogram(elem.url.link)
                                  }
                                  className="planogram__photo"
                                  src={elem.url.thumb}
                                  alt="planoram"
                                  key={index}
                                />
                              )
                            )}
                        </div>
                      </>
                    )}
                </Fragment>
              );
            }

            if (elem.value === "cv") {
              return (
                <Fragment key={index}>
                  {!data.settings.onlyPhotoAndGeo &&
                    report &&
                    !!report?.cv?.length &&
                    settings.includes("cv") && (
                      <>
                        <span className="section__title">Данные по ТТ</span>
                        <table className="customer__skus_table">
                          <thead className="tunder__thead">
                            <tr>
                              <th>Наименование</th>
                              <th>Значение</th>
                              <th>Горячая линия</th>
                            </tr>
                          </thead>
                          <tbody>
                            {report &&
                              report?.cv.map((elem: any, index: number) => {
                                return (
                                  <tr key={index}>
                                    <td>{elem.name}</td>
                                    <td>{elem.value}</td>
                                    <td>{elem.hotline || "—"}</td>
                                  </tr>
                                );
                              })}
                          </tbody>
                        </table>
                      </>
                    )}
                </Fragment>
              );
            }

            if (elem.value === "skus") {
              return (
                <Fragment key={index}>
                  {!data.settings.onlyPhotoAndGeo &&
                    report &&
                    !!report?.skus?.length &&
                    settings.includes("skus") && (
                      <CustomerSkusTableSection
                        setSelectedSkusPhoto={setSelectedSkusPhoto}
                        previousReportIdRef={previousReportIdRef}
                      />
                    )}
                </Fragment>
              );
            }

            if (elem.value === "actionsTT") {
              return (
                <Fragment key={index}>
                  {!data.settings.onlyPhotoAndGeo &&
                    report &&
                    !!report?.actions?.length &&
                    settings.includes("actionsTT") && (
                      <>
                        <span className="section__title">Акции по ТТ</span>
                        <table className="customerOutlet__data_table">
                          <thead className="tunder__thead">
                            <tr>
                              <th>Наименование</th>
                              <th>Значение</th>
                              <th>Горячая линия</th>
                            </tr>
                          </thead>
                          <tbody>
                            {report &&
                              report?.actions?.map((elem: any, index: any) => {
                                return (
                                  <tr key={index}>
                                    <td>{elem.action.name}</td>
                                    <td>{elem.value}</td>
                                    <td>{elem.hotline || "—"}</td>
                                  </tr>
                                );
                              })}
                          </tbody>
                        </table>
                      </>
                    )}
                </Fragment>
              );
            }

            if (elem.value === "actions") {
              return (
                <Fragment key={index}>
                  {!data.settings.onlyPhotoAndGeo &&
                    report &&
                    !!report?.skuActions?.length &&
                    settings.includes("actions") && (
                      <>
                        <span className="section__title">Акции по товарам</span>
                        <table className="customerOutlet__data_table">
                          <thead className="tunder__thead">
                            <tr>
                              <th>Акция</th>
                              <th>Наименование</th>
                              <th>Значение</th>
                              <th>Горячая линия</th>
                            </tr>
                          </thead>
                          <tbody>
                            {report &&
                              report?.skuActions?.map(
                                (elem: any, index: any) => {
                                  return (
                                    <tr key={index}>
                                      <td>{elem.action.name}</td>
                                      <td>{elem.skuName}</td>
                                      <td>{elem.value}</td>
                                      <td>{elem.hotline || "—"}</td>
                                    </tr>
                                  );
                                }
                              )}
                          </tbody>
                        </table>
                      </>
                    )}
                </Fragment>
              );
            }

            if (elem.value === "skuCv") {
              return (
                <Fragment key={index}>
                  {!data.settings.onlyPhotoAndGeo &&
                    report &&
                    !!report?.skuCv?.length &&
                    settings.includes("skuCv") && (
                      <>
                        <span className="section__title">
                          Доп. данные по товарам
                        </span>
                        <table className="customerOutlet__data_table">
                          <thead className="tunder__thead">
                            <tr>
                              <th>Наименование</th>
                              <th>SKU</th>
                              <th>Значение</th>
                              <th>Горячая линия</th>
                            </tr>
                          </thead>
                          <tbody>
                            {report &&
                              report?.skuCv?.map((elem: any, index: number) => (
                                <tr key={index}>
                                  <td>{elem.name}</td>
                                  <td>
                                    {elem?.brand} {elem.sku.name}
                                  </td>
                                  <td>{elem.value}</td>
                                  <td>{elem.hotline || "—"}</td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      </>
                    )}
                </Fragment>
              );
            }

            if (elem.value === "rate") {
              return (
                <Fragment key={index}>
                  {settings.includes("rate") &&
                    report &&
                    Object.keys(report?.rateModel?.rateStatus).toString() !==
                      "NotChecked" && (
                      <div className="check__block">
                        <RateStatusTableSection />
                      </div>
                    )}
                </Fragment>
              );
            }

            if (elem.value === "review") {
              return (
                <Fragment key={index}>
                  {settings.includes("review") &&
                    data &&
                    data.settings.reviewStatus &&
                    report &&
                    Object.keys(
                      report?.reviewModel?.reviewStatus
                    ).toString() !== "NotChecked" && (
                      <div className="check__block">
                        <ReviewStatusTableSection />
                      </div>
                    )}
                </Fragment>
              );
            }

            if (elem.value === "history") {
              return (
                <Fragment key={index}>
                  {report &&
                    !!filteredRateHistory?.length &&
                    settings.includes("history") && (
                      <AdminHistorySection
                        setCurrentHistoryPage={setCurrentRateHistoryPage}
                        currentHistoryPage={currentRateHistoryPage}
                        filteredHistory={filteredRateHistory}
                        title="Изменения по оценке"
                      />
                    )}
                  {report &&
                    !!filteredReviewHistory?.length &&
                    settings.includes("history") && (
                      <AdminHistorySection
                        setCurrentHistoryPage={setCurrentReviewHistoryPage}
                        currentHistoryPage={currentReviewHistoryPage}
                        filteredHistory={filteredReviewHistory}
                        title="Изменения по проверке"
                      />
                    )}
                </Fragment>
              );
            }

            return null;
          }
        )}
      </div>
    </>
  );
};

export default TableCustomerSingleReport;
