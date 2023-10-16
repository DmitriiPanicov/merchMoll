import { FC } from "react";

import TableSettings from "../../../components/table/tunder/TableSettings";

import styles from "./settings.module.scss";

const Settings: FC = () => {
  return (
    <div className={styles.settings}>
      <TableSettings />
    </div>
  );
};

export default Settings;
