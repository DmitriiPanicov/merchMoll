import { FC } from "react";

import TableExpiredReports from "../../../components/table/userReports/TableExpiredReports";

import styles from "./expiredReports.module.scss";

const ExpiredReports: FC = () => {
  return (
    <div className={styles.expired__reports_wrapper}>
      <TableExpiredReports />
    </div>
  );
};

export default ExpiredReports;
