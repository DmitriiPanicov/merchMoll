import { FC, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerLocale } from "react-datepicker";
import toast, { Toaster } from "react-hot-toast";
import DatePicker from "react-datepicker";

import ru from "date-fns/locale/ru";
import moment from "moment";
import clsx from "clsx";

import {
  actionGetIntegrationErrors,
  actionSetIntegrationErrors,
} from "../../../redux/action/easymerch/actionIntegrationErrors";
import {
  reducerIntegrationErrorsInputValues,
  reducerIntegrationErrorsStatus,
} from "../../../redux/reducer/easymerch/reducers/reducerIntegrationErrors";
import { generateStyles } from "../../../utils/generateToastStyles";
import { getLabelByValue } from "../../../utils/getLabelByValue";
import { AppDispatch } from "../../../redux/reducer/store";

import CustomMultiSelect from "../../custom/customMultiSelect/customMultiSelect";
import LimitSelect from "../../custom/limitSelect/limitSelect";
import ToastPopup from "../../custom/toastPopup/toastPopup";
import Pagination from "../../pagination/pagination";
import Select from "../../custom/select/select";
import Loader from "../../custom/loader/loader";

import "react-datepicker/dist/react-datepicker.css";
import "../table.scss";

const IS_VISIBLE_SIDEBAR = process.env.REACT_APP_IS_VISIBLE_SIDEBAR;

const emVisitOptions = [
  { value: "", label: "Не указано" },
  { value: true, label: "Да" },
  { value: false, label: "Нет" },
];

const typesOptions = [
  { value: "", label: "Все" },
  { value: "Other", label: "Другое" },
  { value: "Report", label: "Отчет" },
  { value: "Pos", label: "Торговая точка" },
  { value: "Employee", label: "Физ. лицо" },
];

const typeOptionValues = [
  { value: "BadUser", label: "Физ. лицо" },
  { value: "BadPos", label: "Торговая точка" },
  { value: "WithoutCheckout", label: "Отчет" },
  { value: "NotMerchVisit", label: "Отчет" },
  { value: "UnknownServiceType", label: "Отчет" },
  { value: "NotMappedPos", label: "Отчет" },
  { value: "NotMappedUser", label: "Отчет" },
  { value: "MismatchEmployee", label: "Отчет" },
  { value: "MismatchContracts", label: "Отчет" },
  { value: "MismatchPos", label: "Отчет" },
  { value: "VisitNotFound", label: "Отчет" },
];

