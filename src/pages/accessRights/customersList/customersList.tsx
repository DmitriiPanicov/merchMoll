import { FC } from "react";

import TableCustomersList from "../../../components/table/accessRights/TableCustomersList";

import styles from "./customersList.module.scss";

const CustomersList: FC = () => {
  return (
    <div className={styles.wrapper}>
      <TableCustomersList />
    </div>
  );
};

export default CustomersList;
