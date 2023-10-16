import { FC, useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { formatDateTime } from "../../../../utils/formatDate";

const RateStatusTableSection: FC = () => {
  const { report } = useSelector(
    (state: any) => state.userSingleReport.userSingleReport
  );

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
        statusAction.setState(true);
      }
    }
  }, [report]);

  const resetSections = () => {
    setIsClientPartiallyDeclineOpen(false);
    setIsClientRecFixedRequestOpen(false);
    setIsClientDeclineRequestOpen(false);
    setIsClientReportApproveOpen(false);
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
  };

  const rateStatus = report && report?.rateModel?.rateStatus;
  const rateNotes = report && report?.rateModel?.rateNotes;
  const fixDate = report && report?.rateModel?.fixDate;
  const reasons = report && report?.rateModel?.reasons;
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
      {isClientReportApproveOpen && (
        <>
          <span className="section__title">Оценка</span>
          <div className="customer__check_block">
            <div className="internal__check_elem">
              <span>Статус:</span>
              <span className="internal__link">
                <span className="approved__content">Принят</span>
              </span>
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
              <span>Дата:</span>
              <span>{date && formatDateTime(date)}</span>
            </div>
          </div>
        </>
      )}
      {isClientDeclinedOpen && (
        <>
          <span className="section__title">Оценка</span>
          <div className="customer__check_block">
            <div className="internal__check_elem">
              <span>Статус:</span>
              <span className="internal__link">
                <span className="approved__content">Отклонен</span>
              </span>
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
              <span>Срок исправления:</span>
              <span>{fixDate && formatDateTime(fixDate)}</span>
            </div>
            <div className="internal__check_elem">
              <span>Дата:</span>
              <span>{date && formatDateTime(date)}</span>
            </div>
          </div>
        </>
      )}
      {(isClientReportClaimOpen || isClientReportRecOpen) && (
        <>
          <span className="section__title">Оценка</span>
          <div className="customer__check_block">
            <div className="internal__check_elem">
              <span>Статус:</span>
              <span className="internal__link">
                <span className="approved__content">
                  {Object.values(rateStatus)}
                </span>
              </span>
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
              <span>Срок исправления:</span>
              <span>{fixDate && formatDateTime(fixDate)}</span>
            </div>
            <div className="internal__check_elem">
              <span>Дата:</span>
              <span>{date && formatDateTime(date)}</span>
            </div>
          </div>
        </>
      )}
      {isClientClaimRequestOpen && (
        <>
          <span className="section__title">Оценка</span>
          <div className="customer__check_block">
            <div className="internal__check_elem">
              <span>Статус:</span>
              <span className="internal__link">
                <span className="approved__content">
                  Претензия (тр. подтверждения)
                </span>
              </span>
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
            <div className={"internal__check_elem"}>
              <span>Срок исправления:</span>
              {fixDate && <span>{formatDateTime(fixDate)}</span>}
            </div>
            <div className="internal__check_elem">
              <span>Дата:</span>
              <span>{date && formatDateTime(date)}</span>
            </div>
          </div>
        </>
      )}
      {isClientDeclineRequestOpen && (
        <>
          <span className="section__title">Оценка</span>
          <div className="customer__check_block">
            <div className="internal__check_elem">
              <span>Статус:</span>
              <span className="internal__link">
                <span className="approved__content">Претензия отклонена</span>
              </span>
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
              <span>Срок исправления:</span>
              <span>{fixDate && formatDateTime(fixDate)}</span>
            </div>
            <div className="internal__check_elem">
              <span>Дата:</span>
              <span>{date && formatDateTime(date)}</span>
            </div>
          </div>
        </>
      )}
      {isClientRecFixedRequestOpen && (
        <>
          <span className="section__title">Оценка</span>
          <div className="customer__check_block">
            <div className="internal__check_elem">
              <span>Статус:</span>
              <span className="internal__link">
                <span className="approved__content">
                  Рекомендация проработана
                </span>
              </span>
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
              <span>Срок исправления:</span>
              <span>{fixDate && formatDateTime(fixDate)}</span>
            </div>
            <div className="internal__check_elem">
              <span>Дата:</span>
              <span>{date && formatDateTime(date)}</span>
            </div>
          </div>
        </>
      )}
      {isClientFixedRecOpen && (
        <>
          <span className="section__title">Оценка</span>
          <div className="customer__check_block">
            <div className="internal__check_elem">
              <span>Статус:</span>
              <span className="internal__link">
                <span className="approved__content">
                  Рекомендация выполнена
                </span>
              </span>
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
              <span>Срок исправления:</span>
              <span>{fixDate && formatDateTime(fixDate)}</span>
            </div>
            <div className="internal__check_elem">
              <span>Дата:</span>
              <span>{date && formatDateTime(date)}</span>
            </div>
          </div>
        </>
      )}
      {isClientDeclineRecOpen && (
        <>
          <span className="section__title">Оценка</span>
          <div className="customer__check_block">
            <div className="internal__check_elem">
              <span>Статус:</span>
              <span className="internal__link">
                <span className="approved__content">
                  Рекомендация отклонена
                </span>
              </span>
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
              <span>Срок исправления:</span>
              <span>{fixDate && formatDateTime(fixDate)}</span>
            </div>
            <div className="internal__check_elem">
              <span>Дата:</span>
              <span>{date && formatDateTime(date)}</span>
            </div>
          </div>
        </>
      )}
      {isClientRecNotFixedOpen && (
        <>
          <span className="section__title">Оценка</span>
          <div className="customer__check_block">
            <div className="internal__check_elem">
              <span>Статус:</span>
              <span className="internal__link">
                <span className="approved__content">
                  Рекомендация не выполнена
                </span>
              </span>
            </div>
            <div className="internal__check_elem">
              <span>Критерий:</span>
              <span>{reasons.join(", ")}</span>
            </div>
            {rateNotes && (
              <div className="internal__check_elem">
                <span>Комментарий при проверке:</span>
                <span>{rateNotes}</span>
              </div>
            )}
            <div className="internal__check_elem">
              <span>Срок исправления:</span>
              <span>{fixDate && formatDateTime(fixDate)}</span>
            </div>
            <div className="internal__check_elem">
              <span>Дата:</span>
              <span>{date && formatDateTime(date)}</span>
            </div>
          </div>
        </>
      )}
      {isClientPartiallyDeclineOpen && (
        <>
          <span className="section__title">Оценка</span>
          <div className="customer__check_block">
            <div className="internal__check_elem">
              <span>Статус:</span>
              <span className="internal__link">
                <span className="approved__content">Отклонен (частично)</span>
              </span>
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
              <span>Срок исправления:</span>
              <span>{fixDate && formatDateTime(fixDate)}</span>
            </div>
            <div className="internal__check_elem">
              <span>Дата:</span>
              <span>{date && formatDateTime(date)}</span>
            </div>
          </div>
        </>
      )}
      {isClientFixedRequestOpen && (
        <>
          <span className="section__title">Оценка</span>
          <div className="customer__check_block">
            <div className="internal__check_elem">
              <span>Статус:</span>
              <span className="internal__link">
                <span className="approved__content">
                  Исправлен (тр. подтверждения)
                </span>
              </span>
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
              <span>Срок исправления:</span>
              <span>{fixDate && formatDateTime(fixDate)}</span>
            </div>
            <div className="internal__check_elem">
              <span>Дата:</span>
              <span>{date && formatDateTime(date)}</span>
            </div>
          </div>
        </>
      )}
      {isClientFixedOpen && (
        <>
          <span className="section__title">Оценка</span>
          <div className="customer__check_block">
            <div className="internal__check_elem">
              <span>Статус:</span>
              <span className="internal__link">
                <span className="approved__content">Исправлен</span>
              </span>
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
              <span>Срок исправления:</span>
              <span>{fixDate && formatDateTime(fixDate)}</span>
            </div>
            <div className="internal__check_elem">
              <span>Дата:</span>
              <span>{date && formatDateTime(date)}</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default RateStatusTableSection;
