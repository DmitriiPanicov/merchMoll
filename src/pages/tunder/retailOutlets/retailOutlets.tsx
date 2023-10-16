import { FC } from "react";

import TableRetailOutlets from "../../../components/table/tunder/TableRetailOutlets";

import styles from "./retailOutlets.module.scss";

const RetailOutlets: FC = () => {
  return (
    <div className={styles.retailOutlets}>
      <TableRetailOutlets />
    </div>
  );
};

export default RetailOutlets;
