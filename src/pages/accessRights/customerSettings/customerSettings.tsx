import { FC } from "react";

import TableCustomerSettings from "../../../components/table/accessRights/TableCustomerSettings";

import styles from "./customerSettings.module.scss";

const CustomerSettings: FC = () => {
  return (
    <div className={styles.wrapper}>
      <TableCustomerSettings />
    </div>
  );
};

export default CustomerSettings;
