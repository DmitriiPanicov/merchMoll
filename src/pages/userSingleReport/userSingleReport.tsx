import { FC } from "react";
import { useSelector } from "react-redux";

import TableCustomerSingleReport from "../../components/table/userSingleReport/TableCustomerSingleReport";
import TableAdminSingleReport from "../../components/table/userSingleReport/TableAdminSingleReport";

import styles from "./userSingleReport.module.scss";

const UserSingleReport: FC = () => {
  const { data } = useSelector((state: any) => state.user.user);

  return (
    <div className={styles.report}>
      {!data.isCustomer ? (
        <TableAdminSingleReport />
      ) : (
        <TableCustomerSingleReport />
      )}
    </div>
  );
};

export default UserSingleReport;
