import { FC, Fragment, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

import PhotoViewer from "photoviewer";
import clsx from "clsx";

import {
  actionGetSingleReportSettings,
  actionGetUserSingleReport,
  actionDeleteReportPhotos,
  actionDownloadNewPhotos,
  actionUpdateReportNotes,
  actionGetCriteriasList,
  actionShowTunderSignal,
  actionGetTechCardData,
} from "../../../redux/action/userSingleReport/actionUserSingleReport";
import {
  reducerSingleReportSettingsOptions,
  reducerDeletePhotosId,
  reducerReportStatus,
} from "../../../redux/reducer/userSingleReport/reducers/userSingleReport";
import { calculateProgress } from "../../../utils/calculateUploadingProgress";
import { formatDateTime, formatDate } from "../../../utils/formatDate";
import { generateStyles } from "../../../utils/generateToastStyles";
import { createItemsArray } from "../../../utils/createPhotoArray";
import { getLabelByValue } from "../../../utils/getLabelByValue";
import { AppDispatch } from "../../../redux/reducer/store";

import ClientReportCheckTableSection from "./adminSections/ClientReportCheckTableSection";
import SkuActionsTableSection from "./adminSections/ReportSkuActionsTableSection";
import ReportCheckTableSection from "./adminSections/ReportCheckTableSection";
import AdminPhotosTableSection from "./adminSections/AdminPhotosTableSection";
import ActionTableSection from "./adminSections/ReportActionsTableSection";
import SkuCvTableSection from "./adminSections/ReportSkuCvTableSection";
import AdminHistorySection from "./adminSections/AdminHistorySection";
import SkusTableSection from "./adminSections/ReportSkusTableSection";
import CvTableSection from "./adminSections/ReportCvTableSection";
import ToastPopup from "../../custom/toastPopup/toastPopup";
import EditPopup from "../../custom/editPopup/editPopup";
import YandexMap from "../../custom/yandexMap/yandexMap";
import Switcher from "../../custom/switcher/switcher";

import FileClose from "../../../assets/icons/fileClose.svg";

import "../../../scss/photoviewer.scss";
import "../table.scss";

const statusOptions = [
  { value: "NotChecked", label: "Не проверен" },
  { value: "Rejected", label: "Отклонен" },
  { value: "Cancelled", label: "Отменен" },
  { value: "Approved", label: "Принят" },
];

const requestStatusOptions = [
  {
    status: 200,
    purpose: "deletePhotos",
    successMessage: "Выбранные фотографии успешно удалены!",
  },
  {
    status: 0,
    purpose: "deletePhotos",
    errorMessage: "При удалении фотографий произошла ошибка!",
  },
  {
    status: 200,
    purpose: "copy",
    successMessage: "Отчет успешно скопирован!",
  },
  {
    status: 0,
    purpose: "copy",
    errorMessage: "При копировании отчета произошла ошибка!",
  },
  {
    status: 200,
    purpose: "addPhotos",
    successMessage: "Фотографии успешно добавлены!",
  },
  {
    status: 0,
    purpose: "addPhotos",
    errorMessage: "При добавлении фотографий произошла ошибка!",
  },
  {
    status: 0,
    purpose: "declineRateStatus",
    errorMessage: "При изменении статуса произошла ошибка!",
  },
];

const IS_VISIBLE_SIDEBAR = process.env.REACT_APP_IS_VISIBLE_SIDEBAR;

const TableAdminSingleReport: FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { id } = useParams<{ id: string }>();

  const { isOpenSidebar } = useSelector((state: any) => state.user.user);
  const {
    initialAdminReportOptions,
    filteredReviewHistory,
    filteredRateHistory,
    sortedNearReports,
    reorderedOptions,
    requestPurpose,
    adminSettings,
    techCardData,
    beforeMedias,
    afterMedias,
    allHistory,
    status,
    report,
    files,
  } = useSelector((state: any) => state.userSingleReport.userSingleReport);

  const [openRevisionDatePopupIndex, setOpenRevisionDatePopupIndex] =
    useState<number>(-1);
  const [currentReviewHistoryPage, setCurrentReviewHistoryPage] =
    useState<number>(1);
  const [currentRateHistoryPage, setCurrentRateHistoryPage] =
    useState<number>(1);
  const [openRevisionPopupIndex, setOpenRevisionPopupIndex] =
    useState<number>(-1);
  const [isOpenEditComment, setIsOpenEditComment] = useState<boolean>(false);
  const [openDatePopupIndex, setOpenDatePopupIndex] = useState<number>(-1);
  const [currentHistoryPage, setCurrentHistoryPage] = useState<number>(1);
  const [isRevisionPhoto, setIsRevisionPhoto] = useState<boolean>(false);
  const [selectedPlanogram, setSelectedPlanogram] = useState<any>(null);
  const [selectedSkusPhoto, setSelectedSkusPhoto] = useState(null);
  const [newCommentValue, setNewCommentValue] = useState<string>("");
  const [uploadProgress, setUploadProgress] = useState<number[]>([]);
  const [openPopupIndex, setOpenPopupIndex] = useState<number>(-1);
  const [selectedPhoto, setSelectedPhoto] = useState<any>(null);
  const [selectedFiles, setSelectedFiles] = useState<any>([]);

  const photoViewerInstance = document.querySelector(".photoviewer-modal");
  const previousReportIdRef = useRef<string | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    dispatch(actionGetSingleReportSettings("adminReport"));
    dispatch(actionGetUserSingleReport(id as string));
    dispatch(reducerDeletePhotosId([]));
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

        if (initialAdminReportOptions && reorderedOptions) {
          const optionsToDelete =
            reorderedOptions &&
            reorderedOptions.filter(
              (option: any) =>
                initialAdminReportOptions &&
                !initialAdminReportOptions.some(
                  (elem: any) => option.value === elem.value
                )
            );

          const optionsToAdd =
            initialAdminReportOptions &&
            initialAdminReportOptions.filter(
              (option: any) =>
                reorderedOptions &&
                !reorderedOptions.some(
                  (elem: any) => option.value === elem.value
                )
            );

          const updatedOptions = reorderedOptions &&
            initialAdminReportOptions && [
              ...(reorderedOptions || initialAdminReportOptions)?.filter(
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
    }
  }, [dispatch, initialAdminReportOptions, reorderedOptions, report]);

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
    const uploadRequests: XMLHttpRequest[] = [];

    selectedFiles.forEach((file: File, index: number) => {
      const formData = new FormData();
      formData.append("file", file);

      const xhr = new XMLHttpRequest();
      xhr.upload.addEventListener("progress", (event) => {
        if (event.lengthComputable) {
          calculateProgress(
            setUploadProgress,
            index,
            event.loaded,
            event.total
          );
        }
      });

      xhr.addEventListener("load", () => {
        calculateProgress(setUploadProgress, index, file.size, file.size);
      });

      xhr.open("POST", "/upload-endpoint");
      xhr.send(formData);
      uploadRequests.push(xhr);
    });

    return () => {
      uploadRequests.forEach((xhr) => xhr.abort());
    };
  }, [selectedFiles]);

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
    selectedSkusPhoto,
    selectedPlanogram,
    selectedPhoto,
    report,
  ]);

  useEffect(() => {
    document.addEventListener("mousedown", handleDocumentClick);

    return () => {
      document.removeEventListener("mousedown", handleDocumentClick);
    };
  }, []);

  const handleClickAcceptEditComment = () => {
    dispatch(
      actionUpdateReportNotes({
        reportId: report && report.reportId.id,
        data: {
          note: newCommentValue || (report && report.notes),
        },
      })
    );

    setIsOpenEditComment(false);
  };

  const handleAcceptEditOnKeyPress = (event: any, purpose: string) => {
    if (event.key === "Enter") {
      if (purpose === "reportNotes") {
        handleClickAcceptEditComment();
      }
    }
  };

  const handleDocumentClick = (event: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      setOpenRevisionDatePopupIndex(-1);
      setOpenRevisionPopupIndex(-1);
      setIsOpenEditComment(false);
      setOpenDatePopupIndex(-1);
      setOpenPopupIndex(-1);
    }
  };

  const handleClickDeleteFileBtn = (id: any) => {
    dispatch(
      actionDeleteReportPhotos({
        reportId: report && report.reportId.id,
        medias: [[{ id: id }]],
      })
    );
  };

  const handleFileChange = (event: any) => {
    const files = event.target.files;
    setSelectedFiles([...selectedFiles, ...files]);
  };

  const handleClickDownloadNewPhotosBtn = () => {
    if (selectedFiles.length) {
      dispatch(
        actionDownloadNewPhotos({
          reportId: report && report.reportId.id,
          revision: isRevisionPhoto,
          files: selectedFiles,
        })
      );
    }

    setSelectedFiles([]);
    const fileInput = document.getElementById("file") as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const scrollModal = () => {
    if (modalRef.current) {
      modalRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  };

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
        {report && report.trainee && (
          <div className="report__trainee_block">
            <span>Отчет сдан стажером..</span>
          </div>
        )}
        {(reorderedOptions || initialAdminReportOptions)?.map(
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
                    <span>Проект</span>
                    <span>{report && report.project}</span>
                  </div>
                  <div className="customer__info_row">
                    <span>Контракт</span>
                    <span>{report && report.contract.name}</span>
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
                  <div className="customer__info_row">
                    <span>Дата</span>
                    <span>{report && formatDate(report.expected)}</span>
                  </div>
                  <div className="customer__info_row">
                    <span>Получен</span>
                    <span>
                      {report && report.reported
                        ? report && formatDateTime(report?.reported)
                        : ""}
                    </span>
                  </div>
                  {report && report.techInfo && (
                    <div className="customer__info_row">
                      <span>Тех. информация</span>
                      <div className="disabled__info_block">
                        <pre>{report && report.techInfo}</pre>
                      </div>
                    </div>
                  )}
                  {report && report.createdBy && (
                    <div className="customer__info_row">
                      <span>Отчет создан</span>
                      <span>
                        {report && report?.createdBy?.familyName}{" "}
                        {report && report?.createdBy?.givenName}{" "}
                        {report && report?.createdBy?.middleName} (
                        {report && report?.createdBy?.login})
                      </span>
                    </div>
                  )}
                  {adminSettings.includes("easymerch") &&
                    report &&
                    report?.emReport && (
                      <div className="report__info__borderBlock">
                        <span className="section__title">Easy Merch</span>
                        <div className="border__block_section">
                          <div className="border__block_elem">
                            <span>Визит:</span>
                            <span>
                              <a
                                href={`https://rusagro.easymerch.ru/reports/?mode=view&id=${
                                  report && report?.emReport?.visitId
                                }`}
                                className="file__link"
                                rel="noreferrer"
                                target="_blank"
                              >
                                {report && report?.emReport?.visitId}
                              </a>
                            </span>
                          </div>
                          <div className="border__block_elem">
                            <span>Пользователь:</span>
                            <span>{report && report?.emReport?.userId}</span>
                          </div>
                          <div className="border__block_elem">
                            <span>Физ. лицо:</span>
                            <span>{report && report?.emReport?.personId}</span>
                          </div>
                          <div className="border__block_elem">
                            <span>Логин:</span>
                            <span>{report && report?.emReport?.login}</span>
                          </div>
                          <div className="border__block_elem">
                            <span>Статус:</span>
                            <span>
                              {report &&
                                getLabelByValue(
                                  report?.emReport?.status,
                                  statusOptions
                                )}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  <div className="report__info__borderBlock">
                    <span className="section__title">
                      Время заполнения отчета
                    </span>
                    <div className="border__block_section">
                      <div className="border__block_elem">
                        <span>Начал:</span>
                        <span>
                          {report && report.startTime
                            ? report && formatDateTime(report?.startTime)
                            : ""}
                        </span>
                      </div>
                      <div className="border__block_elem">
                        <span>Завершил:</span>
                        <span>
                          {report && report.endTime
                            ? report && formatDateTime(report?.endTime)
                            : ""}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="report__info__borderBlock">
                    <span className="section__title">Финансы</span>
                    <div className="border__block_section">
                      <div className="border__block_elem">
                        <span>Стоимость план.:</span>
                        <span>{report && report.costs.costPlan} руб.</span>
                      </div>
                      <div className="border__block_elem">
                        <span>Стоимость факт.:</span>
                        <span>
                          {report && report.costs.costFact} руб. (
                          {report && report.costs.costPercent}%)
                        </span>
                      </div>
                      <div className="border__block_elem">
                        <span>Себестоимость план.:</span>
                        <span>{report && report.costs.selfCostPlan} руб.</span>
                      </div>
                      <div className="border__block_elem">
                        <span>Себестоимость факт.:</span>
                        <span>
                          {report && report.costs.selfCostFact} руб. (
                          {report && report.costs.selfCostPercent}%)
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="report__info__borderBlock">
                    <div className="border__block_section">
                      <div className="border__block_elem">
                        <span>Статус</span>
                        <span
                          className={
                            report &&
                            Object.keys(report.deliveryStatus).toString() ===
                              "OnTime"
                              ? "greenText"
                              : report &&
                                Object.keys(
                                  report.deliveryStatus
                                ).toString() === "Expired"
                              ? "yellowText"
                              : "redText"
                          }
                        >
                          {report && Object.values(report.deliveryStatus)}
                        </span>
                      </div>
                      <div className="border__block_elem">
                        <span>ФИО сотрудника ТТ</span>
                        <span>{report && report.contactPerson}</span>
                      </div>
                      <div className="border__block_elem">
                        <span>Комментарий</span>
                        <div className="edited__comment_block">
                          <div
                            className="edited__coment_value"
                            onClick={() => {
                              setIsOpenEditComment(!isOpenEditComment);
                              setTimeout(scrollModal, 0);
                            }}
                          >
                            {(report && report.notes) || ""}
                          </div>
                          {isOpenEditComment && (
                            <EditPopup
                              handleClickAcceptRenameBtn={() => {
                                handleClickAcceptEditComment();
                              }}
                              handleAcceptOnKeyPress={(event: any) =>
                                handleAcceptEditOnKeyPress(event, "reportNotes")
                              }
                              handleClickCancelRenameBtn={() => {
                                setIsOpenEditComment(false);
                              }}
                              handleChangeValue={(event: any) => {
                                setNewCommentValue(event?.target.value);
                              }}
                              defaultValue={
                                newCommentValue || (report && report.notes)
                              }
                              className="edit__comment_popup"
                              modalRef={modalRef}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="report__info__borderBlock">
                    <div className="border__block_section">
                      <div className="border__block_elem">
                        <span>
                          Процент изменений по сравнению с предыдущим отчетом
                        </span>
                        <span>0%</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            }

            if (elem.value === "geo") {
              return (
                <Fragment key={index}>
                  {report &&
                    report?.pos?.longitude &&
                    report?.pos?.latitude &&
                    adminSettings.includes("geo") &&
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
                  {adminSettings.includes("photos") && (
                    <div className="add__photo_wrapper">
                      <div className="add__photo_block">
                        <div className="add__photo_elem">
                          <span>Добавьте фотографии:</span>
                        </div>
                        <div className="add__photo_elem">
                          <input
                            className="download__file_input"
                            onChange={handleFileChange}
                            placeholder="Загрузить"
                            type="file"
                            name="file"
                            id="file"
                          />
                          <label htmlFor="file" className="file__label">
                            Загрузить
                          </label>
                          <div className="file__list">
                            {selectedFiles.map((file: File, index: number) => {
                              const fileSize = (
                                file.size /
                                (1024 * 1024)
                              ).toFixed(2);
                              const progress = uploadProgress[index] || 0;

                              return (
                                <div key={index} className="file__list_elem">
                                  <div className="file__list_dot"></div>
                                  <span className="file__name">
                                    {file.name}
                                  </span>
                                  <span>
                                    {progress.toFixed(0)}% от {fileSize} MB
                                  </span>
                                  <span
                                    onClick={() => {
                                      setSelectedFiles(
                                        selectedFiles.filter(
                                          (elem: any) => elem.name !== file.name
                                        )
                                      );
                                      const fileInput = document.getElementById(
                                        "file"
                                      ) as HTMLInputElement;
                                      if (fileInput) {
                                        fileInput.value = "";
                                      }
                                    }}
                                    className="cancel__file_btn"
                                  >
                                    Отменить
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                          <button
                            onClick={handleClickDownloadNewPhotosBtn}
                            className="download__btn"
                          >
                            Добавить
                          </button>
                        </div>
                        <div className="switcher__block">
                          <Switcher
                            checked={isRevisionPhoto}
                            onChange={() => {
                              setIsRevisionPhoto(!isRevisionPhoto);
                            }}
                          />
                          <span
                            className={
                              isRevisionPhoto
                                ? "active__switcher_title"
                                : "switcher__title"
                            }
                          >
                            Загрузить в блок "Доработка"
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                  {adminSettings.includes("photos") && (
                    <>
                      {!!beforeMedias?.length && (
                        <AdminPhotosTableSection
                          setOpenDatePopupIndex={setOpenDatePopupIndex}
                          previousReportIdRef={previousReportIdRef}
                          openDatePopupIndex={openDatePopupIndex}
                          setOpenPopupIndex={setOpenPopupIndex}
                          setSelectedPhoto={setSelectedPhoto}
                          openPopupIndex={openPopupIndex}
                          title="Фото при создании отчета"
                          scrollModal={scrollModal}
                          datePurpose="dateBefore"
                          medias={beforeMedias}
                          namePurpose="before"
                          modalRef={modalRef}
                        />
                      )}
                      {!!afterMedias?.length && (
                        <AdminPhotosTableSection
                          setOpenDatePopupIndex={setOpenRevisionDatePopupIndex}
                          openDatePopupIndex={openRevisionDatePopupIndex}
                          setOpenPopupIndex={setOpenRevisionPopupIndex}
                          previousReportIdRef={previousReportIdRef}
                          openPopupIndex={openRevisionPopupIndex}
                          setSelectedPhoto={setSelectedPhoto}
                          title="Фото после доработки отчета"
                          scrollModal={scrollModal}
                          datePurpose="dateAfter"
                          medias={afterMedias}
                          namePurpose="after"
                          modalRef={modalRef}
                        />
                      )}
                    </>
                  )}
                </Fragment>
              );
            }

            if (elem.value === "files") {
              return (
                <Fragment key={index}>
                  {report &&
                    !!files?.length &&
                    adminSettings.includes("files") && (
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
                                <img
                                  onClick={() =>
                                    handleClickDeleteFileBtn(elem.media.id)
                                  }
                                  className="file__close_icon"
                                  src={FileClose}
                                  alt="close"
                                />
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
                    adminSettings.includes("planogramms") && (
                      <>
                        <span className="section__title">Планограммы</span>
                        <div className="planogramms__table">
                          {report &&
                            report?.planograms?.map(
                              (elem: any, index: number) => (
                                <img
                                  src={elem?.url?.thumb}
                                  onClick={() =>
                                    setSelectedPlanogram(elem?.url?.link)
                                  }
                                  className="planogram__photo"
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
                  {report &&
                    !!report?.cv?.length &&
                    adminSettings.includes("cv") && <CvTableSection />}
                </Fragment>
              );
            }

            if (elem.value === "skus") {
              return (
                <Fragment key={index}>
                  {report &&
                    !!report?.skus?.length &&
                    adminSettings.includes("skus") && (
                      <SkusTableSection
                        setSelectedSkusPhoto={setSelectedSkusPhoto}
                        previousReportIdRef={previousReportIdRef}
                      />
                    )}
                </Fragment>
              );
            }

            if (elem.value === "skuCv") {
              return (
                <Fragment key={index}>
                  {report &&
                    !!report?.skuCv?.length &&
                    adminSettings.includes("skuCv") && <SkuCvTableSection />}
                </Fragment>
              );
            }

            if (elem.value === "actionsTT") {
              return (
                <Fragment key={index}>
                  {report &&
                    !!report?.actions?.length &&
                    adminSettings.includes("actionsTT") && (
                      <ActionTableSection />
                    )}
                </Fragment>
              );
            }

            if (elem.value === "actions") {
              return (
                <Fragment key={index}>
                  {report &&
                    !!report?.skuActions?.length &&
                    adminSettings.includes("actions") && (
                      <SkuActionsTableSection />
                    )}
                </Fragment>
              );
            }

            if (elem.value === "review") {
              return (
                <Fragment key={index}>
                  {adminSettings.includes("review") && (
                    <div className="check__block">
                      <ReportCheckTableSection />
                    </div>
                  )}
                </Fragment>
              );
            }

            if (elem.value === "rate") {
              return (
                <Fragment key={index}>
                  {adminSettings.includes("rate") && (
                    <div className="check__block">
                      <ClientReportCheckTableSection />
                    </div>
                  )}
                </Fragment>
              );
            }

            if (elem.value === "history") {
              return (
                <Fragment key={index}>
                  {report &&
                    !!filteredReviewHistory?.length &&
                    adminSettings.includes("history") && (
                      <AdminHistorySection
                        setCurrentHistoryPage={setCurrentReviewHistoryPage}
                        currentHistoryPage={currentReviewHistoryPage}
                        filteredHistory={filteredReviewHistory}
                        title="Изменения по проверке"
                      />
                    )}
                  {report &&
                    !!filteredRateHistory?.length &&
                    adminSettings.includes("history") && (
                      <AdminHistorySection
                        setCurrentHistoryPage={setCurrentRateHistoryPage}
                        currentHistoryPage={currentRateHistoryPage}
                        filteredHistory={filteredRateHistory}
                        title="Изменения по оценке"
                      />
                    )}
                  {report &&
                    !!allHistory?.length &&
                    adminSettings.includes("history") && (
                      <AdminHistorySection
                        setCurrentHistoryPage={setCurrentHistoryPage}
                        currentHistoryPage={currentHistoryPage}
                        title="Все изменения по отчету"
                        filteredHistory={allHistory}
                      />
                    )}
                </Fragment>
              );
            }

            if (elem.value === "techCard") {
              return (
                <Fragment key={index}>
                  {adminSettings.includes("techCard") && (
                    <>
                      <span className="section__title">
                        Технологическая карта ТТ
                      </span>
                      <table className="tt__card_table">
                        <thead className="tunder__thead">
                          <tr>
                            <th>Вопрос</th>
                            <th>Значение</th>
                          </tr>
                        </thead>
                        <tbody>
                          {techCardData &&
                            techCardData.map((elem: any, index: number) => (
                              <tr key={index}>
                                <td>{elem.question.name}</td>
                                <td>{elem.value}</td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </>
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

export default TableAdminSingleReport;
