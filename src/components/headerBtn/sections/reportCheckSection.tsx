import { FC, useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { calculateProgress } from "../../../utils/calculateUploadingProgress";

import Select from "../../custom/select/select";

import styles from "../headerBtn.module.scss";

interface IReportCheckSectionProps {
  setSelectedReportCheckReasons: any;
  selectedReportCheckReasons: any;
  setSelectedCheckTypeOption: any;
  setReportCheckCommentValue: any;
  setSelectedActionOption: any;
  selectedActionOption: string;
  setSelectedFiles: any;
  handleFileChange: any;
  selectedFiles: any;
  setIsError: any;
  isError: any;
}

const actionOptions = [
  { value: "acceptReport", label: "Принять отчет" },
  { value: "formClaim", label: "Сформировать претензию" },
  { value: "formRecommendation", label: "Сформировать рекомендацию" },
];

const checkTypeOptions = [
  { value: "AUDIT", label: "Аудит в ТТ" },
  { value: "DISTANCE", label: "Дистанционная проверка" },
];

const ReportCheckSection: FC<IReportCheckSectionProps> = ({
  setSelectedReportCheckReasons,
  selectedReportCheckReasons,
  setSelectedCheckTypeOption,
  setReportCheckCommentValue,
  setSelectedActionOption,
  selectedActionOption,
  handleFileChange,
  setSelectedFiles,
  selectedFiles,
  setIsError,
  isError,
}) => {
  const { data } = useSelector((state: any) => state.user.user);
  const { list } = useSelector(
    (state: any) => state.userSingleReport.userSingleReport
  );

  const [uploadProgress, setUploadProgress] = useState<number[]>([]);

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

  const handleChangeActionSelect = (event: any) => {
    setSelectedActionOption(event.value);
    setSelectedReportCheckReasons([]);
    setIsError("");
  };

  const handleChangeReasonSelect = (event: any) => {
    const selectedValue = event.target.value;

    if (data && data?.settings.multiReviewReason) {
      if (selectedReportCheckReasons.includes(selectedValue)) {
        setSelectedReportCheckReasons(
          selectedReportCheckReasons.filter(
            (reason: any) => reason !== selectedValue
          )
        );
      } else {
        setSelectedReportCheckReasons([
          ...selectedReportCheckReasons,
          selectedValue,
        ]);
      }
    } else {
      setSelectedReportCheckReasons([selectedValue]);
    }

    setIsError("");
  };

  const handleChangeTypeCheckSelect = (event: any) => {
    setSelectedCheckTypeOption(event.value);
  };

  return (
    <>
      <div className={styles.block__info}>
        {isError === "reasons" && (
          <div className={styles.reasons__error_block}>
            <span>Вы должны указать причины.</span>
          </div>
        )}
        <div className={styles.report__check_block}>
          <span>Действие:</span>
          <Select
            propsChange={handleChangeActionSelect}
            className={styles.photo__select}
            defaultValue={actionOptions[0]}
            options={actionOptions}
          />
        </div>
        {data && data.settings.showReportCheckTypes && (
          <div className={styles.report__check_block}>
            <span>Тип проверки:</span>
            <Select
              propsChange={handleChangeTypeCheckSelect}
              defaultValue={checkTypeOptions[0]}
              className={styles.photo__select}
              options={checkTypeOptions}
            />
          </div>
        )}
        {selectedActionOption === "acceptReport" && (
          <>
            {data && data?.settings?.acceptReviewReasons && (
              <>
                <div className={styles.report__textarea_block}>
                  <span>Комментарий:</span>
                  <textarea
                    className={styles.textfield}
                    onChange={(event: any) => {
                      setReportCheckCommentValue(event.target.value);
                    }}
                  />
                </div>
              </>
            )}
          </>
        )}
        {(selectedActionOption === "formClaim" ||
          selectedActionOption === "formRecommendation") && (
          <>
            <div className={styles.report__textarea_block}>
              <span
                className={isError === "notes" ? styles.error__message : ""}
              >
                Что исправить:
              </span>
              <div className={styles.error__textfield_block}>
                <textarea
                  className={
                    isError === "notes"
                      ? styles.error__textfield
                      : styles.textfield
                  }
                  onChange={(event: any) => {
                    setReportCheckCommentValue(event.target.value);
                    setIsError("");
                  }}
                />
                {isError === "notes" && (
                  <span className={styles.error__message}>
                    Вы должны заполнить поле: "Что исправить".
                  </span>
                )}
              </div>
            </div>
          </>
        )}
        <div className={styles.reasons__list_block}>
          {list &&
            list
              ?.filter((elem: any) => elem.clientCheck)
              ?.map((item: any, index: number) => (
                <div key={index} className={styles.check__list_elem}>
                  <label className={styles.checkbox__container}>
                    <input
                      type={
                        data && data.settings.multiReviewReason
                          ? "checkbox"
                          : "radio"
                      }
                      value={item.reason.id}
                      onChange={handleChangeReasonSelect}
                      checked={selectedReportCheckReasons.includes(
                        item.reason.id.toString()
                      )}
                    />
                    <span
                      className={
                        data && data.settings.multiReviewReason
                          ? styles.multi__reason_checkmark
                          : styles.checkmark
                      }
                    ></span>
                  </label>
                  {item.reason.name}
                </div>
              ))}
        </div>
      </div>
      <div className={styles.reportCheck__file_block}>
        <input
          className="download__file_input"
          onChange={handleFileChange}
          placeholder="Загрузить"
          type="file"
          name="outletsfiles"
          id="outletsfiles"
        />
        <label
          htmlFor="outletsfiles"
          className={styles.reportCheck__file_label}
        >
          Добавить файлы
        </label>
        <div className={styles.file__list}>
          {selectedFiles.map((file: File, index: number) => {
            const fileSize = (file.size / (1024 * 1024)).toFixed(2);
            const progress = uploadProgress[index] || 0;

            return (
              <div key={index} className={styles.reportCheck__list_elem}>
                <div className={styles.file__list_dot}></div>
                <span className={styles.file__name}>{file.name}</span>
                <span>
                  {progress.toFixed(0)}% от {fileSize} MB
                </span>
                <span
                  className={styles.cancel__file_btn}
                  onClick={() =>
                    setSelectedFiles(
                      selectedFiles.filter(
                        (elem: any) => elem.name !== file.name
                      )
                    )
                  }
                >
                  Отменить
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default ReportCheckSection;
