import { FC } from "react";
import { useSelector } from "react-redux";

import TableAdminUnloadingZip from "../../../components/table/unloadings/TableAdminUnloadingZip";
import TableUnloadingZip from "../../../components/table/unloadings/TableUnloadingZip";

import styles from "./unloadingZip.module.scss";

const UnloadingZip: FC = () => {
  const { data } = useSelector((state: any) => state.user.user);

  return (
    <div className={styles.wrapper}>
      {!data.isCustomer ? <TableAdminUnloadingZip /> : <TableUnloadingZip />}
    </div>
  );
};

export default UnloadingZip;
