import { FC } from "react";

import TableAdminUnloadingTables from "../../../components/table/unloadings/TableAdminUnloadingTables";

import styles from "./unloadingTables.module.scss";

const UnloadingTables: FC = () => {
  return (
    <div className={styles.wrapper}>
      <TableAdminUnloadingTables />
    </div>
  );
};

export default UnloadingTables;
