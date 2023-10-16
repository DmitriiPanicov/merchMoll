import { FC } from "react";

import TableTunderSignals from "../../components/table/userSingleReport/TableTunderSignals";

import styles from "./singleReportTunderSignals.module.scss";

const SingleReportTunderSignals: FC = () => {
  return (
    <div className={styles.report}>
      <TableTunderSignals />
    </div>
  );
};

export default SingleReportTunderSignals;
