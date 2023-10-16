import { FC } from "react";

import TableUsers from "../../../components/table/easymerch/TableUsers";

import styles from "./users.module.scss";

const Users: FC = () => {
  return (
    <div className={styles.users}>
      <TableUsers />
    </div>
  );
};

export default Users;
