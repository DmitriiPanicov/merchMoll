import { FC } from "react";
import { useSelector } from "react-redux";

import TableAdminUnloadingExcel from "../../../components/table/unloadings/TableAdminUnloadingExcel";
import TableUnloadingExcel from "../../../components/table/unloadings/TableUnloadingExcel";

import styles from "./unloadingExcel.module.scss";

const UnloadingExcel: FC = () => {
  const { data } = useSelector((state: any) => state.user.user);

  return (
    <div className={styles.wrapper}>
      {!data.isCustomer ? (
        <TableAdminUnloadingExcel />
      ) : (
        <TableUnloadingExcel />
      )}
    </div>
  );
};

export default UnloadingExcel;
