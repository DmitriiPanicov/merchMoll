import { FC } from "react";

import TableOutlets from "../../../components/table/easymerch/TableOutlets";

import styles from "./outlets.module.scss";

const Outlets: FC = () => {
  return (
    <div className={styles.outlets}>
      <TableOutlets />
    </div>
  );
};

export default Outlets;
