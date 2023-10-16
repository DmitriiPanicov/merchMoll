import { FC } from "react";
import { useSelector } from "react-redux";

import styles from "../headerBtn.module.scss";

interface IProps {
  content: any;
}

const ScheduleAddressInfoSection: FC<IProps> = ({ content }) => {
  const { scheduleData } = useSelector(
    (state: any) => state.userSingleReport.visitSchedule
  );

  const scheduleAddressRow = scheduleData?.find(
    (elem: any) => elem?.pos?.address === content
  );

  const currentDate = new Date().toISOString().split("T")[0];
  const todayData = scheduleAddressRow?.days?.find(
    (item: any) => item.date === currentDate
  );

  const options = [
    {
      label: "Адрес",
      value: `${scheduleAddressRow?.pos?.chain}, ${scheduleAddressRow?.pos?.address}`,
    },
    {
      label: "Время визита",
      value: todayData?.time ? todayData?.time?.slice(0, 5) : "ВХ.",
    },
    {
      label: "Мерчендайзер",
      value: `${
        scheduleAddressRow?.merch?.employee?.name
          ? scheduleAddressRow?.merch?.employee?.name
          : "Не указан"
      }`,
    },
    {
      label: "Супервайзер",
      value: `${
        scheduleAddressRow?.sv?.employee?.name
          ? scheduleAddressRow?.sv?.employee?.name
          : "Не указан"
      }, тел.: ${
        scheduleAddressRow?.sv?.phone
          ? scheduleAddressRow?.sv?.phone
          : "Не указан"
      }`,
    },
    {
      label: "Виртуальный супервайзер",
      value: `${
        scheduleAddressRow?.vsv?.employee?.name
          ? scheduleAddressRow?.vsv?.employee?.name
          : "Не указан"
      }, тел.: ${
        scheduleAddressRow?.vsv?.phone
          ? scheduleAddressRow?.vsv?.phone
          : "Не указан"
      }`,
    },
    {
      label: "Руководитель проекта",
      value: `${
        scheduleAddressRow?.pm?.employee?.name
          ? scheduleAddressRow?.pm?.employee?.name
          : "Не указан"
      }, тел.: ${
        scheduleAddressRow?.pm?.phone
          ? scheduleAddressRow?.pm?.phone
          : "Не указан"
      }`,
    },
  ];

  return (
    <div className={styles.addressInfo__modal_block}>
      <div className={styles.info__block}>
        {options.map((option, index) => (
          <div key={index} className={styles.info__row}>
            <span className={styles.bold__info_text}>{option.label}</span>
            <span className={styles.info__text}>{option.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScheduleAddressInfoSection;
