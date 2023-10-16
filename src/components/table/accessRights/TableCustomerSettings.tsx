import { FC, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import { actionGetClientSettings } from "../../../redux/action/accessRights/actionCustomersSettings";
import { actionGetCustomersList } from "../../../redux/action/accessRights/actionCustomersList";
import { getDaysInMonth } from "../../../utils/getDaysInMonth";
import { AppDispatch } from "../../../redux/reducer/store";

import Loader from "../../custom/loader/loader";
import Select from "../../custom/select/select";

import "../table.scss";

const reviewStatusesOptions = [
  { value: "", label: "Все" },
  { value: "NotChecked", label: "Не проверен" },
  { value: "Fixed", label: "Исправлен" },
  { value: "Approved", label: "Утвержден" },
  { value: "Revision", label: "Доработка" },
  { value: "Improved", label: "Доработан" },
  { value: "PartiallyRejected", label: "Отклонен (частично)" },
  { value: "Rejected", label: "Отклонен" },
];

const monthOptions = [
  { value: 1, label: "январь" },
  { value: 2, label: "февраль" },
  { value: 3, label: "март" },
  { value: 4, label: "апрель" },
  { value: 5, label: "май" },
  { value: 6, label: "июнь" },
  { value: 7, label: "июль" },
  { value: 8, label: "август" },
  { value: 9, label: "сентябрь" },
  { value: 10, label: "октябрь" },
  { value: 11, label: "ноябрь" },
  { value: 12, label: "декабрь" },
];

const startYear = 1900;
const endYear = 2100;
const yearOptions = Array.from({ length: endYear - startYear + 1 }, (_, i) => ({
  value: startYear + i,
  label: (startYear + i).toString(),
}));

const TableCustomerSettings: FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { id } = useParams<{ id: string }>();
  const {
    declineStartPeriodsOptions,
    selectedReportDelayOption,
    selectedStartPeriodOption,
    declineEndPeriodsOptions,
    selectedEndPeriodOption,
    showReportCheckTypes,
    acceptReviewReasons,
    reportDelaysOptions,
    reviewStatusesValue,
    regionRestriction,
    multiReviewReason,
    onlyPhotoAndGeo,
    reportsFromDate,
    clientSettings,
    fixByNextVisit,
    reviewHistory,
    visitSchedule,
    averageFacing,
    shareOfShelf,
    reviewStatus,
    hidePhotoGeo,
    periodOsa,
    customers,
    fixHours,
    reviewer,
    limit,
    pages,
    geo,
  } = useSelector((state: any) => state.roles.customerList);

  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);

  const numberOfDaysInMonth =
    reportsFromDate && getDaysInMonth(reportsFromDate[2], reportsFromDate[1]);

  const dayOptions = Array.from({ length: numberOfDaysInMonth }, (_, i) => ({
    value: i + 1,
    label: (i + 1).toString(),
  }));

  useEffect(() => {
    if (!clientSettings) {
      dispatch(actionGetClientSettings(id));
    }
  }, [clientSettings, dispatch, id]);

  useEffect(() => {
    if (!customers) {
      dispatch(actionGetCustomersList(limit, pages));
    }
  }, [customers, dispatch, limit, pages]);

  useEffect(() => {
    if (reviewStatusesValue) {
      setSelectedStatuses(reviewStatusesValue);
    }
  }, [reviewStatusesValue]);

  const handleChangeStatusCheckbox = (value: string) => {
    if (value === "" && !selectedStatuses.includes(value)) {
      setSelectedStatuses(reviewStatusesOptions.map((elem: any) => elem.value));
    } else if (value === "" && selectedStatuses.includes(value)) {
      setSelectedStatuses([]);
    } else if (value !== "" && selectedStatuses.includes(value)) {
      setSelectedStatuses(
        selectedStatuses.filter((status: string) => status !== value)
      );
    } else {
      setSelectedStatuses([...selectedStatuses, value]);
    }
  };

  return (
    <>
      <div className="loader__wrapper">{!customers && <Loader />}</div>
      <div className="settings__tables_block">
        <div className="client__settings_table">
          <span className="section__title">
            Настройка дат выгрузки отчетов и времени доступа
          </span>
          <div className="client__settings_filterBlock">
            <span>Показывать и выгружать отчеты начиная с</span>
            <div className="settings__filterBlock_children">
              <div className="settings__day_select">
                {reportsFromDate && (
                  <Select
                    defaultValue={dayOptions.find(
                      (elem: any) => elem.value === reportsFromDate[0]
                    )}
                    options={dayOptions}
                  />
                )}
              </div>
              <div className="settings__month_select">
                {reportsFromDate && (
                  <Select
                    defaultValue={monthOptions.find(
                      (elem: any) => elem.value === reportsFromDate[1]
                    )}
                    options={monthOptions}
                  />
                )}
              </div>
              <div className="settings__year_select">
                {reportsFromDate && (
                  <Select
                    defaultValue={yearOptions.find(
                      (elem: any) => elem.value === reportsFromDate[2]
                    )}
                    options={yearOptions}
                  />
                )}
              </div>
            </div>
          </div>
          <div className="client__settings_filterBlock">
            <span>Отчеты видны спустя</span>
            <div className="settings__filterBlock_column">
              {selectedReportDelayOption && (
                <Select
                  defaultValue={selectedReportDelayOption}
                  options={reportDelaysOptions}
                />
              )}
              <span>После их создания</span>
            </div>
          </div>
          <div className="client__settings_filterBlock">
            <span>Может отклонять отчеты</span>
            <div className="settings__filterBlock_children">
              <input type="checkbox" defaultChecked={reviewer} />
            </div>
          </div>
          <div className="client__settings_filterBlock">
            <span>Может отклонять через</span>
            <div className="settings__filterBlock_column">
              {selectedStartPeriodOption && (
                <Select
                  defaultValue={selectedStartPeriodOption}
                  options={declineStartPeriodsOptions}
                />
              )}
              <span>После их создания</span>
            </div>
          </div>
          <div className="client__settings_filterBlock">
            <span>Может отклонять в течении</span>
            <div className="settings__filterBlock_column">
              {selectedEndPeriodOption && (
                <Select
                  defaultValue={selectedEndPeriodOption}
                  options={declineEndPeriodsOptions}
                />
              )}
              <span>После разрешения</span>
            </div>
          </div>
          <div className="client__settings_filterBlock">
            <span>Может смотреть координаты</span>
            <div className="settings__filterBlock_children">
              <input type="checkbox" defaultChecked={geo} />
            </div>
          </div>
          <div className="client__settings_filterBlock">
            <span>Ограничение по регионам</span>
            <div className="settings__filterBlock_children">
              <input type="checkbox" defaultChecked={regionRestriction} />
            </div>
          </div>
          <div className="client__settings_filterBlock">
            <span>Ограничение по статусам</span>
            <div className="settings__filterBlock_column">
              {reviewStatusesOptions.map((elem: any, index: number) => (
                <div className="settings__statuses_elem" key={index}>
                  <input
                    onChange={() => handleChangeStatusCheckbox(elem.value)}
                    checked={selectedStatuses.includes(elem.value)}
                    type="checkbox"
                  />
                  <span>{elem.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="client__settings_table">
          <div className="client__settings_filterBlock">
            <span>Выбор типа проверки</span>
            <div className="settings__filterBlock_children">
              <input type="checkbox" defaultChecked={showReportCheckTypes} />
            </div>
          </div>
          <div className="client__settings_filterBlock">
            <span>Выбор критериев при принятии отчета</span>
            <div className="settings__filterBlock_children">
              <input type="checkbox" defaultChecked={acceptReviewReasons} />
            </div>
          </div>
          <div className="client__settings_filterBlock">
            <span>Просмотр графика визитов</span>
            <div className="settings__filterBlock_children">
              <input type="checkbox" defaultChecked={visitSchedule} />
            </div>
          </div>
          <div className="client__settings_filterBlock">
            <span>Показывать статус проверки отчетов</span>
            <div className="settings__filterBlock_children">
              <input type="checkbox" defaultChecked={reviewStatus} />
            </div>
          </div>
          <div className="client__settings_filterBlock">
            <span>Показывать историю изменения статуса проверки отчетов</span>
            <div className="settings__filterBlock_children">
              <input type="checkbox" defaultChecked={reviewHistory} />
            </div>
          </div>
          <div className="client__settings_filterBlock">
            <span>Скрыть данные, только фото и гео</span>
            <div className="settings__filterBlock_children">
              <input type="checkbox" defaultChecked={onlyPhotoAndGeo} />
            </div>
          </div>
          <div className="client__settings_filterBlock">
            <span>Количество часов на претензию</span>
            <div className="settings__filterBlock_children">
              <input
                className="settings__filterBlock_input"
                defaultValue={fixHours}
                type="number"
              />
            </div>
          </div>
          <div className="client__settings_filterBlock">
            <span>Срок исправления претензии до следующего визита</span>
            <div className="settings__filterBlock_children">
              <input type="checkbox" defaultChecked={fixByNextVisit} />
            </div>
          </div>
          <div className="client__settings_filterBlock">
            <span>Не показывать отчеты с фиолетовой гео</span>
            <div className="settings__filterBlock_children">
              <input type="checkbox" defaultChecked={hidePhotoGeo} />
            </div>
          </div>
          <div className="client__settings_filterBlock">
            <span>Множественный выбор причин для формирования претензии</span>
            <div className="settings__filterBlock_children">
              <input type="checkbox" defaultChecked={multiReviewReason} />
            </div>
          </div>
          <div className="client__settings_filterBlock">
            <span>OSA за период</span>
            <div className="settings__filterBlock_children">
              <input type="checkbox" defaultChecked={periodOsa} />
            </div>
          </div>
          <div className="client__settings_filterBlock">
            <span>Средний фейсинг за период</span>
            <div className="settings__filterBlock_children">
              <input type="checkbox" defaultChecked={averageFacing} />
            </div>
          </div>
          <div className="client__settings_filterBlock">
            <span>Доля полки</span>
            <div className="settings__filterBlock_children">
              <input type="checkbox" defaultChecked={shareOfShelf} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TableCustomerSettings;
