import { FC } from "react";

import TableCustomerRegions from "../../../components/table/accessRights/TableCustomerRegions";

import styles from "./customerRegions.module.scss";

const CustomerRegions: FC = () => {
  return (
    <div className={styles.wrapper}>
      <TableCustomerRegions />
    </div>
  );
};

export default CustomerRegions;
