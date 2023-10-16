import { FC } from "react";

import TableCustomerInfo from "../../../components/table/accessRights/TableCustomerInfo";

import styles from "./customerInfo.module.scss";

const CustomerInfo: FC = () => {
  return (
    <div className={styles.wrapper}>
      <TableCustomerInfo />
    </div>
  );
};

export default CustomerInfo;
