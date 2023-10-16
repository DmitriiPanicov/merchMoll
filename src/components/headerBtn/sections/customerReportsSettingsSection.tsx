import { FC } from "react";
import { useSelector } from "react-redux";

import styles from "../headerBtn.module.scss";

interface IProps {
  setSelectedReportsSettings: any;
  selectedReportsSettings: any;
  isCheckedFullInfo: boolean;
  setIsCheckedFullInfo: any;
}

const CustomerReportsSettingsSection: FC<IProps> = ({
  setSelectedReportsSettings,
  selectedReportsSettings,
  setIsCheckedFullInfo,
  isCheckedFullInfo,
}) => {
  const { data, contractsLength } = useSelector(
    (state: any) => state.user.user
  );

  const options = [
    { value: "reportId", label: "№ отчета" },
    { value: "date", label: "Дата" },
    { value: "region", label: "Регион" },
    { value: "chain", label: "Сеть" },
    { value: "address", label: "Адрес" },
    { value: "rate", label: "Оценка" },
    data &&
      data.settings.showReportCheckTypes && {
        value: "checkTypes",
        label: "Тип проверки",
      },
    { value: "fixDate", label: "Дата исправления" },
    data &&
      data.settings.reviewStatus && { value: "review", label: "Проверка" },
    data &&
      contractsLength >= 2 && {
        value: "contract",
        label: "Контракт",
      },
    { value: "project", label: "Проект" },
    { value: "sv", label: "Супервайзер" },
    { value: "merch", label: "Мерчендайзер" },
    { value: "responsible", label: "Ответственный" },
    { value: "clientId", label: "ID ТТ клиента" },
  ];

  const handleChangeCheckbox = (name: string) => {
    if (selectedReportsSettings.includes(name)) {
      const updatedSettings = selectedReportsSettings.filter(
        (elem: any) => elem !== name
      );

      setSelectedReportsSettings(updatedSettings);
      setIsCheckedFullInfo(false);
    } else {
      const updatedSettings = [...selectedReportsSettings, name];

      setSelectedReportsSettings(updatedSettings);
      setIsCheckedFullInfo(false);
    }
  };

  const handleChangeFullInfoCheckbox = () => {
    if (!isCheckedFullInfo) {
      setSelectedReportsSettings([
        "reportId",
        "date",
        "region",
        "chain",
        "address",
        "rate",
        "checkTypes",
        "fixDate",
        "review",
        "contract",
        "project",
        "sv",
        "merch",
        "responsible",
        "clientId",
      ]);
    } else {
      setSelectedReportsSettings([]);
    }
    setIsCheckedFullInfo(!isCheckedFullInfo);
  };

  return (
    <div className={styles.settings__block_info}>
      <div className={styles.check__list_block}>
        {options
          ?.filter((option: any) => option)
          .map((option) => (
            <div key={option.value} className={styles.check__list_elem}>
              <label className={styles.checkbox__container}>
                <input
                  checked={selectedReportsSettings.includes(option.value)}
                  type="checkbox"
                  onChange={() => handleChangeCheckbox(option.value)}
                />
                <span className={styles.multi__reason_checkmark}></span>
              </label>
              {option.label}
            </div>
          ))}
        <div className={styles.check__list_elem}>
          <label className={styles.checkbox__container}>
            <input
              type={"checkbox"}
              onChange={handleChangeFullInfoCheckbox}
              checked={isCheckedFullInfo}
            />
            <span className={styles.multi__reason_checkmark}></span>
          </label>
          Все
        </div>
      </div>
    </div>
  );
};

export default CustomerReportsSettingsSection;
