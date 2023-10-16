import { FC } from "react";
import { useSelector } from "react-redux";

import TableCustomerReports from "../../../components/table/userReports/TableCustomerReports";
import TableAdminReports from "../../../components/table/userReports/TableAdminReports";

import styles from "./userReports.module.scss";

const UserReports: FC = () => {
  const { data } = useSelector((state: any) => state.user.user);

  return (
    <div className={styles.reports}>
      {!data.isCustomer ? <TableAdminReports /> : <TableCustomerReports />}
    </div>
  );
};

export default UserReports;
