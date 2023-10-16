import { FC, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { actionGetCriteriasList } from "../../../redux/action/userSingleReport/actionUserSingleReport";
import { AppDispatch } from "../../../redux/reducer/store";

import Select from "../../custom/select/select";

import styles from "../headerBtn.module.scss";

interface IProps {
  setReviewReasonError: any;
  setSelectedOption: any;
  setSelectedReason: any;
  reviewReasonError: any;
}

const statusOptions = [
  { value: "NotChecked", label: "Не проверен" },
  { value: "Revision", label: "Доработка" },
  { value: "Rejected", label: "Отклонен" },
  { value: "Approved", label: "Утвержден" },
];

const UpdateReviewStatusSection: FC<IProps> = ({
  setReviewReasonError,
  setSelectedOption,
  setSelectedReason,
  reviewReasonError,
}) => {
  const dispatch = useDispatch<AppDispatch>();

  const { reportsInputValues } = useSelector(
    (state: any) => state.userReports.userReports
  );
  const { list } = useSelector(
    (state: any) => state.userSingleReport.userSingleReport
  );

  useEffect(() => {
    dispatch(actionGetCriteriasList(reportsInputValues.contracts[0]));
  }, [dispatch, reportsInputValues.contracts]);

  const handleSelecteChange = (event: any) => {
    setSelectedOption(event.value);
  };

  const handleReasonSelectChange = (event: any) => {
    setSelectedReason(event.value);
    setReviewReasonError("");
  };

  return (
    <div className={styles.block__info}>
      <div className={styles.limit__block}>
        <span>Статус:</span>
        <Select
          className={styles.photo__select}
          defaultValue={statusOptions[0]}
          propsChange={(event: any) => handleSelecteChange(event)}
          options={statusOptions}
        />
      </div>
      <div className={styles.limit__block}>
        <span>Причина:</span>
        <div className={styles.error__reason_block}>
          <Select
            className={
              reviewReasonError
                ? styles.error__reason_select
                : styles.photo__select
            }
            propsChange={(event: any) => handleReasonSelectChange(event)}
            placeholder="Выберите причину"
            options={
              list &&
              list?.map((item: any) => {
                return {
                  value: item?.reason?.id,
                  label: item?.reason?.name,
                };
              })
            }
          />
          {reviewReasonError && (
            <span className={styles.error}>{reviewReasonError}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default UpdateReviewStatusSection;
