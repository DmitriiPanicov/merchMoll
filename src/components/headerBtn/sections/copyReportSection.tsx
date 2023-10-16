import { FC, useEffect } from "react";
import { registerLocale } from "react-datepicker";
import DatePicker from "react-datepicker";

import ru from "date-fns/locale/ru";

import "react-datepicker/dist/react-datepicker.css";
import styles from "../headerBtn.module.scss";

interface ICopyReportProps {
  selectedDate: any;
  setSelectedDate: any;
}

const CopyReportSection: FC<ICopyReportProps> = ({
  setSelectedDate,
  selectedDate,
}) => {
  useEffect(() => {
    registerLocale("ru", ru);
  }, []);

  const handleDatePickerChange = (date: any) => {
    setSelectedDate(date);
  };

  const handleClearDate = () => {
    if (selectedDate) {
      setSelectedDate(null);
    }
  };

  return (
    <div className={styles.copy__block}>
      <span className={styles.copy__report_title}>Дата копирования:</span>
      <div className={styles.copy__data_picker}>
        <DatePicker
          dateFormat="dd.MM.yyyy"
          placeholderText="Выберите дату"
          selected={!selectedDate ? new Date() : selectedDate}
          locale={ru}
          name="date"
          onChange={handleDatePickerChange}
        />
        {selectedDate && (
          <div className={styles.clear__date_icon} onClick={handleClearDate} />
        )}
      </div>
    </div>
  );
};

export default CopyReportSection;