const TableIntegrationErrors: FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const {
    integrationErrorsInputValues,
    integrationErrorsCount,
    integrationErrors,
    contractOptions,
    projectOptions,
    merchsOptions,
    vsvOptions,
    svOptions,
    offset,
    status,
    limit,
  } = useSelector((state: any) => state.easymerch.integrationErrors);
  const { isOpenSidebar } = useSelector((state: any) => state.user.user);

  const [isInputChange, setIsInputChange] = useState<boolean>(false);
  const [isPending, setIsPending] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [startPage, setStartPage] = useState(1);
  const [selectedDate, setSelectedDate] = useState<any>(
    integrationErrorsInputValues.date &&
      new Date(integrationErrorsInputValues.date)
  );

  const actualLimit =
    JSON.parse(localStorage.getItem("pageLimit") as string) || limit;

  useEffect(() => {
    registerLocale("ru", ru);
    dispatch(actionGetIntegrationErrors(actualLimit, offset));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (status === 200) {
      toast.dismiss();
      toast(
        (t) => (
          <ToastPopup
            title="Ошибки интеграции успешно выгружены!"
            isSuccess={true}
            toast={toast}
            t={t}
          />
        ),
        generateStyles(true)
      );
    } else if (status === 0) {
      toast.dismiss();
      toast(
        (t) => (
          <ToastPopup
            title="При выгрузке произошла ошибка!"
            isSuccess={false}
            toast={toast}
            t={t}
          />
        ),
        generateStyles()
      );
    }

    dispatch(reducerIntegrationErrorsStatus(null));
  }, [dispatch, status]);

  useEffect(() => {
    const handleDocumentClick = () => {
      dispatch(actionGetIntegrationErrors(limit, 0));
      setIsInputChange(false);
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
  }, [dispatch, isInputChange, limit]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    dispatch(
      reducerIntegrationErrorsInputValues({
        ...integrationErrorsInputValues,
        [name]: value,
      })
    );

    setIsInputChange(true);
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      dispatch(actionGetIntegrationErrors(limit, offset));
      setIsInputChange(false);
    }
  };

  const handleTypesSelectChange = (event: any, name: string) => {
    const selectedValue = event?.value;

    dispatch(
      reducerIntegrationErrorsInputValues({
        ...integrationErrorsInputValues,
        [name]: !selectedValue ? [] : [selectedValue],
      })
    );

    dispatch(actionGetIntegrationErrors(limit, offset));
    setIsInputChange(false);
  };

  const handleIsSingleTripSelectChange = (event: any, name: string) => {
    const selectedValue = event?.value;
    const selectedName = event?.label;

    dispatch(
      reducerIntegrationErrorsInputValues({
        ...integrationErrorsInputValues,
        [name]: selectedValue,
      })
    );

    dispatch(
      actionSetIntegrationErrors(
        {
          ...integrationErrorsInputValues,
          [name]: selectedValue,
        },
        limit,
        offset,
        selectedName
      )
    );

    setIsInputChange(false);
  };

  const handleDatePickerChange = (date: any) => {
    setSelectedDate(date);

    const formattedDate = moment(date).format("YYYY-MM-DD");

    dispatch(
      reducerIntegrationErrorsInputValues({
        ...integrationErrorsInputValues,
        date: formattedDate,
      })
    );

    dispatch(actionGetIntegrationErrors(limit, offset));
    setIsInputChange(false);
  };

  const handleDateKeyDown = (event: any) => {
    event.preventDefault();
  };

  const handleClearDate = () => {
    if (selectedDate) {
      setSelectedDate(null);

      dispatch(
        reducerIntegrationErrorsInputValues({
          ...integrationErrorsInputValues,
          date: "",
        })
      );

      dispatch(actionGetIntegrationErrors(limit, offset));
      setIsInputChange(false);
    }
  };

  const handleChange = (newLimit: number, newOffset: number) => {
    setIsPending(true);
    dispatch(actionGetIntegrationErrors(newLimit, newOffset)).then(() => {
      setIsPending(false);
    });
    localStorage.setItem("pageLimit", JSON.stringify(newLimit));
  };

  const handleChangeLimits = (option: any) => {
    handleChange(option.value, 0);
    setCurrentPage(1);
    setStartPage(1);
  };

  const renderTableRow = (integrationError: any, index: number) => {
    const {
      isSingleTrip,
      description,
      visitDate,
      personId,
      contract,
      visitNo,
      address,
      project,
      userId,
      merch,
      type,
      vsv,
      sv,
    } = integrationError;

    const formattedDate = visitDate?.split("-")?.reverse()?.join(".");

    return (
      <tr key={index}>
        <td>{formattedDate}</td>
        <td>{getLabelByValue(type, typeOptionValues)}</td>
        <td>{description}</td>
        <td>{visitNo}</td>
        <td>{address}</td>
        <td>{contract?.name}</td>
        <td>{project?.name}</td>
        <td>{merch?.name}</td>
        <td>{sv?.name}</td>
        <td>{vsv?.name}</td>
        <td>{personId}</td>
        <td>{userId}</td>
        <td>{!isSingleTrip ? "Нет" : "Да"}</td>
      </tr>
    );
  };

  return (
    <>
      <div className="loader__wrapper">
        {(!integrationErrors || isPending) && <Loader />}
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
                <th>
                  <div className="filter__data_picker">
                    <DatePicker
                      onChange={handleDatePickerChange}
                      onKeyDown={handleDateKeyDown}
                      placeholderText="Дата Визита"
                      selected={selectedDate}
                      dateFormat="dd.MM.yyyy"
                      autoComplete="off"
                      locale="ru"
                      name="date"
                    />
                    {selectedDate && (
                      <div className="clear__icon" onClick={handleClearDate} />
                    )}
                  </div>
                </th>
                <th>
                  <div className="filter__block">
                    <Select
                      defaultValue={
                        integrationErrorsInputValues.types &&
                        integrationErrorsInputValues.types.length &&
                        typesOptions.find(
                          (option: any) =>
                            option.value ===
                            integrationErrorsInputValues.types[0]
                        )
                      }
                      propsChange={(event: any) =>
                        handleTypesSelectChange(event, "types")
                      }
                      isShowPlaceholder={
                        integrationErrorsInputValues.types !== null
                      }
                      className="users__filter"
                      options={typesOptions}
                      placeholder="Тип"
                      name="types"
                    />
                  </div>
                </th>
                <th>
                  <div className="filter__block">
                    <input
                      defaultValue={
                        integrationErrorsInputValues.description &&
                        integrationErrorsInputValues.description
                      }
                      onChange={handleInputChange}
                      onKeyPress={handleKeyPress}
                      placeholder=" "
                      name="description"
                      type="text"
                    />
                    <label>Описание</label>
                  </div>
                </th>
                <th>
                  <div className="filter__block">
                    <input
                      defaultValue={
                        integrationErrorsInputValues.visitNo &&
                        integrationErrorsInputValues.visitNo
                      }
                      onChange={handleInputChange}
                      onKeyPress={handleKeyPress}
                      placeholder=" "
                      name="visitNo"
                      type="text"
                    />
                    <label>ID Визита</label>
                  </div>
                </th>
                <th>
                  <div className="filter__block">
                    <input
                      defaultValue={
                        integrationErrorsInputValues.address &&
                        integrationErrorsInputValues.address
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
                <th>
                  <div className="multiselect__filter_block">
                    <CustomMultiSelect
                      reducer={reducerIntegrationErrorsInputValues}
                      inputValues={integrationErrorsInputValues}
                      action={actionGetIntegrationErrors}
                      pageName="integrationErrors"
                      options={contractOptions}
                      isShowPlaceholder={true}
                      placeholder="Контракт*"
                      name="contracts"
                      offset={offset}
                      limit={limit}
                    />
                  </div>
                </th>
                <th>
                  <div className="multiselect__filter_block">
                    <CustomMultiSelect
                      reducer={reducerIntegrationErrorsInputValues}
                      inputValues={integrationErrorsInputValues}
                      action={actionGetIntegrationErrors}
                      pageName="integrationErrors"
                      isShowPlaceholder={true}
                      options={projectOptions}
                      placeholder="Проект*"
                      offset={offset}
                      name="projects"
                      limit={limit}
                    />
                  </div>
                </th>
                <th>
                  <div className="multiselect__filter_block">
                    <CustomMultiSelect
                      reducer={reducerIntegrationErrorsInputValues}
                      inputValues={integrationErrorsInputValues}
                      action={actionGetIntegrationErrors}
                      pageName="integrationErrors"
                      placeholder="Мерчендайзер*"
                      isShowPlaceholder={true}
                      options={merchsOptions}
                      offset={offset}
                      limit={limit}
                      name="merchs"
                    />
                  </div>
                </th>
                <th>
                  <div className="multiselect__filter_block">
                    <CustomMultiSelect
                      reducer={reducerIntegrationErrorsInputValues}
                      inputValues={integrationErrorsInputValues}
                      action={actionGetIntegrationErrors}
                      pageName="integrationErrors"
                      placeholder="Супервайзер*"
                      isShowPlaceholder={true}
                      options={svOptions}
                      offset={offset}
                      limit={limit}
                      name="sv"
                    />
                  </div>
                </th>
                <th>
                  <div className="multiselect__filter_block">
                    <CustomMultiSelect
                      reducer={reducerIntegrationErrorsInputValues}
                      inputValues={integrationErrorsInputValues}
                      action={actionGetIntegrationErrors}
                      pageName="integrationErrors"
                      isShowPlaceholder={true}
                      options={vsvOptions}
                      placeholder="ВСВ*"
                      offset={offset}
                      limit={limit}
                      name="vsv"
                    />
                  </div>
                </th>
                <th>
                  <div className="filter__block">
                    <input
                      defaultValue={
                        integrationErrorsInputValues.personId &&
                        integrationErrorsInputValues.personId
                      }
                      onChange={handleInputChange}
                      onKeyPress={handleKeyPress}
                      placeholder=" "
                      name="personId"
                      type="text"
                    />
                    <label>ID EM</label>
                  </div>
                </th>
                <th>
                  <div className="filter__block">
                    <input
                      defaultValue={
                        integrationErrorsInputValues.userId &&
                        integrationErrorsInputValues.userId
                      }
                      onChange={handleInputChange}
                      onKeyPress={handleKeyPress}
                      placeholder=" "
                      name="userId"
                      type="text"
                    />
                    <label>ID физ. лица</label>
                  </div>
                </th>
                <th>
                  <div className="filter__block">
                    <Select
                      defaultValue={emVisitOptions.find(
                        (option: any) =>
                          option.value ===
                          integrationErrorsInputValues?.singleTrip
                      )}
                      propsChange={(event: any) =>
                        handleIsSingleTripSelectChange(event, "singleTrip")
                      }
                      isShowPlaceholder={
                        integrationErrorsInputValues?.singleTrip !== undefined
                      }
                      placeholder="Внеплановый визит"
                      className="users__filter"
                      options={emVisitOptions}
                      name="singleTrip"
                    />
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {integrationErrors && integrationErrors.map(renderTableRow)}
            </tbody>
          </table>
        </div>
        <div className="pagination">
          <div className="pagination__count">
            Всего: {integrationErrorsCount}
          </div>
          <div className="pagination__str">
            <span>Отображать строки</span>
            <LimitSelect limit={actualLimit} propsChange={handleChangeLimits} />
          </div>
          <Pagination
            setCurrentPage={setCurrentPage}
            count={integrationErrorsCount}
            setStartPage={setStartPage}
            handleChange={handleChange}
            currentPage={currentPage}
            startPage={startPage}
            limit={actualLimit}
          />
        </div>
      </div>
    </>
  );
};

export default TableIntegrationErrors;
