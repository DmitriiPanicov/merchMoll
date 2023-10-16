import { FC, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  actionCancelReportReview,
  actionApproveReport,
  actionRejectReport,
} from "../../../../redux/action/userSingleReport/actionUserSingleReport";
import {
  formatHistoryDateTime,
  formatDateTime,
} from "../../../../utils/formatDate";
import { getLabelByValue } from "../../../../utils/getLabelByValue";
import { AppDispatch } from "../../../../redux/reducer/store";

import Select from "../../../custom/select/select";

import { ReactComponent as CloseIcon } from "../../../../assets/icons/close.svg";

const statusOptions = [
  { value: "", label: "Выберите статус" },
  { value: "NotChecked", label: "Не проверен" },
  { value: "PartiallyRejected", label: "Отклонен" },
  { value: "Approved", label: "Утвержден" },
];

const ReportCheckTableSection: FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { criteriasList, report, list } = useSelector(
    (state: any) => state.userSingleReport.userSingleReport
  );

  const [isFixedReportOpen, setIsFixedReportOpen] = useState<boolean>(false);
  const [isInternalReportRevisionOpen, setIsIntermalReportRevisionOpen] =
    useState<boolean>(false);
  const [isInternalReportImprovedOpen, setIsIntermalReportImprovedOpen] =
    useState<boolean>(false);
  const [isInternalReportApproveOpen, setIsIntermalReportApproveOpen] =
    useState<boolean>(false);
  const [isInternalReportRejectOpen, setIsIntermalReportRejectOpen] =
    useState<boolean>(false);
  const [isRejectedReportOpen, setIsRejectedReportOpen] =
    useState<boolean>(false);

  const [selectedStatusOption, setSelectedStatusOption] = useState<string>("");
  const [reviewCommentValue, setReviewCommentValue] = useState<string>("");
  const [commentValue, setCommentValue] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [selectedReviewOptionId, setSelectedReviewOptionId] =
    useState<number>(0);
  const [isError, setIsError] = useState<boolean>(false);

  const reasonOptions =
    list &&
    criteriasList?.map((option: any) => ({
      value: option.reason.id || option,
      label: option.reason.name || option,
    }));
  reasonOptions &&
    reasonOptions.unshift({ value: 0, label: "Выберите причину" });

  useEffect(() => {
    const reportStatus =
      report && Object.keys(report?.reviewModel?.reviewStatus).toString();

    const statusActions: any = {
      Approved: {
        setState: setIsIntermalReportApproveOpen,
        statusOption: "Approved",
      },
      PartiallyRejected: {
        setState: setIsIntermalReportRejectOpen,
        statusOption: "PartiallyRejected",
      },
      Revision: {
        setState: setIsIntermalReportRevisionOpen,
      },
      Improved: {
        setState: setIsIntermalReportImprovedOpen,
      },
      Rejected: {
        setState: setIsRejectedReportOpen,
      },
      Fixed: {
        setState: setIsFixedReportOpen,
      },
      NotChecked: {},
    };

    if (reportStatus) {
      handleClickInternalLink();

      const statusAction = statusActions[reportStatus];

      if (!!Object.keys(statusAction).length) {
        statusAction.setState(true);
        if (statusAction.statusOption) {
          setSelectedStatusOption(statusAction.statusOption);
        }
      }
    }
  }, [report?.reviewModel?.reviewStatus, report?.reportId?.id, report, list]);

  const handleClickInternalLink = () => {
    setIsIntermalReportImprovedOpen(false);
    setIsIntermalReportRevisionOpen(false);
    setIsIntermalReportApproveOpen(false);
    setIsIntermalReportRejectOpen(false);
    setIsRejectedReportOpen(false);
    setSelectedReviewOptionId(0);
    setIsFixedReportOpen(false);
    setSelectedStatusOption("");
    setReviewCommentValue("");
    setCommentValue("");
  };

  const formatRejectedDateTime = (newDateTime: any) => {
    const options: any = {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
    };

    const dateTime = newDateTime ? new Date(newDateTime) : new Date();
    return new Intl.DateTimeFormat("ru-RU", options).format(dateTime);
  };

  const handleChangeStatusOptions = (event: any) => {
    setSelectedStatusOption(event.value);

    if (errorMessage === "Статус не выбран") {
      setIsError(false);
    }
  };

  const handleChangeReasonOptions = (event: any) => {
    setSelectedReviewOptionId(event.value);
    setIsError(false);

    if (errorMessage === "Нужно указать причину") {
      setIsError(false);
    }
  };

  const handleClickSetUpBtn = () => {
    if (selectedStatusOption === "") {
      setErrorMessage("Статус не выбран");
      setIsError(true);
    }

    if (selectedStatusOption === "NotChecked") {
      dispatch(actionCancelReportReview(report && report.reportId.id)).then(
        () => {
          handleClickInternalLink();
        }
      );
    } else if (selectedStatusOption === "Approved") {
      dispatch(
        actionApproveReport({
          reportId: report.reportId,
          reviewReasonId: {
            id: selectedReviewOptionId,
          },
          reviewComment: reviewCommentValue,
          comment: commentValue,
        })
      ).then(() => {
        setIsIntermalReportApproveOpen(true);
      });
    } else if (selectedStatusOption === "PartiallyRejected") {
      if (selectedReviewOptionId === 0) {
        setErrorMessage("Нужно указать причину");
        setIsError(true);
      } else {
        dispatch(
          actionRejectReport({
            reportId: report.reportId,
            reviewReasonId: {
              id: selectedReviewOptionId,
            },
            reviewComment: reviewCommentValue,
            comment: commentValue,
          })
        ).then(() => {
          setIsIntermalReportRejectOpen(true);
        });
      }
    }
  };

  const handleClickCancelBtn = () => {
    setSelectedReviewOptionId(0);
    setSelectedStatusOption("");
    setReviewCommentValue("");
    setCommentValue("");
  };

  const isAllSectionsClosed =
    !isInternalReportApproveOpen &&
    !isInternalReportRevisionOpen &&
    !isInternalReportImprovedOpen &&
    !isInternalReportRejectOpen &&
    !isRejectedReportOpen &&
    !isFixedReportOpen;

  const reviewComment = report && report?.reviewModel?.reviewComment;
  const reviewerData = report && report?.reviewModel?.reviewer;
  const comment = report && report?.reviewModel?.comment;
  const fixDate = report && report?.reviewModel?.fixDate;
  const reason = report && report?.reviewModel?.reason;
  const date = report && report?.reviewModel?.date;
  const reviewer = reviewerData
    ? `${reviewerData.familyName} 
         ${reviewerData?.givenName} 
         ${reviewerData?.middleName} 
         (${reviewerData?.role})`
    : "Система";

  return (
    <div className={"customerReport__check_block"}>
      {isAllSectionsClosed && (
        <>
          <span className="section__title">Проверка отчета</span>
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
          <div className="customer__check_block">
            <div className="report__list_elem">
              <span>Уровень проверки:</span>
              <span>Контролер</span>
            </div>
            <div className="report__list_elem">
              <span>Статус:</span>
              <div className="wrapper__list_block">
                <Select
                  propsChange={handleChangeStatusOptions}
                  defaultValue={statusOptions[0]}
                  value={statusOptions.find(
                    (option) => option.value === selectedStatusOption
                  )}
                  className="check__select"
                  options={statusOptions}
                />
              </div>
            </div>
            <div className="report__list_elem">
              <span>Причина (отклонения/доработки):</span>
              <div className="wrapper__list_block">
                <Select
                  defaultValue={{ value: 0, label: "Выберите причину" }}
                  propsChange={handleChangeReasonOptions}
                  value={
                    reasonOptions &&
                    reasonOptions.find(
                      (option: any) => option.value === selectedReviewOptionId
                    )
                  }
                  className="check__select"
                  options={reasonOptions}
                />
              </div>
            </div>
            <div className="report__list_elem">
              <span>Комментарий к проверке:</span>
              <textarea
                className="check__comment_textfield"
                onChange={(event) => setReviewCommentValue(event.target.value)}
                value={reviewCommentValue}
              ></textarea>
            </div>
            <div className="report__list_elem">
              <span>Комментарий:</span>
              <textarea
                className="comment__textfield"
                onChange={(event) => setCommentValue(event.target.value)}
                value={commentValue}
              ></textarea>
            </div>
          </div>
          <div className="report__check_btnBlock">
            <button className="set__up_btn" onClick={handleClickSetUpBtn}>
              Установить
            </button>
            <button className="cancel__btn" onClick={handleClickCancelBtn}>
              Отмена
            </button>
            <div></div>
          </div>
        </>
      )}
      {isInternalReportApproveOpen && (
        <>
          <span className="section__title">Внутренняя проверка отчета</span>
          <div className="customer__check_block">
            <div className="internal__check_elem">
              <span>Проверяющий:</span>
              <span>{reviewer}</span>
            </div>
            <div className="internal__check_elem">
              <span>Статус:</span>
              <span className="internal__link">
                <span
                  onClick={handleClickInternalLink}
                  className="link__content"
                >
                  {getLabelByValue(selectedStatusOption, statusOptions)}
                </span>
              </span>
            </div>
            {comment && (
              <div className="internal__check_elem">
                <span>Комментарий:</span>
                <span>
                  <div className="disabled__revision_info">
                    <pre>{comment}</pre>
                  </div>
                </span>
              </div>
            )}
            {reviewComment && (
              <div className="internal__check_elem">
                <span>Комментарий при проверке:</span>
                <span>
                  <input
                    className="internal__check_input"
                    type="text"
                    readOnly
                    disabled
                    defaultValue={reviewComment}
                  />
                </span>
              </div>
            )}
            <div className="internal__check_elem">
              <span>Дата:</span>
              <span>{formatHistoryDateTime(date)}</span>
            </div>
          </div>
        </>
      )}
      {isInternalReportRejectOpen && (
        <>
          <span className="section__title">Внутренняя проверка отчета</span>
          <div className="customer__check_block">
            <div className="internal__check_elem">
              <span>Проверяющий:</span>
              <span>{reviewer}</span>
            </div>
            <div className="internal__check_elem">
              <span>Статус:</span>
              <span className="internal__link">
                <span
                  onClick={handleClickInternalLink}
                  className="link__content"
                >
                  {getLabelByValue(selectedStatusOption, statusOptions)}{" "}
                  (частично)
                </span>
              </span>
            </div>
            <div className="internal__check_elem">
              <span>Критерий:</span>
              <span>
                <pre>
                  {getLabelByValue(
                    (list && list)?.find(
                      (elem: any) => elem?.reason?.name === reason
                    )?.reason?.id,
                    reasonOptions
                  ) || reason}
                </pre>
              </span>
            </div>
            {comment && (
              <div className="internal__check_elem">
                <span>Комментарий:</span>
                <div className="reportCheck__info_block">
                  <pre>{comment}</pre>
                </div>
              </div>
            )}
            {reviewComment && (
              <div className="internal__check_elem">
                <span>Комментарий при проверке:</span>
                <span>
                  <input
                    className="internal__check_input"
                    type="text"
                    readOnly
                    disabled
                    defaultValue={reviewComment}
                  />
                </span>
              </div>
            )}
            <div className="internal__check_elem">
              <span>Дата:</span>
              <span>{formatHistoryDateTime(date)}</span>
            </div>
          </div>
        </>
      )}
      {isInternalReportRevisionOpen && (
        <>
          <span className="section__title">Внутренняя проверка отчета</span>
          <div className="revision__check_block">
            <div className="internal__check_elem">
              <span>Проверяющий:</span>
              <span>{reviewer}</span>
            </div>
            <div className="internal__check_elem">
              <span>Статус:</span>
              <span className="internal__link">
                <span
                  onClick={handleClickInternalLink}
                  className="link__content"
                >
                  Доработка
                </span>
              </span>
            </div>
            <div className="internal__check_elem">
              <span>Дата отклонения:</span>
              <span>{formatHistoryDateTime(fixDate)}</span>
            </div>
            <div className="internal__check_elem">
              <span>Критерий:</span>
              <span>{reason}</span>
            </div>
            {comment && (
              <div className="internal__check_elem">
                <span>Комментарий:</span>
                <span>
                  <div className="disabled__revision_info">
                    <pre>{comment}</pre>
                  </div>
                </span>
              </div>
            )}
            {reviewComment && (
              <div className="internal__check_elem">
                <span>Комментарий при проверке:</span>
                <span>
                  <input
                    className="internal__revision_input"
                    type="text"
                    readOnly
                    disabled
                    defaultValue={reviewComment}
                  />
                </span>
              </div>
            )}
            <div className="internal__check_elem">
              <span>Дата:</span>
              <span>{formatDateTime(date)}</span>
            </div>
          </div>
        </>
      )}
      {isInternalReportImprovedOpen && (
        <>
          <span className="section__title">Внутренняя проверка отчета</span>
          <div className="revision__check_block">
            <div className="internal__check_elem">
              <span>Проверяющий:</span>
              <span>{reviewer}</span>
            </div>
            <div className="internal__check_elem">
              <span>Статус:</span>
              <span className="internal__link">
                <span
                  onClick={handleClickInternalLink}
                  className="link__content"
                >
                  Доработан
                </span>
              </span>
            </div>
            <div className="internal__check_elem">
              <span>Критерий:</span>
              <span>{reason}</span>
            </div>
            {comment && (
              <div className="internal__check_elem">
                <span>Комментарий:</span>
                <span>
                  <div className="disabled__revision_info">
                    <pre>{comment}</pre>
                  </div>
                </span>
              </div>
            )}
            {reviewComment && (
              <div className="internal__check_elem">
                <span>Комментарий при проверке:</span>
                <span>
                  <input
                    className="internal__revision_input"
                    type="text"
                    readOnly
                    disabled
                    defaultValue={reviewComment}
                  />
                </span>
              </div>
            )}
            <div className="internal__check_elem">
              <span>Дата:</span>
              <span>{formatHistoryDateTime(date)}</span>
            </div>
          </div>
        </>
      )}
      {isRejectedReportOpen && (
        <>
          <span className="section__title">Внутренняя проверка отчета</span>
          <div className="revision__check_block">
            <div className="internal__check_elem">
              <span>Проверяющий:</span>
              <span>{reviewer}</span>
            </div>
            <div className="internal__check_elem">
              <span>Статус:</span>
              <span className="internal__link">
                <span
                  onClick={handleClickInternalLink}
                  className="reject__link_content"
                >
                  Отклонен
                </span>
              </span>
            </div>
            <div className="internal__check_elem">
              <span>Критерий:</span>
              <span>{reason}</span>
            </div>
            {comment && (
              <div className="internal__check_elem">
                <span>Комментарий:</span>
                <div className="reportCheck__info_block">
                  <pre>{comment}</pre>
                </div>
              </div>
            )}
            {reviewComment && (
              <div className="internal__check_elem">
                <span>Комментарий при проверке:</span>
                <span>
                  <input
                    className="internal__revision_input"
                    type="text"
                    readOnly
                    disabled
                    defaultValue={reviewComment}
                  />
                </span>
              </div>
            )}
            <div className="internal__check_elem">
              <span>Дата:</span>
              <span>{formatHistoryDateTime(date)}</span>
            </div>
          </div>
        </>
      )}
      {isFixedReportOpen && (
        <>
          <span className="section__title">Внутренняя проверка отчета</span>
          <div className="revision__check_block">
            <div className="internal__check_elem">
              <span>Проверяющий:</span>
              <span>{reviewer}</span>
            </div>
            <div className="internal__check_elem">
              <span>Статус:</span>
              <span className="internal__link">
                <span
                  onClick={handleClickInternalLink}
                  className="fixed__link_content"
                >
                  Исправлен
                </span>
              </span>
            </div>
            <div className="internal__check_elem">
              <span>Дата:</span>
              <span>{date && formatRejectedDateTime(date)}</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ReportCheckTableSection;
