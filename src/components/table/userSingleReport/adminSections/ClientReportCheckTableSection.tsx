import { FC, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerLocale } from "react-datepicker";
import DatePicker from "react-datepicker";

import ru from "date-fns/locale/ru";
import moment from "moment";

import {
  actionClientDeclineReport,
  actionClientRequestReport,
  actionClientAcceptReport,
  actionConfirmReportClaim,
  actionDeclineReportClaim,
  actionCancelReportClaim,
  actionUpdateFixDate,
  actionDeclineRate,
  actionAcceptRate,
} from "../../../../redux/action/userSingleReport/actionUserSingleReport";
import { reducerReportStatus } from "../../../../redux/reducer/userSingleReport/reducers/userSingleReport";
import { calculateProgress } from "../../../../utils/calculateUploadingProgress";
import { formatDateTime, getCorrectDate } from "../../../../utils/formatDate";
import { AppDispatch } from "../../../../redux/reducer/store";

import Select from "../../../custom/select/select";

import { ReactComponent as CloseIcon } from "../../../../assets/icons/close.svg";
import CheckMark from "../../../../assets/icons/checkMark.svg";
import Close from "../../../../assets/icons/close.svg";

const statusOptions = [
  { value: "Rejected", label: "Отклонен" },
  { value: "Claim", label: "Претензия в обработке" },
  { value: "Accepted", label: "Принят" },
  { value: "Recommendation", label: "Рекомедация в обработке" },
];

