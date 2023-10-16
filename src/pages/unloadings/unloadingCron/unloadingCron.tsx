import { FC } from "react";

import TableAdminUnloadingCron from "../../../components/table/unloadings/TableAdminUnloadingCron";

import styles from "./unloadingCron.module.scss";

const UnloadingCron: FC = () => {
  return (
    <div className={styles.wrapper}>
      <TableAdminUnloadingCron />
    </div>
  );
};

export default UnloadingCron;
