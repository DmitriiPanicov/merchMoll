import { FC } from "react";
import { useSelector } from "react-redux";

import styles from "../headerBtn.module.scss";

const CreateGeoSection: FC = () => {
  const { selectedReportsId } = useSelector(
    (state: any) => state.userReports.userReports
  );

  return (
    <div className={styles.block__info}>
      <span>
        {!selectedReportsId?.length &&
          "Кол-во отчетов: " + selectedReportsId?.length}
      </span>
      {!!selectedReportsId?.length && (
        <div className={styles.create__geo_block}>
          <span>{"Кол-во отчетов: " + selectedReportsId?.length}</span>
          <div className={styles.geo__reports_list}>
            {selectedReportsId?.map((reportId: any, index: number) => (
              <p key={index} className={styles.geo__report}>
                Отчет №{reportId.id}
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateGeoSection;
