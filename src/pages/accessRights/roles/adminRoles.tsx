import { FC } from "react";

import TableAdminRoles from "../../../components/table/accessRights/TableAdminRoles";

import styles from "./adminRoles.module.scss";

const AdminRoles: FC = () => {
  return (
    <div className={styles.wrapper}>
      <TableAdminRoles />
    </div>
  );
};

export default AdminRoles;
