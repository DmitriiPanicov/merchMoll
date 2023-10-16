import { FC, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast, { Toaster } from "react-hot-toast";

import clsx from "clsx";

import {
  reducerDeletedExpiredReports,
  reducerExpiredReportsInputValues,
  reducerExpiredReportsStatus,
} from "../../../redux/reducer/userReports/reducers/expiredReports";
import { actionGetExpiredReports } from "../../../redux/action/userReports/actionExpiredReports";
import { actionGetUserReportsFilter } from "../../../redux/action/userReports/actionUserReports";
import { generateStyles } from "../../../utils/generateToastStyles";
import { formatReports } from "../../../utils/formatReports";
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
    status: 204,
    purpose: "create",
    successMessage: "Отчеты успешно созданы!",
  },
  {
    status: 0,
    purpose: "create",
    errorMessage: "При создании отчетов произошла ошибка!",
  },
  {
    status: "noData",
    purpose: "create",
    errorMessage: "Выделите хотя бы одну запись в таблице!",
  },
  {
    status: 204,
    purpose: "delete",
    successMessage: "Выбранные отчеты успешно удалены!",
  },
  {
    status: 0,
    purpose: "delete",
    errorMessage: "При удалении отчетов произошла ошибка!",
  },
  {
    status: "noData",
    purpose: "delete",
    errorMessage: "Выделите хотя бы одну запись в таблице!",
  },
  {
    status: 204,
    purpose: "export",
    successMessage: `Отчет будет отправлен на почту ${userData?.email}, когда будет сформирован!`,
  },
  {
    status: 0,
    purpose: "export",
    errorMessage: "Ошибка загрузки файлов!",
  },
];

const employeeStatusesOptions = [
  { value: "", label: "Любой" },
  { value: "Active", label: "Активный" },
  { value: "OutSick", label: "Больничный" },
  { value: "Vacant", label: "Вакант" },
  { value: "LingeringVacant", label: "Долгий вакант" },
  { value: "Replacement", label: "Замена" },
  { value: "Unprofitable", label: "Нерентабельный" },
  { value: "DayOff", label: "Отгул" },
  { value: "Vacation", label: "Отпуск" },
];

