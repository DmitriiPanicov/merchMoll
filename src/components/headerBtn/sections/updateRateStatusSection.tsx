import { FC } from "react";

import Select from "../../custom/select/select";

import styles from "../headerBtn.module.scss";

interface IProps {
  setSelectedOption: any;
}

const statusOptions = [
  { value: "NotChecked", label: "Не проверен" },
  { value: "Declined", label: "Отклонен" },
  { value: "Accepted", label: "Принят" },
];

const UpdateRateStatusSection: FC<IProps> = ({ setSelectedOption }) => {
  const handleSelecteChange = (event: any) => {
    setSelectedOption(event.value);
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
    </div>
  );
};

export default UpdateRateStatusSection;
