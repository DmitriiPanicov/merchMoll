import { FC } from "react";

import TableServiceTypes from "../../../components/table/easymerch/TableServiceTypes";

import styles from "./serviceTypes.module.scss";

const ServiceTypes: FC = () => {
  return (
    <div className={styles.serviceTypes}>
      <TableServiceTypes />
    </div>
  );
};

export default ServiceTypes;