const TableExpiredReports: FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const {
    expiredReportsInputValues,
    expiredReportsSettings,
    expiredReportsCount,
    formattedDateFrom,
    formattedDateTo,
    requestPurpose,
    checkboxes,
    reportsId,
    reports,
    status,
    limit,
    page,
  } = useSelector((state: any) => state.userReports.expiredReports);
  const {
    contractsOptions,
    projectOptions,
    chainsOptions,
    merchsOptions,
    svsOptions,
  } = useSelector((state: any) => state.userReports.userReports);
  const { data, isOpenSidebar } = useSelector((state: any) => state.user.user);

  const [isHeaderCheckboxChecked, setIsHeaderCheckboxChecked] =
    useState<boolean>(false);
  const [isCheckedRows, setIsCheckedRows] = useState<any>(checkboxes);
  const [isPending, setIsPending] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [startPage, setStartPage] = useState(1);

  const actualLimit =
    JSON.parse(localStorage.getItem("pageLimit") as string) || limit;

  useEffect(() => {
    dispatch(actionGetExpiredReports(actualLimit, page));
    dispatch(actionGetUserReportsFilter());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    requestStatusOptions.forEach((option) => {
      if (status === option.status && requestPurpose === option.purpose) {
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

    dispatch(reducerExpiredReportsStatus(null));
  }, [data, dispatch, requestPurpose, status]);

  useEffect(() => {
    if (reportsId && !reportsId.length) {
      setIsCheckedRows(reports && checkboxes);
      setIsHeaderCheckboxChecked(false);
    }
  }, [checkboxes, reports, reportsId]);

  useEffect(() => {
    const updatedCheckedRows =
      reports &&
      reports?.reduce((acc: any, report: any) => {
        acc[report.expiredReport.id] = isHeaderCheckboxChecked ? true : false;
        return acc;
      }, {});

    dispatch(reducerDeletedExpiredReports(formatReports(updatedCheckedRows)));
    setIsCheckedRows(updatedCheckedRows);
  }, [dispatch, isHeaderCheckboxChecked, reports]);

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

    const updatedDeletedReports = formatReports({
      ...isCheckedRows,
      [reportId]: !isCheckedRows[reportId],
    });

    dispatch(reducerDeletedExpiredReports(updatedDeletedReports));
  };

  const selectChange = (event: any, name: string) => {
    if (event.value === "") {
      const updatedInputValues = { ...expiredReportsInputValues };
      delete updatedInputValues[name];

      dispatch(reducerExpiredReportsInputValues(updatedInputValues));
    } else {
      dispatch(
        reducerExpiredReportsInputValues({
          ...expiredReportsInputValues,
          [name]: [event.value],
        })
      );
    }

    dispatch(actionGetExpiredReports(limit, page));
    resetPages();
  };

  const handleChange = (newLimit: number, newPage: number) => {
    setIsPending(true);
    dispatch(actionGetExpiredReports(newLimit, newPage)).then(() => {
      setIsPending(false);
    });
    localStorage.setItem("pageLimit", JSON.stringify(newLimit));
  };

  const handleChangeLimits = (option: any) => {
    handleChange(option.value, 1);
    resetPages();
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
        <div className="table__wrapper">
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
                {expiredReportsSettings.includes("date") && (
                  <th>
                    <div>
                      <RangeDatePicker
                        reducer={reducerExpiredReportsInputValues}
                        inputValues={expiredReportsInputValues}
                        defaultDateFrom={formattedDateFrom}
                        action={actionGetExpiredReports}
                        defaultDateTo={formattedDateTo}
                        setCurrentPage={setCurrentPage}
                        setStartPage={setStartPage}
                      />
                    </div>
                  </th>
                )}
                {expiredReportsSettings.includes("contract") && (
                  <th>
                    <div className="multiselect__filter_block">
                      <CustomMultiSelect
                        reducer={reducerExpiredReportsInputValues}
                        inputValues={expiredReportsInputValues}
                        action={actionGetExpiredReports}
                        options={contractsOptions}
                        pageName="expiredReports"
                        isShowPlaceholder={true}
                        resetPages={resetPages}
                        placeholder="Контракт"
                        name="contracts"
                        limit={limit}
                      />
                    </div>
                  </th>
                )}
                {expiredReportsSettings.includes("chain") && (
                  <th>
                    <div className="multiselect__filter_block">
                      <CustomMultiSelect
                        reducer={reducerExpiredReportsInputValues}
                        inputValues={expiredReportsInputValues}
                        action={actionGetExpiredReports}
                        pageName="expiredReports"
                        isShowPlaceholder={true}
                        resetPages={resetPages}
                        options={chainsOptions}
                        placeholder="Сеть"
                        limit={limit}
                        name="chains"
                      />
                    </div>
                  </th>
                )}
                {expiredReportsSettings.includes("address") && (
                  <th>
                    <div className="expired__address_block">Адрес</div>
                  </th>
                )}
                {expiredReportsSettings.includes("project") && (
                  <th>
                    <div className="multiselect__filter_block">
                      <CustomMultiSelect
                        reducer={reducerExpiredReportsInputValues}
                        inputValues={expiredReportsInputValues}
                        action={actionGetExpiredReports}
                        pageName="expiredReports"
                        options={projectOptions}
                        isShowPlaceholder={true}
                        resetPages={resetPages}
                        placeholder="Проект"
                        name="projects"
                        limit={limit}
                      />
                    </div>
                  </th>
                )}
                {expiredReportsSettings.includes("sv") && (
                  <th>
                    <div className="multiselect__filter_block">
                      <CustomMultiSelect
                        reducer={reducerExpiredReportsInputValues}
                        inputValues={expiredReportsInputValues}
                        action={actionGetExpiredReports}
                        placeholder="Супервайзер"
                        pageName="expiredReports"
                        isShowPlaceholder={true}
                        resetPages={resetPages}
                        options={svsOptions}
                        limit={limit}
                        name="svs"
                      />
                    </div>
                  </th>
                )}
                {expiredReportsSettings.includes("merch") && (
                  <th>
                    <div className="multiselect__filter_block">
                      <CustomMultiSelect
                        reducer={reducerExpiredReportsInputValues}
                        inputValues={expiredReportsInputValues}
                        action={actionGetExpiredReports}
                        placeholder="Мерчендайзер"
                        pageName="expiredReports"
                        isShowPlaceholder={true}
                        resetPages={resetPages}
                        options={merchsOptions}
                        limit={limit}
                        name="merchs"
                      />
                    </div>
                  </th>
                )}
                {expiredReportsSettings.includes("merchStatus") && (
                  <th>
                    <div className="filter__block">
                      <Select
                        defaultValue={
                          expiredReportsInputValues.statuses &&
                          expiredReportsInputValues.statuses.length &&
                          employeeStatusesOptions.find(
                            (option) =>
                              option.value ===
                              expiredReportsInputValues.statuses[0]
                          )
                        }
                        isShowPlaceholder={
                          !!expiredReportsInputValues.statuses?.length ||
                          expiredReportsInputValues.statuses === undefined
                        }
                        propsChange={(event: any) =>
                          selectChange(event, "statuses")
                        }
                        placeholder="Статус мерчендайзера"
                        options={employeeStatusesOptions}
                        className="users__filter"
                        name="statuses"
                      />
                    </div>
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {reports &&
                reports?.map((report: any, index: any) => {
                  return (
                    <tr key={index}>
                      <td>
                        <input
                          onChange={() =>
                            handleRowCheckboxChange(report.expiredReport.id)
                          }
                          checked={
                            (isCheckedRows &&
                              isCheckedRows[report.expiredReport.id]) ||
                            false
                          }
                          type="checkbox"
                        />
                      </td>
                      {expiredReportsSettings.includes("date") && (
                        <td>{report.date.split("-").reverse().join(".")}</td>
                      )}
                      {expiredReportsSettings.includes("contract") && (
                        <td>{report.contract}</td>
                      )}
                      {expiredReportsSettings.includes("chain") && (
                        <td>{report.pos.chain}</td>
                      )}
                      {expiredReportsSettings.includes("address") && (
                        <td>
                          {"г." + report.pos.city + ", " + report.pos.address}
                        </td>
                      )}
                      {expiredReportsSettings.includes("project") && (
                        <td>{report.project}</td>
                      )}
                      {expiredReportsSettings.includes("sv") && (
                        <td>
                          {report && report?.sv?.familyName}{" "}
                          {report && report?.sv?.givenName}{" "}
                          {report && report?.sv?.middleName}
                        </td>
                      )}
                      {expiredReportsSettings.includes("merch") && (
                        <td>{report.merch.login}</td>
                      )}
                      {expiredReportsSettings.includes("merchStatus") && (
                        <td>{Object.values(report.merch.status)}</td>
                      )}
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
        <div className="pagination">
          <div className="pagination__count">Всего: {expiredReportsCount}</div>
          <div className="pagination__str">
            <span>Отображать строки</span>
            <LimitSelect propsChange={handleChangeLimits} limit={actualLimit} />
          </div>
          <Pagination
            setCurrentPage={setCurrentPage}
            setStartPage={setStartPage}
            handleChange={handleChange}
            count={expiredReportsCount}
            currentPage={currentPage}
            pageName="userReports"
            startPage={startPage}
            limit={actualLimit}
          />
        </div>
      </div>
    </>
  );
};

export default TableExpiredReports;
