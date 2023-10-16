import { FC, useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { getLabelByValue } from "../../../../utils/getLabelByValue";

const formatDate = (newDate: any) => {
  const date = new Date(newDate);
  const options: any = {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
  };

  const formattedDate = date.toLocaleDateString("ru-RU", options);
  return formattedDate;
};

const ReviewStatusTableSection: FC = () => {
  const { report, list } = useSelector(
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

  const reasonOptions =
    list &&
    list.map((option: any) => ({
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
      },
      PartiallyRejected: {
        setState: setIsIntermalReportRejectOpen,
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
      resetSections();

      const statusAction = statusActions[reportStatus];

      if (!!Object.keys(statusAction).length) {
        statusAction.setState(true);
      }
    }
  }, [report, list]);

  const resetSections = () => {
    setIsIntermalReportImprovedOpen(false);
    setIsIntermalReportRevisionOpen(false);
    setIsIntermalReportApproveOpen(false);
    setIsIntermalReportRejectOpen(false);
    setIsRejectedReportOpen(false);
    setIsFixedReportOpen(false);
  };

  const reviewComment = report && report?.reviewModel?.reviewComment;
  const reviewerData = report && report?.reviewModel?.reviewer;
  const comment = report && report?.reviewModel?.comment;
  const fixDate = report && report.reviewModel.fixDate;
  const reason = report && report.reviewModel?.reason;
  const date = report && report?.reviewModel?.date;
  const reviewer = reviewerData
    ? `${reviewerData.familyName} 
       ${reviewerData?.givenName} 
       ${reviewerData?.middleName} 
      (${reviewerData?.role})`
    : "Система";

  return (
    <div className={"customerReport__check_block"}>
      {isInternalReportApproveOpen && (
        <>
          <span className="section__title">Проверка</span>
          <div className="customer__check_block">
            <div className="internal__check_elem">
              <span>Проверяющий:</span>
              <span>{reviewer}</span>
            </div>
            <div className="internal__check_elem">
              <span>Статус:</span>
              <span>
                <span className="approved__content">Утвержден</span>
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
            <div className="internal__check_elem">
              <span>Дата:</span>
              <span>{formatDate(date)}</span>
            </div>
            {fixDate && (
              <div className="internal__check_elem">
                <span>Ожидаемая дата исправления:</span>
                <span>{formatDate(fixDate)}</span>
              </div>
            )}
          </div>
        </>
      )}
      {isInternalReportRejectOpen && (
        <>
          <span className="section__title">Проверка</span>
          <div className="customer__check_block">
            <div className="internal__check_elem">
              <span>Проверяющий:</span>
              <span>{reviewer}</span>
            </div>
            <div className="internal__check_elem">
              <span>Статус:</span>
              <span>
                <span className="approved__content">Отклонен частично</span>
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
              <span>{formatDate(date)}</span>
            </div>
            {fixDate && (
              <div className="internal__check_elem">
                <span>Ожидаемая дата исправления:</span>
                <span>{formatDate(fixDate)}</span>
              </div>
            )}
          </div>
        </>
      )}
      {isInternalReportRevisionOpen && (
        <>
          <span className="section__title">Проверка</span>
          <div className="revision__check_block">
            <div className="internal__check_elem">
              <span>Проверяющий:</span>
              <span>{reviewer}</span>
            </div>
            <div className="internal__check_elem">
              <span>Статус:</span>
              <span>
                <span className="approved__content">Доработка</span>
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
            <div className="internal__check_elem">
              <span>Дата:</span>
              <span>{formatDate(date)}</span>
            </div>
          </div>
        </>
      )}
      {isInternalReportImprovedOpen && (
        <>
          <span className="section__title">Проверка</span>
          <div className="revision__check_block">
            <div className="internal__check_elem">
              <span>Проверяющий:</span>
              <span>{reviewer}</span>
            </div>
            <div className="internal__check_elem">
              <span>Статус:</span>
              <span>
                <span className="approved__content">Доработан</span>
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
            <div className="internal__check_elem">
              <span>Дата:</span>
              <span>{formatDate(date)}</span>
            </div>
            {fixDate && (
              <div className="internal__check_elem">
                <span>Ожидаемая дата исправления:</span>
                <span>{formatDate(fixDate)}</span>
              </div>
            )}
          </div>
        </>
      )}
      {isRejectedReportOpen && (
        <>
          <span className="section__title">Проверка</span>
          <div className="revision__check_block">
            <div className="internal__check_elem">
              <span>Проверяющий:</span>
              <span>{reviewer}</span>
            </div>
            <div className="internal__check_elem">
              <span>Статус:</span>
              <span>
                <span className="reject__content">Отклонен</span>
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
            <div className="internal__check_elem">
              <span>Дата:</span>
              <span>{report && formatDate(date)}</span>
            </div>
            {fixDate && (
              <div className="internal__check_elem">
                <span>Ожидаемая дата исправления:</span>
                <span>{formatDate(fixDate)}</span>
              </div>
            )}
          </div>
        </>
      )}
      {isFixedReportOpen && (
        <>
          <span className="section__title">Проверка</span>
          <div className="revision__check_block">
            <div className="internal__check_elem">
              <span>Проверяющий:</span>
              <span>{reviewer}</span>
            </div>
            <div className="internal__check_elem">
              <span>Статус:</span>
              <span>
                <span className="fixed__content">Исправлен</span>
              </span>
            </div>
            <div className="internal__check_elem">
              <span>Дата:</span>
              <span>{formatDate(date)}</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ReviewStatusTableSection;
