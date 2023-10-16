import { FC } from "react";

import TableIntegrationErrors from "../../../components/table/easymerch/TableIntegrationErrors";

import styles from "./integrationErrors.module.scss";

const IntegrationErrors: FC = () => {
  return (
    <div className={styles.integrationErrors}>
      <TableIntegrationErrors />
    </div>
  );
};

export default IntegrationErrors;
