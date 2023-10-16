import { FC } from "react";

import Select from "../../custom/select/select";

import styles from "../headerBtn.module.scss";

const deliveryStatusesOptions = [
  { value: "OnTime", label: "Вовремя" },
  { value: "Expired", label: "Просрочен" },
  { value: "Manual", label: "Создан" },
];

interface IProps {
  setSelectedOption: any;
}

const UpdateDeliveryStatusSection: FC<IProps> = ({ setSelectedOption }) => {
  const handleSelecteChange = (event: any) => {
    setSelectedOption(event.value);
  };

  return (
    <div className={styles.block__info}>
      <div className={styles.limit__block}>
        <span>Статус:</span>
        <Select
          className={styles.photo__select}
          defaultValue={deliveryStatusesOptions[0]}
          propsChange={(event: any) => handleSelecteChange(event)}
          options={deliveryStatusesOptions}
        />
      </div>
    </div>
  );
};

export default UpdateDeliveryStatusSection;