const ClientReportCheckTableSection: FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { clientReportCheckList, report, list } = useSelector(
    (state: any) => state.userSingleReport.userSingleReport
  );

  const currentDate = moment();
  const futureDate = currentDate.add(48, "hours").set({ hour: 23, minute: 59 });

  const [isClientFixedOpen, setIsClientFixedOpen] = useState<boolean>(false);
  const [isClientPartiallyDeclineOpen, setIsClientPartiallyDeclineOpen] =
    useState<boolean>(false);
  const [isClientRecFixedRequestOpen, setIsClientRecFixedRequestOpen] =
    useState<boolean>(false);
  const [isClientDeclineRequestOpen, setIsClientDeclineRequestOpen] =
    useState<boolean>(false);
  const [isClientReportApproveOpen, setIsClientReportApproveOpen] =
    useState<boolean>(false);
  const [isClientFixedRequestOpen, setIsClientFixedRequestOpen] =
    useState<boolean>(false);
  const [isClientClaimRequestOpen, setIsClientClaimRequestOpen] =
    useState<boolean>(false);
  const [isClientRecNotFixedOpen, setIsClientRecNotFixedOpen] =
    useState<boolean>(false);
  const [isClientReportClaimOpen, setIsClientReportClaimOpen] =
    useState<boolean>(false);
  const [isOpenClientReportCheck, setIsOpenClientReportCheck] =
    useState<boolean>(false);
  const [isClientDeclineRecOpen, setIsClientDeclineRecOpen] =
    useState<boolean>(false);
  const [isClientReportRecOpen, setIsClientReportRecOpen] =
    useState<boolean>(false);
  const [isClientFixedRecOpen, setIsClientFixedRecOpen] =
    useState<boolean>(false);
  const [isClientDeclinedOpen, setIsClintDeclinedOpen] =
    useState<boolean>(false);
  const [isOpenUpdateFixDate, setIsOpenUpdateFixDate] =
    useState<boolean>(false);
  const [isDeclineInputError, setIsDeclineInputError] =
    useState<boolean>(false);

  const [selectedCheckboxesId, setSelectedCheckboxId] = useState<number[]>([]);
  const [selectedUpdatedDate, setSelectedUpdatedDate] = useState<any>(
    new Date()
  );
  const [selectedStatusOption, setSelectedStatusOption] =
    useState<string>("Rejected");
  const [declineRecInputValue, setDeclineRecInputValue] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<any>(futureDate.toDate());
  const [uploadProgress, setUploadProgress] = useState<number[]>([]);
  const [displayFixDate, setDisplayFixDate] = useState<string>("");
  const [commentValue, setCommentValue] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [selectedFiles, setSelectedFiles] = useState<any>([]);
  const [isError, setIsError] = useState<boolean>(false);

  useEffect(() => {
    registerLocale("ru", ru);
  }, []);

  useEffect(() => {
    const reportStatus =
      report && Object.keys(report?.rateModel?.rateStatus).toString();

    const statusActions: any = {
      Recommendation: {
        setState: setIsClientReportRecOpen,
      },
      Claim: {
        setState: setIsClientReportClaimOpen,
      },
      Accepted: {
        setState: setIsClientReportApproveOpen,
      },
      ClaimRequest: {
        setState: setIsClientClaimRequestOpen,
      },
      ClaimDeclined: {
        setState: setIsClientDeclineRequestOpen,
      },
      RecommendationFixedRequest: {
        setState: setIsClientRecFixedRequestOpen,
      },
      RecommendationFixed: {
        setState: setIsClientFixedRecOpen,
      },
      RecommendationDeclined: {
        setState: setIsClientDeclineRecOpen,
      },
      PartiallyDeclined: {
        setState: setIsClientPartiallyDeclineOpen,
      },
      Fixed: {
        setState: setIsClientFixedOpen,
      },
      FixedRequest: {
        setState: setIsClientFixedRequestOpen,
      },
      RecommendationNotFixed: {
        setState: setIsClientRecNotFixedOpen,
      },
      Declined: {
        setState: setIsClintDeclinedOpen,
      },
      NotChecked: {},
    };

    if (reportStatus) {
      resetSections();

      const statusAction = statusActions[reportStatus];

      if (!!Object.keys(statusAction).length) {
        setIsOpenClientReportCheck(true);

        if (reportStatus === "ClaimRequest") {
          setSelectedUpdatedDate(
            new Date(report && report?.rateModel?.fixDate)
          );
          setDisplayFixDate(report && report?.rateModel?.fixDate);
        }

        statusAction.setState(true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [report?.rateModel?.rateStatus, report]);

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

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const checkboxId = parseInt(event.target.value);

    if (selectedCheckboxesId.includes(checkboxId)) {
      setSelectedCheckboxId(
        selectedCheckboxesId.filter((id) => id !== checkboxId)
      );
    } else {
      setSelectedCheckboxId([...selectedCheckboxesId, checkboxId]);
    }

    setIsError(false);
  };

  const handleDatePickerChange = (date: any) => {
    setSelectedDate(date);
  };

  const handleUpdateDatePickerChange = (date: any) => {
    setSelectedUpdatedDate(date);
  };

  const handleClickUpdateDateAcceptBtn = () => {
    const newDate = new Date(selectedUpdatedDate).toISOString();

    dispatch(
      actionUpdateFixDate({
        reportId: {
          id: report && report.reportId.id,
          name: "",
        },
        expectedFixDate: getCorrectDate(selectedUpdatedDate),
      })
    ).then(() => {
      setDisplayFixDate(newDate);
      setIsOpenUpdateFixDate(false);
    });
  };

  const handleClickUpdateDateCancelBtn = () => {
    setSelectedUpdatedDate(new Date(report && report?.rateModel?.fixDate));
    setIsOpenUpdateFixDate(false);
  };

  const handleFileChange = (event: any) => {
    const files = event.target.files;
    setSelectedFiles([...selectedFiles, ...files]);
  };

  const handleClickInternalLink = () => {
    dispatch(
      actionCancelReportClaim({
        reportId: {
          id: report && report.reportId.id,
          name: "",
        },
      })
    ).then(() => {
      resetSections();
    });
  };

  const resetSections = () => {
    setIsClientPartiallyDeclineOpen(false);
    setIsClientRecFixedRequestOpen(false);
    setIsClientDeclineRequestOpen(false);
    setSelectedDate(futureDate.toDate());
    setIsClientReportApproveOpen(false);
    setSelectedStatusOption("Rejected");
    setIsClientClaimRequestOpen(false);
    setIsClientFixedRequestOpen(false);
    setIsClientReportClaimOpen(false);
    setIsOpenClientReportCheck(false);
    setIsClientRecNotFixedOpen(false);
    setIsClientDeclineRecOpen(false);
    setIsClientReportRecOpen(false);
    setIsClientFixedRecOpen(false);
    setIsClintDeclinedOpen(false);
    setIsClientFixedOpen(false);
    setSelectedCheckboxId([]);
    setSelectedFiles([]);
    setCommentValue("");
  };

  const handleClickFormBtn = () => {
    if (selectedStatusOption === "Accepted") {
      setIsClientReportApproveOpen(true);

      dispatch(
        actionClientAcceptReport({
          reportId: {
            id: report && report.reportId.id,
            name: "",
          },
          rateNote: "",
          checkType: "DISTANCE",
        })
      );
    } else if (selectedStatusOption === "Rejected") {
      if (!selectedCheckboxesId.length) {
        setErrorMessage("Нужно указать причину");
        setIsError(true);
      } else {
        if (report && report.reviewModel.reviewStatus !== "Revision") {
          dispatch(
            actionClientDeclineReport(
              {
                reportId: {
                  id: report && report.reportId.id,
                  name: "",
                },
                reviewReasons: selectedCheckboxesId.map((value: any) => {
                  return {
                    id: value,
                  };
                }),
                notes: commentValue,
                checkType: "DISTANCE",
              },
              selectedFiles
            )
          );
        } else {
          dispatch(
            reducerReportStatus({
              status: 0,
              requestPurpose: "declineRateStatus",
            })
          );
          resetSections();
        }
      }
    } else {
      if (!selectedCheckboxesId.length) {
        setErrorMessage("Нужно указать причину");
        setIsError(true);
      } else {
        selectedStatusOption === "Claim"
          ? setIsClientReportClaimOpen(true)
          : setIsClientReportRecOpen(true);

        dispatch(
          actionClientRequestReport(
            {
              reportId: {
                id: report && report.reportId.id,
              },
              reviewReasons: selectedCheckboxesId.map((value: any) => {
                return {
                  id: value,
                };
              }),
              notes: commentValue,
              checkType: "DISTANCE",
              claimType:
                selectedStatusOption === "Claim" ? "Claim" : "Recommendation",
              expectedFixDate: getCorrectDate(selectedDate),
            },
            selectedFiles
          )
        );
      }
    }
  };

  const handleCancelClientReportCheck = () => {
    setSelectedDate(futureDate.toDate());
    setSelectedStatusOption("Rejected");
    setIsOpenClientReportCheck(false);
    setSelectedCheckboxId([]);
    setSelectedFiles([]);
    setCommentValue("");
  };

  const handleClickConfirmClaimBtn = () => {
    dispatch(
      actionConfirmReportClaim({
        reportId: {
          id: report && report.reportId.id,
          name: "",
        },
      })
    ).then(() => {
      setIsClientClaimRequestOpen(false);
      setIsClientReportClaimOpen(true);
    });
  };

  const handleClickDeclineClaimBtn = () => {
    const commentPrompt = prompt("Укажите комментарий", "");

    if (commentPrompt && commentPrompt !== null) {
      dispatch(
        actionDeclineReportClaim({
          reportId: {
            id: report && report.reportId.id,
            name: "",
          },
          notes: commentPrompt,
        })
      ).then(() => {
        setIsClientDeclineRequestOpen(true);
        setIsClientClaimRequestOpen(false);
      });
    } else {
      return;
    }
  };

  const handleClickAcceptFixedRequestBtn = (purpose: any) => {
    dispatch(
      actionAcceptRate({
        reportId: {
          id: report && report?.reportId.id,
        },
        rateNote: "",
        checkType: "DISTANCE",
      })
    ).then(() => {
      if (purpose === "fixed") {
        setIsClientFixedRequestOpen(false);
      } else {
        setIsClientRecFixedRequestOpen(false);
        setIsClientFixedRecOpen(true);
      }
    });
  };

  const handleClickDeclineFixedRequestBtn = (purpose: any) => {
    if (!declineRecInputValue) {
      setIsDeclineInputError(true);
    } else {
      dispatch(
        actionDeclineRate({
          reportId: {
            id: report && report?.reportId.id,
          },
          rateNote: declineRecInputValue,
          checkType: "DISTANCE",
        })
      ).then(() => {
        if (purpose === "fixed") {
          setIsClientFixedRequestOpen(false);
        } else {
          setIsClientRecFixedRequestOpen(false);
          setIsClientDeclineRecOpen(true);
        }
      });
    }
  };

  const handleChangeDeclineRecCommentValue = (event: any) => {
    setDeclineRecInputValue(event.target.value);
    setIsDeclineInputError(false);
  };

  const isAllSectionsClosed =
    !isClientPartiallyDeclineOpen &&
    !isClientRecFixedRequestOpen &&
    !isClientDeclineRequestOpen &&
    !isClientReportApproveOpen &&
    !isClientClaimRequestOpen &&
    !isClientFixedRequestOpen &&
    !isClientReportClaimOpen &&
    !isClientRecNotFixedOpen &&
    !isClientDeclineRecOpen &&
    !isClientReportRecOpen &&
    !isClientFixedRecOpen &&
    !isClientDeclinedOpen &&
    !isClientFixedOpen;

  const rateStatus = report && report?.rateModel?.rateStatus;
  const rateNotes = report && report?.rateModel?.rateNotes;
  const reasons = report && report?.rateModel?.reasons;
  const fixDate = report && report?.rateModel?.fixDate;
  const notes = report && report?.rateModel?.notes;
  const date = report && report?.rateModel?.date;

  return (
    <div
      className={
        isOpenClientReportCheck
          ? "customer__check_activeSection"
          : "client__check_section"
      }
    >
      {isAllSectionsClosed && (
        <span className="section__title">Проверка отчета клиентом</span>
      )}
      {isError && (
        <div className="report__error_block">
          <div className="error__block_row">
            <span>
              Вы должны исправить следующие ошибки прежде, чем продолжить.
            </span>
            <CloseIcon
              onClick={() => setIsError(false)}
              className="close__icon"
            />
          </div>
          <ul className="error__list">
            <li>{errorMessage}</li>
          </ul>
        </div>
      )}
      {!isOpenClientReportCheck && isAllSectionsClosed && (
        <button
          className="planograms__btn"
          onClick={() => setIsOpenClientReportCheck(true)}
        >
          Оценить работу
        </button>
      )}
      {isOpenClientReportCheck && isAllSectionsClosed && (
        <div className="report__check_wrapper">
          <div className="check__wrapper_list">
            <span>Статус оценки:</span>
            <div className="wrapper__list_block">
              <Select
                propsChange={(event: any) => {
                  setSelectedStatusOption(event.value);
                  setIsError(false);
                }}
                defaultValue={statusOptions[0]}
                className="check__select"
                options={statusOptions}
                value={statusOptions.find(
                  (option) => option.value === selectedStatusOption
                )}
              />
            </div>
          </div>
          <div className="check__wrapper_list">
            <span>Причины:</span>
            <div className="check__list_block">
              {list &&
                clientReportCheckList?.map((item: any, index: any) => (
                  <div key={index} className="check__list_elem">
                    <label className="checkbox__container">
                      <input
                        checked={selectedCheckboxesId.includes(item.reason.id)}
                        onChange={handleCheckboxChange}
                        value={item.reason.id}
                        name={item.reason.name}
                        type="checkbox"
                      />
                      <span className="checkmark"></span>
                    </label>
                    {item.reason.name}
                  </div>
                ))}
            </div>
          </div>
          <div className="check__wrapper_list">
            <span>Комментарий:</span>
            <textarea
              onChange={(event) => setCommentValue(event.target.value)}
              className="check__comment_textfield"
              value={commentValue}
            ></textarea>
          </div>
          <div className="check__wrapper_list">
            <span>Дата исправления:</span>
            <div className="check__data_wrapper">
              <DatePicker
                onKeyDown={(event) => event.preventDefault()}
                onChange={handleDatePickerChange}
                dateFormat="dd.MM.yyyy HH:mm"
                selected={selectedDate}
                timeCaption="Время"
                popperPlacement="top"
                showTimeSelect
                locale={ru}
                name="date"
              />
            </div>
          </div>
          <div className="check__wrapper_list">
            <span>Добавьте файлы:</span>
            <input
              className="download__file_input"
              onChange={handleFileChange}
              placeholder="Загрузить"
              type="file"
              name="checkFiles"
              id="checkFiles"
              multiple
            />
            <label htmlFor="checkFiles" className="file__label">
              Загрузить
            </label>
          </div>
          <div className="check__files__list">
            {selectedFiles.map((file: File, index: number) => {
              const fileSize = (file.size / (1024 * 1024)).toFixed(2);
              const progress = uploadProgress[index] || 0;

              return (
                <div key={index} className="file__list_elem">
                  <div className="file__list_dot"></div>
                  <span className="file__name">{file.name}</span>
                  <span>
                    {progress.toFixed(0)}% от {fileSize} MB
                  </span>
                  <span
                    onClick={() =>
                      setSelectedFiles(
                        selectedFiles.filter(
                          (elem: any) => elem.name !== file.name
                        )
                      )
                    }
                    className="cancel__file_btn"
                  >
                    Отменить
                  </span>
                </div>
              );
            })}
          </div>
          <div className="check__wrapper_list">
            <button className="form__btn" onClick={handleClickFormBtn}>
              Сформировать
            </button>
            <button
              className="cancel__btn"
              onClick={handleCancelClientReportCheck}
            >
              Отмена
            </button>
          </div>
        </div>
      )}
      {isClientReportApproveOpen && (
        <>
          <span className="section__title">Отчет проверен клиентом</span>
          <div className="customer__check_block">
            <div className="internal__check_elem">
              <span>Статус:</span>
              <span className="internal__link">
                <span
                  onClick={handleClickInternalLink}
                  className="link__content"
                >
                  {report && Object.values(rateStatus)}
                </span>
              </span>
            </div>
            <div className="internal__check_elem">
              <span>Дата:</span>
              <span>{date && formatDateTime(date)}</span>
            </div>
            {reasons[0] !== null && (
              <div className="internal__check_elem">
                <span>Критерий:</span>
                <span>{reasons.join(", ")}</span>
              </div>
            )}
            {notes && (
              <div className="internal__check_elem">
                <span>Комментарий:</span>
                <span>{notes}</span>
              </div>
            )}

            {rateNotes && (
              <div className="internal__check_elem">
                <span>Комментарий при проверке:</span>
                <span>{rateNotes}</span>
              </div>
            )}
          </div>
        </>
      )}
      {isClientDeclinedOpen && (
        <>
          <span className="section__title">Отчет проверен клиентом</span>
          <div className="customer__check_block">
            <div className="internal__check_elem">
              <span>Статус:</span>
              <span className="internal__link">
                <span
                  onClick={handleClickInternalLink}
                  className="link__content"
                >
                  Отклонен
                </span>
              </span>
            </div>
            <div className="internal__check_elem">
              <span>Дата:</span>
              <span>{date && formatDateTime(date)}</span>
            </div>
            {reasons[0] !== null && (
              <div className="internal__check_elem">
                <span>Критерий:</span>
                <span>{reasons.join(", ")}</span>
              </div>
            )}
            {notes && (
              <div className="internal__check_elem">
                <span>Комментарий:</span>
                <span>{notes}</span>
              </div>
            )}
            {rateNotes && (
              <div className="internal__check_elem">
                <span>Комментарий при проверке:</span>
                <span>{rateNotes}</span>
              </div>
            )}
            <div className="internal__check_elem">
              <span>Исправить до:</span>
              <span>{fixDate && formatDateTime(fixDate)}</span>
            </div>
          </div>
        </>
      )}
      {(isClientReportClaimOpen || isClientReportRecOpen) && (
        <>
          <span className="section__title">Отчет проверен клиентом</span>
          <div className="customer__check_block">
            <div className="internal__check_elem">
              <span>Статус:</span>
              <span className="internal__link">
                <span
                  onClick={handleClickInternalLink}
                  className="link__content"
                >
                  {report && Object.values(rateStatus)}
                </span>
              </span>
            </div>
            <div className="internal__check_elem">
              <span>Дата:</span>
              <span>{date && formatDateTime(date)}</span>
            </div>
            <div className="internal__check_elem">
              <span>Критерий:</span>
              <span>{reasons.join(", ")}</span>
            </div>
            {notes && (
              <div className="internal__check_elem">
                <span>Комментарий:</span>
                <span>
                  <input
                    className="internal__check_input"
                    type="text"
                    readOnly
                    disabled
                    defaultValue={notes}
                  />
                </span>
              </div>
            )}
            <div className="internal__check_elem">
              <span>Исправить до:</span>
              <span>{fixDate && formatDateTime(fixDate)}</span>
            </div>
          </div>
        </>
      )}
      {isClientClaimRequestOpen && (
        <>
          <span className="section__title">Отчет проверен клиентом</span>
          <div className="customer__check_block">
            <div className="internal__check_elem">
              <span>Статус:</span>
              <span className="internal__link">
                <span
                  onClick={handleClickInternalLink}
                  className="link__content"
                >
                  Претензия (тр. подтверждения)
                </span>
              </span>
            </div>
            <div className="internal__check_elem">
              <span>Дата:</span>
              <span>{date && formatDateTime(date)}</span>
            </div>
            <div className="internal__check_elem">
              <span>Критерий:</span>
              <span>{reasons.join(", ")}</span>
            </div>
            {notes && (
              <div className="internal__check_elem">
                <span>Комментарий:</span>
                <span>{notes}</span>
              </div>
            )}
            <div
              className={
                isOpenUpdateFixDate
                  ? "internal__update_elem"
                  : "internal__check_elemDate"
              }
            >
              <span>Исправить до:</span>
              {!isOpenUpdateFixDate && fixDate && (
                <span
                  className="claim__request_fixDate"
                  onClick={() => setIsOpenUpdateFixDate(!isOpenUpdateFixDate)}
                >
                  {formatDateTime(displayFixDate)}
                </span>
              )}
              {isOpenUpdateFixDate && (
                <div className="update__date_popup">
                  <div className="claim__update_date">
                    <DatePicker
                      onKeyDown={(event) => event.preventDefault()}
                      onChange={handleUpdateDatePickerChange}
                      dateFormat="dd.MM.yyyy HH:mm"
                      selected={selectedUpdatedDate}
                      popperPlacement="top"
                      minDate={new Date()}
                      timeCaption="Время"
                      showTimeSelect
                      locale={ru}
                      name="date"
                    />
                  </div>
                  <div className="btns__block">
                    <button
                      onClick={handleClickUpdateDateAcceptBtn}
                      className="accept__name_btn"
                    >
                      <img
                        className="check__mark_icon"
                        src={CheckMark}
                        alt="accept"
                      />
                    </button>
                    <button
                      onClick={handleClickUpdateDateCancelBtn}
                      className="cancel__name_btn"
                    >
                      <img src={Close} alt="close" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="btns__block">
            <button
              className="accept__claim"
              onClick={handleClickConfirmClaimBtn}
            >
              Утвердить претензию
            </button>
            <button
              className="reject__claim"
              onClick={handleClickDeclineClaimBtn}
            >
              Отклонить претензию
            </button>
          </div>
        </>
      )}
      {isClientDeclineRequestOpen && (
        <>
          <span className="section__title">Отчет проверен клиентом</span>
          <div className="customer__check_block">
            <div className="internal__check_elem">
              <span>Статус:</span>
              <span className="internal__link">
                <span
                  onClick={handleClickInternalLink}
                  className="link__content"
                >
                  Претензия отклонена
                </span>
              </span>
            </div>
            <div className="internal__check_elem">
              <span>Дата:</span>
              <span>{date && formatDateTime(date)}</span>
            </div>
            <div className="internal__check_elem">
              <span>Критерий:</span>
              <span>{reasons.join(", ")}</span>
            </div>
            {notes && (
              <div className="internal__check_elem">
                <span>Комментарий:</span>
                <span>{notes}</span>
              </div>
            )}
            {rateNotes && (
              <div className="internal__check_elem">
                <span>Комментарий при проверке:</span>
                <span>{rateNotes}</span>
              </div>
            )}
            <div className="internal__check_elem">
              <span>Исправить до:</span>
              <span>{fixDate && formatDateTime(fixDate)}</span>
            </div>
          </div>
        </>
      )}
      {isClientRecFixedRequestOpen && (
        <>
          <span className="section__title">Отчет проверен клиентом</span>
          <div className="customer__check_block">
            <div className="internal__check_elem">
              <span>Статус:</span>
              <span className="internal__link">
                <span
                  onClick={handleClickInternalLink}
                  className="link__content"
                >
                  Рекомендация проработана
                </span>
              </span>
            </div>
            <div className="internal__check_elem">
              <span>Дата:</span>
              <span>{date && formatDateTime(date)}</span>
            </div>
            <div className="internal__check_elem">
              <span>Критерий:</span>
              <span>{reasons.join(", ")}</span>
            </div>
            {notes && (
              <div className="internal__check_elem">
                <span>Комментарий:</span>
                <span>{notes}</span>
              </div>
            )}
            <div className="internal__check_elem">
              <span>Исправить до:</span>
              <span>{fixDate && formatDateTime(fixDate)}</span>
            </div>
          </div>
          <div className="btns__block">
            <button
              className="reject__claim"
              onClick={() => handleClickAcceptFixedRequestBtn("recommendation")}
            >
              Принять исправление
            </button>
            <button
              className="accept__claim"
              onClick={() =>
                handleClickDeclineFixedRequestBtn("recommendation")
              }
            >
              Отклонить исправление
            </button>
          </div>
          <div className="rec__fixed_commentBlock">
            <span className={isDeclineInputError ? "decline__error_title" : ""}>
              Комментарий к проверке
            </span>
            <div className="rec__fixed_inputBlock">
              <div className="decline__input_errorBlock">
                <input
                  type="text"
                  className={
                    isDeclineInputError
                      ? "error__decline_input"
                      : "internal__check_input"
                  }
                  onChange={handleChangeDeclineRecCommentValue}
                />
                {isDeclineInputError && (
                  <span className="decline__error_message">
                    Необходимо заполнить причину отклонения
                  </span>
                )}
              </div>
              <span>Изменения по внутренней проверке</span>
            </div>
          </div>
        </>
      )}
      {isClientFixedRecOpen && (
        <>
          <span className="section__title">Отчет проверен клиентом</span>
          <div className="customer__check_block">
            <div className="internal__check_elem">
              <span>Статус:</span>
              <span className="internal__link">
                <span
                  onClick={handleClickInternalLink}
                  className="link__content"
                >
                  Рекомендация выполнена
                </span>
              </span>
            </div>
            <div className="internal__check_elem">
              <span>Дата:</span>
              <span>{date && formatDateTime(date)}</span>
            </div>
            <div className="internal__check_elem">
              <span>Критерий:</span>
              <span>{reasons.join(", ")}</span>
            </div>
            {notes && (
              <div className="internal__check_elem">
                <span>Комментарий:</span>
                <span>{notes}</span>
              </div>
            )}
            <div className="internal__check_elem">
              <span>Исправить до:</span>
              <span>{fixDate && formatDateTime(fixDate)}</span>
            </div>
          </div>
        </>
      )}
      {isClientDeclineRecOpen && (
        <>
          <span className="section__title">Отчет проверен клиентом</span>
          <div className="customer__check_block">
            <div className="internal__check_elem">
              <span>Статус:</span>
              <span className="internal__link">
                <span
                  onClick={handleClickInternalLink}
                  className="link__content"
                >
                  Рекомендация отклонена
                </span>
              </span>
            </div>
            <div className="internal__check_elem">
              <span>Дата:</span>
              <span>{date && formatDateTime(date)}</span>
            </div>
            <div className="internal__check_elem">
              <span>Критерий:</span>
              <span>{reasons.join(", ")}</span>
            </div>
            {notes && (
              <div className="internal__check_elem">
                <span>Комментарий:</span>
                <span>{notes}</span>
              </div>
            )}
            {(declineRecInputValue || rateNotes) && (
              <div className="internal__check_elem">
                <span>Комментарий при проверке:</span>
                <span>{declineRecInputValue || rateNotes}</span>
              </div>
            )}
            <div className="internal__check_elem">
              <span>Исправить до:</span>
              <span>{fixDate && formatDateTime(fixDate)}</span>
            </div>
          </div>
        </>
      )}
      {isClientRecNotFixedOpen && (
        <>
          <span className="section__title">Отчет проверен клиентом</span>
          <div className="customer__check_block">
            <div className="internal__check_elem">
              <span>Статус:</span>
              <span className="internal__link">
                <span
                  onClick={handleClickInternalLink}
                  className="link__content"
                >
                  Рекомендация не выполнена
                </span>
              </span>
            </div>
            <div className="internal__check_elem">
              <span>Дата:</span>
              <span>{date && formatDateTime(date)}</span>
            </div>
            <div className="internal__check_elem">
              <span>Критерий:</span>
              <span>{reasons.join(", ")}</span>
            </div>
            {(declineRecInputValue || notes) && (
              <div className="internal__check_elem">
                <span>Комментарий при проверке:</span>
                <span>{declineRecInputValue || notes}</span>
              </div>
            )}
            <div className="internal__check_elem">
              <span>Исправить до:</span>
              <span>{fixDate && formatDateTime(fixDate)}</span>
            </div>
          </div>
        </>
      )}
      {isClientPartiallyDeclineOpen && (
        <>
          <span className="section__title">Отчет проверен клиентом</span>
          <div className="customer__check_block">
            <div className="internal__check_elem">
              <span>Статус:</span>
              <span className="internal__link">
                <span
                  onClick={handleClickInternalLink}
                  className="link__content"
                >
                  Отклонен (частично)
                </span>
              </span>
            </div>
            <div className="internal__check_elem">
              <span>Дата:</span>
              <span>{date && formatDateTime(date)}</span>
            </div>
            <div className="internal__check_elem">
              <span>Критерий:</span>
              <span>{reasons?.join(", ")}</span>
            </div>
            {notes && (
              <div className="internal__check_elem">
                <span>Комментарий:</span>
                <span>{notes}</span>
              </div>
            )}
            {rateNotes && (
              <div className="internal__check_elem">
                <span>Комментарий при проверке:</span>
                <span>{rateNotes}</span>
              </div>
            )}
            <div className="internal__check_elem">
              <span>Исправить до:</span>
              <span>{fixDate && formatDateTime(fixDate)}</span>
            </div>
          </div>
        </>
      )}
      {isClientFixedRequestOpen && (
        <>
          <span className="section__title">Отчет проверен клиентом</span>
          <div className="customer__check_block">
            <div className="internal__check_elem">
              <span>Статус:</span>
              <span className="internal__link">
                <span
                  onClick={handleClickInternalLink}
                  className="link__content"
                >
                  Исправлен (тр. подтверждения)
                </span>
              </span>
            </div>
            <div className="internal__check_elem">
              <span>Дата:</span>
              <span>{date && formatDateTime(date)}</span>
            </div>
            <div className="internal__check_elem">
              <span>Критерий:</span>
              <span>{reasons.join(", ")}</span>
            </div>
            {notes && (
              <div className="internal__check_elem">
                <span>Комментарий:</span>
                <span>{notes}</span>
              </div>
            )}
            <div className="internal__check_elem">
              <span>Исправить до:</span>
              <span>{fixDate && formatDateTime(fixDate)}</span>
            </div>
          </div>
          <div className="btns__block">
            <button
              className="reject__claim"
              onClick={() => handleClickAcceptFixedRequestBtn("fixed")}
            >
              Принять исправление
            </button>
            <button
              className="accept__claim"
              onClick={() => handleClickDeclineFixedRequestBtn("fixed")}
            >
              Отклонить исправление
            </button>
          </div>
          <div className="rec__fixed_commentBlock">
            <span className={isDeclineInputError ? "decline__error_title" : ""}>
              Комментарий к проверке
            </span>
            <div className="rec__fixed_inputBlock">
              <div className="decline__input_errorBlock">
                <input
                  type="text"
                  className={
                    isDeclineInputError
                      ? "error__decline_input"
                      : "internal__check_input"
                  }
                  onChange={handleChangeDeclineRecCommentValue}
                />
                {isDeclineInputError && (
                  <span className="decline__error_message">
                    Необходимо заполнить причину отклонения
                  </span>
                )}
              </div>
              <span>Изменения по внутренней проверке</span>
            </div>
          </div>
        </>
      )}
      {isClientFixedOpen && (
        <>
          <span className="section__title">Отчет проверен клиентом</span>
          <div className="customer__check_block">
            <div className="internal__check_elem">
              <span>Статус:</span>
              <span className="internal__link">
                <span
                  onClick={handleClickInternalLink}
                  className="link__content"
                >
                  Исправлен
                </span>
              </span>
            </div>
            <div className="internal__check_elem">
              <span>Дата:</span>
              <span>{date && formatDateTime(date)}</span>
            </div>
            <div className="internal__check_elem">
              <span>Критерий:</span>
              <span>{reasons.join(", ")}</span>
            </div>
            {notes && (
              <div className="internal__check_elem">
                <span>Комментарий:</span>
                <span>{notes}</span>
              </div>
            )}
            {rateNotes && (
              <div className="internal__check_elem">
                <span>Комментарий при проверке:</span>
                <span>{rateNotes}</span>
              </div>
            )}
            <div className="internal__check_elem">
              <span>Исправить до:</span>
              <span>{fixDate && formatDateTime(fixDate)}</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ClientReportCheckTableSection;
