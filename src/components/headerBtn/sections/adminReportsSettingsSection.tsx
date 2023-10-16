import { FC } from "react";

import styles from "../headerBtn.module.scss";

interface IProps {
  setSelectedReportsSettings: any;
  selectedReportsSettings: any;
  isCheckedFullInfo: boolean;
  setIsCheckedFullInfo: any;
}

const options = [
  { value: "reportId", label: "№ отчета" },
  { value: "date", label: "Дата" },
  { value: "review", label: "Проверка" },
  { value: "delivery", label: "Статус доставки" },
  { value: "rate", label: "Оценка" },
  { value: "geo", label: "Гео" },
  { value: "photo", label: "Фото" },
  { value: "contract", label: "Контракт" },
  { value: "chain", label: "Сеть" },
  { value: "region", label: "Регион" },
  { value: "address", label: "Адрес" },
  { value: "project", label: "Проект" },
  { value: "sv", label: "Супервайзер" },
  { value: "vsv", label: "Виртуальный супервайзер" },
  { value: "merch", label: "Мерчендайзер" },
  { value: "clientId", label: "ID ТТ клиента" },
];

const AdminReportsSettingsSection: FC<IProps> = ({
  setSelectedReportsSettings,
  selectedReportsSettings,
  setIsCheckedFullInfo,
  isCheckedFullInfo,
}) => {
  const handleChangeCheckbox = (name: string) => {
    const updatedSettings = selectedReportsSettings.includes(name)
      ? selectedReportsSettings.filter((elem: any) => elem !== name)
      : [...selectedReportsSettings, name];

    setSelectedReportsSettings(updatedSettings);
    setIsCheckedFullInfo(false);
  };

  const handleChangeFullInfoCheckbox = () => {
    if (!isCheckedFullInfo) {
      const allSettings = options.map((option) => option.value);
      setSelectedReportsSettings(allSettings);
    } else {
      setSelectedReportsSettings([]);
    }
    setIsCheckedFullInfo(!isCheckedFullInfo);
  };

  return (
    <div className={styles.settings__block_info}>
      <div className={styles.check__list_block}>
        {options.map((option) => (
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

export default AdminReportsSettingsSection;
