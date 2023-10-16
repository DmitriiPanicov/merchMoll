import { FC } from "react";

import TableReports from "../../../components/table/easymerch/TableReports";

import styles from "./reports.module.scss";

const Reports: FC = () => {
  return (
    <div className={styles.reports}>
      <TableReports />
    </div>
  );
};

export default Reports;
