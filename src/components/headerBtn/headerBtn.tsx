import { FC, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import moment from "moment";

import {
  actionUnloadReportsConsolidated,
  actionUnloadCustomerReportsData,
  actionUnloadReportsWithLinks,
  actionUnloadCustomerReports,
  actionUpdateDeliveryStatus,
  actionExportAverageFacing,
  actionUnloadReportsPhotos,
  actionUnloadClientReport,
  actionUnloadReportsList,
  actionUnloadHotline,
  actionShareOfShelf,
  actionCopyReports,
  actionCreateGeo,
  actionExportOsa,
} from "../../redux/action/userReports/actionUserReports";
import {
  actionSetSingleReportSettings,
  actionClientRequestReport,
  actionCancelReportReview,
  actionDeleteReportPhotos,
  actionClientAcceptReport,
  actionCancelReportClaim,
  actionRevisionReport,
  actionApproveReport,
  actionRejectReport,
  actionDeleteReport,
  actionDeclineRate,
  actionAcceptRate,
  actionCopyReport,
} from "../../redux/action/userSingleReport/actionUserSingleReport";
import {
  actionCreateExpiredReports,
  actionDeleteExpiredReports,
  actionExportExpiredReports,
} from "../../redux/action/userReports/actionExpiredReports";
import {
  reducerSelectedUpdateStatus,
  reducerAdminReportsSettings,
  reducerSelectedReports,
  reducerReportsSettings,
  reducerReportsStatus,
  reducerHeaderBtn,
} from "../../redux/reducer/userReports/reducers/userReports";
import {
  reducerSelectedAdminReportSettings,
  reducerSingleReportSettingsOptions,
  reducerSelectedReportSettings,
  reducerDeletePhotosId,
} from "../../redux/reducer/userSingleReport/reducers/userSingleReport";
import { reducerVisitScheduleHistory } from "../../redux/reducer/userSingleReport/reducers/visitSchedule";
import { reducerExpiredReportsSettings } from "../../redux/reducer/userReports/reducers/expiredReports";
import { actionUnloadScheduleInExcel } from "../../redux/action/userSingleReport/actionVisitSchedule";
import { actionUnloadIntegrationErrors } from "../../redux/action/easymerch/actionIntegrationErrors";
import { actionSendRoutesToEasyMerch } from "../../redux/action/easymerch/actionUsers";
import { actionUnloadOutlets } from "../../redux/action/easymerch/actionOutlets";
import { actionImportPos } from "../../redux/action/tunder/actionRetailOutlets";
import { AppDispatch } from "../../redux/reducer/store";

import AdminSingleReportSettingsSection from "./sections/adminSingleReportSettingsSection";
import CustomerReportsSettingsSection from "./sections/customerReportsSettingsSection";
import ExpiredReportsSettingsSection from "./sections/expiredReportsSettingsSection";
import UpdateDeliveryStatusSection from "./sections/updateDeliveryStatusSections";
import AdminReportsSettingsSection from "./sections/adminReportsSettingsSection";
import SingleReportSettingsSection from "./sections/singleReportSettingsSection";
import ScheduleAddressInfoSection from "./sections/scheduleAddressInfoSection";
import UnloadReportsPhotoSection from "./sections/unloadReportsPhotoSection";
import UpdateReviewStatusSection from "./sections/updateReviewStatusSection";
import UpdateRateStatusSection from "./sections/updateRateStatusSection";
import OutletsDownloadSection from "./sections/outletsDownloadSection";
import DeletePhotosSection from "./sections/deletePhotosSection";
import DeleteReportSection from "./sections/deleteReportSection";
import ReportCheckSection from "./sections/reportCheckSection";
import CopyReportSection from "./sections/copyReportSection";
import CreateGeoSection from "./sections/createGeoSection";
import LimitSection from "./sections/limitSection";
import Blackout from "../custom/blackout/blackout";

import Close from "../../assets/icons/close.svg";

import styles from "./headerBtn.module.scss";

interface IHeaderBtnProps {
  modalTitle: string;
  content: string;
  purpose: string;
}

const unloadActions: any = {
  unloadReportsConsolidated: actionUnloadReportsConsolidated,
  unloadCustomerReportsData: actionUnloadCustomerReportsData,
  unloadReportsWithLinks: actionUnloadReportsWithLinks,
  unloadCustomerReports: actionUnloadCustomerReports,
  unloadReportsPhotos: actionUnloadReportsPhotos,
  unloadExpiredList: actionExportExpiredReports,
  unloadClientReport: actionUnloadClientReport,
  unloadReportsList: actionUnloadReportsList,
  averageFacing: actionExportAverageFacing,
  unloadHotline: actionUnloadHotline,
  shelfShare: actionShareOfShelf,
  osa: actionExportOsa,
};

const copyActions: any = {
  copyReport: actionCopyReport,
  copyReports: actionCopyReports,
};

const HeaderBtn: FC<IHeaderBtnProps> = ({ content, purpose, modalTitle }) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const {
    adminReportsSettings,
    reportsInputValues,
    selectedReportsId,
    actualModalTitle,
    reportsSettings,
    actualPurpose,
    reports,
  } = useSelector((state: any) => state.userReports.userReports);
  const { selectedUsers } = useSelector((state: any) => state.easymerch.users);
  const { data } = useSelector((state: any) => state.user.user);
  const { report, photos, settings, adminSettings } = useSelector(
    (state: any) => state.userSingleReport.userSingleReport
  );
  const { limit, offset, outletsInputValues } = useSelector(
    (state: any) => state.easymerch.outlets
  );
  const { reportsId, expiredReportsSettings } = useSelector(
    (state: any) => state.userReports.expiredReports
  );
  const { isOpenHistory } = useSelector(
    (state: any) => state.userSingleReport.visitSchedule
  );

  const [selectedActionOption, setSelectedActionOption] =
    useState<string>("acceptReport");
  const [selectedCheckTypeOption, setSelectedCheckTypeOption] =
    useState<string>("DISTANCE");
  const [selectedDeliveryOption, setSelectedDeliveryOption] =
    useState<string>("OnTime");
  const [selectedRateStatusOption, setSelectedRateStatusOption] =
    useState<string>("NotChecked");
  const [selectedReviewStatusOption, setSelectedReviewStatusOption] =
    useState<string>("NotChecked");
  const [selectedReviewReasonId, setSelectedReviewReasonId] =
    useState<any>(null);
  const [reportCheckCommentValue, setReportCheckCommentValue] =
    useState<string>("");
  const [selectedReportCheckReasons, setSelectedReportCheckReasons] = useState<
    any[]
  >([]);
  const [selectedReportsSettings, setSelectedReportsSettings] = useState<any>(
    data?.isCustomer ? reportsSettings : adminReportsSettings
  );
  const [selectedExpiredReportsSettings, setSelectedExpiredReportsSettings] =
    useState<any>(expiredReportsSettings);
  const [isCheckedFullInfo, setIsCheckedFullInfo] = useState<boolean>(
    (data?.isCustomer
      ? JSON.parse(localStorage.getItem("isSelectedAllTabs") as string)
      : JSON.parse(localStorage.getItem("isSelectedAllAdminTabs") as string)) ||
      false
  );
  const [isCheckedAllSettings, setIsCheckedAllSettings] = useState<boolean>(
    (data?.isCustomer
      ? JSON.parse(localStorage.getItem("isSelectedAllSettings") as string)
      : JSON.parse(
          localStorage.getItem("isSelectedAllAdminSettings") as string
        )) || false
  );
  const [isCheckedAllExpiredSettings, setIsCheckedAllExpiredSettings] =
    useState<boolean>(
      JSON.parse(
        localStorage.getItem("isSelectedAllExpiredSettings") as string
      ) || false
    );
  const [selectedReportTabs, setSelectedReportTabs] = useState<any>(
    data?.isCustomer ? settings : adminSettings
  );
  const [selectedCustomServices, setSelectedCustomServices] = useState<any>([]);
  const [reorderedReportOptions, setReorderedReportOptions] = useState<any>([]);
  const [reviewReasonError, setReviewReasonError] = useState<string>("");
  const [reportCheckError, setReportCheckError] = useState<string>("");
  const [selectedActions, setSelectedActions] = useState<any>([]);
  const [selectedFiles, setSelectedFiles] = useState<any>([]);
  const [reportLimit, setReportLimit] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [open, setOpen] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const settingsActions: any = {
    singleReportSettings: {
      reducer: reducerSelectedReportSettings,
      selectedTabsKey: "selectedTabs",
      selectedTabs: selectedReportTabs,
      allTabsKey: "isSelectedAllTabs",
      allTabs: isCheckedFullInfo,
      reorderAction: () => {
        dispatch(
          actionSetSingleReportSettings(
            "customerReport",
            reorderedReportOptions
          )
        );
        dispatch(
          reducerSingleReportSettingsOptions({ entity: reorderedReportOptions })
        );
      },
    },
    adminSingleReportSettings: {
      reducer: reducerSelectedAdminReportSettings,
      selectedTabsKey: "selectedTabs",
      selectedTabs: selectedReportTabs,
      allTabsKey: "isSelectedAllAdminTabs",
      allTabs: isCheckedFullInfo,
      reorderAction: () => {
        dispatch(
          actionSetSingleReportSettings("adminReport", reorderedReportOptions)
        );
        dispatch(
          reducerSingleReportSettingsOptions({ entity: reorderedReportOptions })
        );
      },
    },
    customerReportsSettings: {
      reducer: reducerReportsSettings,
      selectedTabsKey: "selectedReportsTabs",
      selectedTabs: selectedReportsSettings,
      allTabsKey: "isSelectedAllSettings",
      allTabs: isCheckedAllSettings,
    },
    adminReportsSettings: {
      reducer: reducerAdminReportsSettings,
      selectedTabsKey: "selectedAdminReportsTabs",
      selectedTabs: selectedReportsSettings,
      allTabsKey: "isSelectedAllAdminSettings",
      allTabs: isCheckedAllSettings,
    },
    expiredReportsSettings: {
      reducer: reducerExpiredReportsSettings,
      selectedTabsKey: "selectedExpiredReportsTabs",
      selectedTabs: selectedExpiredReportsSettings,
      allTabsKey: "isSelectedAllExpiredSettings",
      allTabs: isCheckedAllExpiredSettings,
    },
  };

  const closeActions: any = {
    reportCheck: () => {
      setSelectedActionOption("acceptReport");
      setSelectedCheckTypeOption("DISTANCE");
      setSelectedReportCheckReasons([]);
      setReportCheckCommentValue("");
    },
    updateDeliveryStatus: () => {
      setSelectedDeliveryOption("OnTime");
    },
    updateRateStatus: () => {
      setSelectedRateStatusOption("NotChecked");
    },
    updateReviewStatus: () => {
      setSelectedReviewStatusOption("NotChecked");
      setSelectedReviewReasonId(null);
      setReviewReasonError("");
    },
    customerReportsSettings: () => {
      setSelectedReportsSettings(reportsSettings);
      setIsCheckedAllSettings(
        JSON.parse(localStorage.getItem("isSelectedAllSettings") as string) ||
          false
      );
    },
    adminReportsSettings: () => {
      setSelectedReportsSettings(adminReportsSettings);
      setIsCheckedAllSettings(
        JSON.parse(
          localStorage.getItem("isSelectedAllAdminSettings") as string
        ) || false
      );
    },
    expiredReportsSettings: () => {
      setSelectedExpiredReportsSettings(expiredReportsSettings);
      setIsCheckedAllExpiredSettings(
        JSON.parse(
          localStorage.getItem("isSelectedAllExpiredSettings") as string
        ) || false
      );
    },
    singleReportSettings: () => {
      setSelectedReportTabs(settings);
      setIsCheckedFullInfo(
        JSON.parse(localStorage.getItem("isSelectedAllTabs") as string) || false
      );
    },
    adminSingleReportSettings: () => {
      setSelectedReportTabs(adminSettings);
      setIsCheckedFullInfo(
        JSON.parse(localStorage.getItem("isSelectedAllAdminTabs") as string) ||
          false
      );
    },
  };

  const handleClickApplyBtn = () => {
    if (actualPurpose === "outletsDownload") {
      selectedFiles.length &&
        dispatch(actionImportPos(selectedFiles)).then(() => {
          setSelectedFiles([]);
        });
    }

    if (settingsActions.hasOwnProperty(actualPurpose)) {
      const {
        selectedTabsKey,
        reorderAction,
        selectedTabs,
        allTabsKey,
        reducer,
        allTabs,
      } = settingsActions[actualPurpose];

      localStorage.setItem(allTabsKey, JSON.stringify(allTabs ? true : false));
      localStorage.setItem(selectedTabsKey, JSON.stringify(selectedTabs));

      reorderAction && reorderAction();
      dispatch(reducer(selectedTabs));
    }

    if (actualPurpose === "errorsUnload") {
      dispatch(actionUnloadIntegrationErrors(0));
    }

    if (actualPurpose === "outletsUnload") {
      dispatch(actionUnloadOutlets(limit, offset, outletsInputValues));
    }

    if (copyActions.hasOwnProperty(actualPurpose)) {
      const action = copyActions[actualPurpose];

      dispatch(
        action({
          reports:
            actualPurpose === "copyReport"
              ? [
                  {
                    id: report && report.reportId.id,
                  },
                ]
              : selectedReportsId,
          date: !selectedDate
            ? moment(new Date()).format("YYYY-MM-DD")
            : moment(selectedDate).format("YYYY-MM-DD"),
        })
      );
    }

    if (actualPurpose === "updateDeliveryStatus") {
      dispatch(
        actionUpdateDeliveryStatus({
          reports: selectedReportsId.map((report: any) => {
            return {
              id: report.id,
              name: "",
            };
          }),
          deliveryStatus: selectedDeliveryOption,
        })
      );
      dispatch(reducerSelectedUpdateStatus(selectedDeliveryOption));
      setSelectedDeliveryOption("OnTime");
    }

    if (actualPurpose === "deletePhotos") {
      if (photos && photos.length) {
        dispatch(
          actionDeleteReportPhotos({
            reportId: report && report.reportId.id,
            medias: [
              photos.map((photoId: number) => {
                return {
                  id: photoId,
                };
              }),
            ],
          })
        );
        dispatch(reducerDeletePhotosId([]));
      }
    }

    if (actualPurpose === "deleteExpired") {
      dispatch(actionDeleteExpiredReports(reportsId));
    }

    if (actualPurpose === "deleteReport") {
      dispatch(actionDeleteReport(report && report.reportId.id)).then(() => {
        navigate("/reports");
      });
    }

    if (actualPurpose === "createGeo") {
      if (!!selectedReportsId.length) {
        selectedReportsId.forEach((reportId: any, index: any) => {
          const isLastRequest = index === selectedReportsId.length - 1;

          try {
            dispatch(actionCreateGeo(reportId.id)).then(() => {
              if (isLastRequest) {
                dispatch(
                  reducerReportsStatus({
                    reportsStatus: 200,
                    reportsRequestPurpose: "createGeo",
                  })
                );
              }
            });
          } catch (err) {
            dispatch(
              reducerReportsStatus({
                reportsStatus: 0,
                reportsRequestPurpose: "createGeo",
              })
            );
          }
        });
      }
    }

    if (actualPurpose === "updateRateStatus") {
      if (
        !!selectedReportsId.length &&
        selectedRateStatusOption === "NotChecked"
      ) {
        const filteredSelectedReports = selectedReportsId.filter(
          (elem: any) =>
            reports.find((report: any) => report.reportId === elem.id)
              .rateStatus !== "NotChecked"
        );

        if (!!filteredSelectedReports.length) {
          filteredSelectedReports.forEach((reportId: any, index: any) => {
            const isLastRequest = index === filteredSelectedReports.length - 1;

            dispatch(
              actionCancelReportClaim({
                reportId: {
                  id: reportId.id,
                  name: "",
                },
              })
            ).then(() => {
              if (isLastRequest) {
                dispatch(
                  reducerReportsStatus({
                    reportsStatus: 200,
                    reportsRequestPurpose: "updateRateStatus",
                  })
                );
              }
            });
          });
        } else {
          dispatch(
            reducerReportsStatus({
              reportsStatus: 0,
              reportsRequestPurpose: "updateRateStatus",
            })
          );
          dispatch(reducerSelectedReports([]));
        }
      } else if (
        !!selectedReportsId.length &&
        selectedRateStatusOption === "Accepted"
      ) {
        const filteredSelectedReports = selectedReportsId.filter(
          (elem: any) =>
            reports.find((report: any) => report.reportId === elem.id)
              .rateStatus !== "Accepted"
        );

        if (!!filteredSelectedReports.length) {
          filteredSelectedReports.forEach((reportId: any, index: any) => {
            const isLastRequest = index === filteredSelectedReports.length - 1;

            dispatch(
              actionClientAcceptReport({
                reportId: {
                  id: reportId.id,
                  name: "",
                },
                rateNote: "",
                weigth: 0,
              })
            ).then(() => {
              if (isLastRequest) {
                dispatch(
                  reducerReportsStatus({
                    reportsStatus: 200,
                    reportsRequestPurpose: "updateRateStatus",
                  })
                );
              }
            });
          });
        } else {
          dispatch(
            reducerReportsStatus({
              reportsStatus: 0,
              reportsRequestPurpose: "updateRateStatus",
            })
          );
          dispatch(reducerSelectedReports([]));
        }
      } else if (
        !!selectedReportsId.length &&
        selectedRateStatusOption === "Declined"
      ) {
        const filteredSelectedReports = selectedReportsId.filter(
          (elem: any) => {
            const actualReport = reports.find(
              (report: any) => report.reportId === elem.id
            ).rateStatus;

            return (
              actualReport !== "Declined" &&
              actualReport !== "PartiallyDeclined"
            );
          }
        );

        if (!!filteredSelectedReports.length) {
          filteredSelectedReports.forEach((reportId: any, index: number) => {
            const isLastRequest = index === filteredSelectedReports.length - 1;

            dispatch(
              actionDeclineRate({
                reportId: {
                  id: reportId.id,
                  name: "",
                },
                rateNote: "",
                weigth: 0,
              })
            ).then(() => {
              if (isLastRequest) {
                dispatch(
                  reducerReportsStatus({
                    reportsStatus: 200,
                    reportsRequestPurpose: "updateRateStatus",
                  })
                );
              }
            });
          });
        } else {
          dispatch(
            reducerReportsStatus({
              reportsStatus: 0,
              reportsRequestPurpose: "updateRateStatus",
            })
          );
          dispatch(reducerSelectedReports([]));
        }
      }

      dispatch(reducerSelectedUpdateStatus(selectedRateStatusOption));
      setSelectedRateStatusOption("NotChecked");
    }

    if (actualPurpose === "updateReviewStatus") {
      if (
        !!selectedReportsId.length &&
        selectedReviewStatusOption === "NotChecked"
      ) {
        const filteredSelectedReports = selectedReportsId.filter(
          (elem: any) =>
            reports.find((report: any) => report.reportId === elem.id)
              .reviewStatus !== "NotChecked"
        );

        if (!!filteredSelectedReports.length) {
          filteredSelectedReports.forEach((reportId: any, index: any) => {
            const isLastRequest = index === filteredSelectedReports.length - 1;

            dispatch(actionCancelReportReview(reportId.id)).then(() => {
              if (isLastRequest) {
                dispatch(
                  reducerReportsStatus({
                    reportsStatus: 200,
                    reportsRequestPurpose: "updateReviewStatus",
                  })
                );
              }
            });
          });
        } else {
          dispatch(
            reducerReportsStatus({
              reportsStatus: 0,
              reportsRequestPurpose: "updateReviewStatus",
            })
          );
          dispatch(reducerSelectedReports([]));
        }
      } else if (
        !!selectedReportsId.length &&
        selectedReviewStatusOption === "Approved"
      ) {
        selectedReportsId.forEach((reportId: any, index: number) => {
          const isLastRequest = index === selectedReportsId.length - 1;

          dispatch(
            actionApproveReport({
              reportId: {
                id: reportId.id,
                name: "",
              },
              reviewComment: "",
              comment: "",
            })
          ).then(() => {
            if (isLastRequest) {
              dispatch(
                reducerReportsStatus({
                  reportsStatus: 200,
                  reportsRequestPurpose: "updateReviewStatus",
                })
              );
            }
          });
        });
      } else if (
        !!selectedReportsId.length &&
        selectedReviewStatusOption === "Rejected"
      ) {
        if (!selectedReviewReasonId) {
          setReviewReasonError("Нужно указать причину прежде, чем продолжить");
          return;
        } else {
          selectedReportsId.forEach((reportId: any, index: any) => {
            const isLastRequest = index === selectedReportsId.length - 1;

            dispatch(
              actionRejectReport({
                reportId: {
                  id: reportId.id,
                  name: "",
                },
                reviewReasonId: {
                  id: selectedReviewReasonId,
                },
                reviewComment: "",
                comment: "",
              })
            ).then(() => {
              if (isLastRequest) {
                dispatch(
                  reducerReportsStatus({
                    reportsStatus: 200,
                    reportsRequestPurpose: "updateReviewStatus",
                  })
                );
              }
            });
          });
        }
      } else if (
        !!selectedReportsId.length &&
        selectedReviewStatusOption === "Revision"
      ) {
        if (!selectedReviewReasonId) {
          setReviewReasonError("Нужно указать причину прежде, чем продолжить");
          return;
        } else {
          const filteredSelectedReports = selectedReportsId.filter(
            (elem: any) =>
              reports.find((report: any) => report.reportId === elem.id)
                .reviewStatus !== "Revision"
          );

          if (!!filteredSelectedReports.length) {
            filteredSelectedReports.forEach((reportId: any, index: number) => {
              const isLastRequest =
                index === filteredSelectedReports.length - 1;

              dispatch(
                actionRevisionReport({
                  reportId: {
                    id: reportId.id,
                    name: "",
                  },
                  reviewReasonId: {
                    id: selectedReviewReasonId,
                  },
                  reviewComment: "",
                  comment: "",
                  customReason: "",
                })
              ).then(() => {
                if (isLastRequest) {
                  dispatch(
                    reducerReportsStatus({
                      reportsStatus: 200,
                      reportsRequestPurpose: "updateReviewStatus",
                    })
                  );
                }
              });
            });
          } else {
            dispatch(
              reducerReportsStatus({
                reportsStatus: 0,
                reportsRequestPurpose: "updateReviewStatus",
              })
            );
            dispatch(reducerSelectedReports([]));
          }
        }
      }

      dispatch(reducerSelectedUpdateStatus(selectedReviewStatusOption));
      setSelectedReviewStatusOption("NotChecked");
      setSelectedReviewReasonId(null);
    }

    if (actualPurpose === "reportCheck") {
      if (selectedActionOption === "acceptReport") {
        dispatch(
          actionAcceptRate(
            {
              reportId: {
                id: report && report?.reportId.id,
              },
              reviewReasons: selectedReportCheckReasons.map((value: any) => {
                return {
                  id: parseFloat(value),
                };
              }),
              notes: reportCheckCommentValue,
              checkType: selectedCheckTypeOption,
            },
            "reportCheckBtn"
          )
        );
      } else if (
        selectedActionOption === "formClaim" ||
        selectedActionOption === "formRecommendation"
      ) {
        if (reportCheckCommentValue === "") {
          setReportCheckError("notes");
          return;
        }

        if (!selectedReportCheckReasons.length) {
          setReportCheckError("reasons");
          return;
        }

        if (reportCheckCommentValue && !!selectedReportCheckReasons.length) {
          dispatch(
            actionClientRequestReport(
              {
                reportId: {
                  id: report && report.reportId.id,
                },
                reviewReasons: selectedReportCheckReasons.map((value: any) => {
                  return {
                    id: parseFloat(value),
                  };
                }),
                notes: reportCheckCommentValue,
                checkType: selectedCheckTypeOption,
                claimType:
                  selectedActionOption === "formClaim"
                    ? "Claim"
                    : "Recommendation",
              },
              selectedFiles,
              "reportCheckBtn"
            )
          );
        }
      }
    }

    if (unloadActions.hasOwnProperty(actualPurpose)) {
      if (reportLimit === "") {
        setError("Вы должны указать значение лимита выгрузки");
        return;
      } else {
        const action = unloadActions[actualPurpose];

        if (actualPurpose === "unloadExpiredList") {
          dispatch(action(parseFloat(reportLimit)));
        } else if (actualPurpose === "unloadReportsPhotos") {
          dispatch(
            action({
              customServices: selectedCustomServices,
              actions: selectedActions,
              reportFilter: {
                ...reportsInputValues,
                limit: parseFloat(reportLimit),
                page: 1,
              },
            })
          );
        } else {
          dispatch(
            action({
              ...reportsInputValues,
              limit: parseFloat(reportLimit),
              page: 1,
            })
          );
        }

        setError("");
      }
    }

    document.body.style.overflow = "auto";
    setOpen(false);
  };

  const handleClickOpenBtn = (purpose: any, modalTitle: any) => {
    const openActions: any = {
      createExpiredReports: () => {
        dispatch(actionCreateExpiredReports(reportsId));
      },
      visitSchedule: () => {
        return;
      },
      showVisitScheduleHistory: () => {
        dispatch(reducerVisitScheduleHistory(!isOpenHistory));
      },
      unloadScheduleExcel: () => {
        dispatch(actionUnloadScheduleInExcel());
      },
      sendRoutesToEasyMerch: () => {
        dispatch(actionSendRoutesToEasyMerch(0, selectedUsers));
      },
      defaultAction: () => {
        dispatch(reducerHeaderBtn({ purpose, title: modalTitle, open: !open }));
        setOpen(!open);
      },
    };

    const action = openActions[purpose] || openActions.defaultAction;
    action();
  };

  const handleClickCloseBtn = () => {
    const action = closeActions[actualPurpose];

    if (action) {
      action();
    }

    document.body.style.overflow = "auto";
    setSelectedFiles([]);
    setOpen(false);
    setError("");
  };

  const handleChangeLimitInput = (event: any) => {
    setReportLimit(event.target.value);
    setError("");
  };

  const handleFileChange = (event: any) => {
    const files = event.target.files;
    setSelectedFiles([...selectedFiles, ...files]);
  };

  const generateLimitSection = () => (
    <LimitSection
      handleChangeLimitInput={handleChangeLimitInput}
      error={error}
    />
  );

  const sectionComponents: any = {
    addressInfo: <ScheduleAddressInfoSection content={content} />,
    unloadReportsConsolidated: generateLimitSection(),
    unloadCustomerReportsData: generateLimitSection(),
    unloadReportsWithLinks: generateLimitSection(),
    unloadCustomerReports: generateLimitSection(),
    unloadClientReport: generateLimitSection(),
    unloadReportsList: generateLimitSection(),
    unloadExpiredList: generateLimitSection(),
    averageFacing: generateLimitSection(),
    unloadHotline: generateLimitSection(),
    shelfShare: generateLimitSection(),
    deletePhotos: <DeletePhotosSection />,
    createGeo: <CreateGeoSection />,
    osa: generateLimitSection(),
    deleteExpired: (
      <DeleteReportSection title="Вы уверены, что хотите удалить выбранные отчеты ?" />
    ),
    deleteReport: (
      <DeleteReportSection title="Вы уверены, что хотите удалить отчет ?" />
    ),
    reportCheck: (
      <ReportCheckSection
        setSelectedReportCheckReasons={setSelectedReportCheckReasons}
        selectedReportCheckReasons={selectedReportCheckReasons}
        setSelectedCheckTypeOption={setSelectedCheckTypeOption}
        setReportCheckCommentValue={setReportCheckCommentValue}
        setSelectedActionOption={setSelectedActionOption}
        selectedActionOption={selectedActionOption}
        handleFileChange={handleFileChange}
        setSelectedFiles={setSelectedFiles}
        setIsError={setReportCheckError}
        selectedFiles={selectedFiles}
        isError={reportCheckError}
      />
    ),
    updateReviewStatus: (
      <UpdateReviewStatusSection
        setSelectedOption={setSelectedReviewStatusOption}
        setSelectedReason={setSelectedReviewReasonId}
        setReviewReasonError={setReviewReasonError}
        reviewReasonError={reviewReasonError}
      />
    ),
    unloadReportsPhotos: (
      <UnloadReportsPhotoSection
        setSelectedCustomServices={setSelectedCustomServices}
        handleChangeLimitInput={handleChangeLimitInput}
        setSelectedActions={setSelectedActions}
        error={error}
      />
    ),
    customerReportsSettings: (
      <CustomerReportsSettingsSection
        setSelectedReportsSettings={setSelectedReportsSettings}
        selectedReportsSettings={selectedReportsSettings}
        setIsCheckedFullInfo={setIsCheckedAllSettings}
        isCheckedFullInfo={isCheckedAllSettings}
      />
    ),
    adminReportsSettings: (
      <AdminReportsSettingsSection
        setSelectedReportsSettings={setSelectedReportsSettings}
        selectedReportsSettings={selectedReportsSettings}
        setIsCheckedFullInfo={setIsCheckedAllSettings}
        isCheckedFullInfo={isCheckedAllSettings}
      />
    ),
    expiredReportsSettings: (
      <ExpiredReportsSettingsSection
        setSelectedReportsSettings={setSelectedExpiredReportsSettings}
        selectedReportsSettings={selectedExpiredReportsSettings}
        setIsCheckedFullInfo={setIsCheckedAllExpiredSettings}
        isCheckedFullInfo={isCheckedAllExpiredSettings}
      />
    ),
    singleReportSettings: (
      <SingleReportSettingsSection
        setReorderedReportOptions={setReorderedReportOptions}
        setSelectedReportTabs={setSelectedReportTabs}
        setIsCheckedFullInfo={setIsCheckedFullInfo}
        selectedReportTabs={selectedReportTabs}
        isCheckedFullInfo={isCheckedFullInfo}
      />
    ),
    adminSingleReportSettings: (
      <AdminSingleReportSettingsSection
        setReorderedReportOptions={setReorderedReportOptions}
        setSelectedReportTabs={setSelectedReportTabs}
        setIsCheckedFullInfo={setIsCheckedFullInfo}
        selectedReportTabs={selectedReportTabs}
        isCheckedFullInfo={isCheckedFullInfo}
      />
    ),

    outletsDownload: (
      <OutletsDownloadSection
        handleFileChange={handleFileChange}
        setSelectedFiles={setSelectedFiles}
        selectedFiles={selectedFiles}
      />
    ),
    copyReport: (
      <CopyReportSection
        setSelectedDate={setSelectedDate}
        selectedDate={selectedDate}
      />
    ),
    copyReports: (
      <CopyReportSection
        setSelectedDate={setSelectedDate}
        selectedDate={selectedDate}
      />
    ),

    updateDeliveryStatus: (
      <UpdateDeliveryStatusSection
        setSelectedOption={setSelectedDeliveryOption}
      />
    ),
    updateRateStatus: (
      <UpdateRateStatusSection
        setSelectedOption={setSelectedRateStatusOption}
      />
    ),
  };

  return (
    <div className={styles.wrapper}>
      <div
        className={
          isOpenHistory && purpose === "showVisitScheduleHistory"
            ? styles.active__header_btn
            : purpose === "addressInfo"
            ? styles.address__link
            : styles.header__btn
        }
        onClick={() => {
          handleClickOpenBtn(purpose, modalTitle);
        }}
      >
        <span className={styles.header__btn_content}>{content}</span>
      </div>
      {open && (
        <Blackout onClose={handleClickCloseBtn}>
          <div
            className={
              purpose === "unloadReportsPhotos" || purpose === "addressInfo"
                ? styles.long__modal
                : styles.modal
            }
            id="headerBtnModal"
            onClick={(event: any) => event.stopPropagation()}
          >
            <div className={styles.modal__title_block}>
              <span>{actualModalTitle}</span>
              <img
                style={{ cursor: "pointer" }}
                onClick={handleClickCloseBtn}
                src={Close}
                alt="close"
              />
            </div>
            {actualPurpose !== "outletsUnload" &&
              actualPurpose !== "errorsUnload" && (
                <div
                  className={
                    actualPurpose === "reportCheck"
                      ? styles.reportCheck__content_block
                      : actualPurpose.includes("Settings")
                      ? styles.settings__content_block
                      : styles.content__block
                  }
                >
                  {sectionComponents[actualPurpose]}
                </div>
              )}
            <div className={styles.btn__block}>
              {actualPurpose !== "addressInfo" && (
                <button
                  className={styles.accept__btn}
                  onClick={handleClickApplyBtn}
                >
                  Применить
                </button>
              )}
              <button
                className={styles.cancel__btn}
                onClick={handleClickCloseBtn}
              >
                Отмена
              </button>
            </div>
          </div>
        </Blackout>
      )}
    </div>
  );
};

export default HeaderBtn;
