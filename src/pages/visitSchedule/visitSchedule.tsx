import { FC } from "react";

import TableVisitSchedule from "../../components/table/visitSchedule/TableVisitSchedule";

import styles from "./visitSchedule.module.scss";

const VisitSchedule: FC = () => {
  return (
    <div className={styles.visit__schedule_wrapper}>
      <TableVisitSchedule />
    </div>
  );
};

export default VisitSchedule;
