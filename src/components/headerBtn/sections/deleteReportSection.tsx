import { FC } from "react";
import styles from "../headerBtn.module.scss";

interface IProps {
  title: string;
}

const DeleteReportSection: FC<IProps> = ({ title }) => {
  return (
    <div>
      <span className={styles.delete__report_message}>{title}</span>
    </div>
  );
};

export default DeleteReportSection;
