import { FC } from "react";

import TableSignals from "../../../components/table/tunder/TableSignals";

import styles from "./signals.module.scss";

const Signals: FC = () => {
  return (
    <div className={styles.signals}>
      <TableSignals />
    </div>
  );
};

export default Signals;
