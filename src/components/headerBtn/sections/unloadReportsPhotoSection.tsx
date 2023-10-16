import { FC, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { actionGetUnloadReportsPhotoFilter } from "../../../redux/action/userReports/actionUserReports";
import { AppDispatch } from "../../../redux/reducer/store";

import CustomMultiSelect from "../../custom/customMultiSelect/customMultiSelect";
import Select from "../../custom/select/select";

import styles from "../headerBtn.module.scss";

interface IUnloadReportsPhotoSectionProps {
  setSelectedCustomServices: any;
  handleChangeLimitInput: any;
  setSelectedActions: any;
  error: string;
}

const selectOptions = [
  { value: "unloadAllPhotos", label: "Выгрузить все фото из списка" },
  { value: "unloadWithoutReports", label: "Выгрузить фото выбранных отчетов" },
  { value: "unloadAdditionPhoto", label: "Выгрузить фото доп. услуги" },
  { value: "unloadActionPhoto", label: "Выгрузить фото по акции" },
];

const UnloadReportsPhotoSection: FC<IUnloadReportsPhotoSectionProps> = ({
  setSelectedCustomServices,
  handleChangeLimitInput,
  setSelectedActions,
  error,
}) => {
  const dispatch = useDispatch<AppDispatch>();

  const { reportsInputValues, actionOptions, customServicesOptions } =
    useSelector((state: any) => state.userReports.userReports);

  const [selectedOption, setSelectedOption] = useState<any>(
    selectOptions[0].value
  );

  useEffect(() => {
    if (
      reportsInputValues &&
      reportsInputValues?.contracts?.length === 1 &&
      (selectedOption === "unloadAdditionPhoto" ||
        selectedOption === "unloadActionPhoto")
    ) {
      dispatch(
        actionGetUnloadReportsPhotoFilter(reportsInputValues.contracts[0])
      );
    }
  }, [dispatch, reportsInputValues, selectedOption]);

  const selectChange = (event: any) => {
    setSelectedOption(event.value);
  };

  return (
    <div className={styles.block__info}>
      <div className={styles.limit__block}>
        <span>Что выгружать:</span>
        <Select
          className={styles.photo__select}
          defaultValue={selectOptions[0]}
          propsChange={(event: any) => selectChange(event)}
          options={selectOptions}
        />
      </div>
      {selectedOption === "unloadAdditionPhoto" &&
        reportsInputValues &&
        (!reportsInputValues?.contracts?.length ||
          reportsInputValues?.contracts?.length > 1) && (
          <div className={styles.limit__block}>
            <span className={styles.long__title}>Доп. услуги:</span>
            <div className={styles.choose__contract_block}>
              <span>Выберите 1 контракт</span>
            </div>
          </div>
        )}
      {selectedOption === "unloadActionPhoto" &&
        reportsInputValues &&
        (!reportsInputValues?.contracts?.length ||
          reportsInputValues?.contracts?.length > 1) && (
          <div className={styles.limit__block}>
            <span className={styles.long__title}>Акции:</span>
            <div className={styles.choose__contract_block}>
              <span>Выберите 1 контракт</span>
            </div>
          </div>
        )}
      {selectedOption === "unloadAdditionPhoto" &&
        reportsInputValues &&
        reportsInputValues?.contracts?.length === 1 && (
          <div className={styles.limit__multi_block}>
            <span className={styles.long__title}>Доп. услуги:</span>
            <div className={styles.multiselect__block}>
              <CustomMultiSelect
                setState={setSelectedCustomServices}
                pageName="unloadReportsPhotosModal"
                options={customServicesOptions}
                placeholder="Доп. услуги"
                name="customService"
              />
            </div>
          </div>
        )}
      {selectedOption === "unloadActionPhoto" &&
        reportsInputValues &&
        reportsInputValues?.contracts?.length === 1 && (
          <div className={styles.limit__multi_block}>
            <span className={styles.long__title}>Акции:</span>
            <div className={styles.multiselect__block}>
              <CustomMultiSelect
                pageName="unloadReportsPhotosModal"
                setState={setSelectedActions}
                options={actionOptions}
                placeholder="Акции"
                name="actions"
              />
            </div>
          </div>
        )}
      <div className={styles.limit__block}>
        <span>Лимит отчетов для выгрузки(10000max):</span>
        <div className={styles.error__input_block}>
          <input
            type="number"
            className={error ? styles.error__input : styles.limit__input}
            onChange={(event) => handleChangeLimitInput(event)}
          />
          {error && <span className={styles.error}>{error}</span>}
        </div>
      </div>
    </div>
  );
};

export default UnloadReportsPhotoSection;
