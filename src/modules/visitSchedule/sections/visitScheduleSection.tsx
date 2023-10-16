import { FC, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { reducerVisitScheduleTrainee } from "../../../redux/reducer/userSingleReport/reducers/visitSchedule";
import { AppDispatch } from "../../../redux/reducer/store";

import CircleLoader from "../../../components/custom/circleLoader/circleLoader";
import SectionContent from "../../../components/sectionContent/sectionContent";
import VisitSchedule from "../../../pages/visitSchedule/visitSchedule";
import HeaderBtn from "../../../components/headerBtn/headerBtn";
import Sidebar from "../../../components/sidebar/Sidebar";

import "../../../scss/App.scss";

const CustomerSingleReportSection: FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { visitReportsCount } = useSelector(
    (state: any) => state.userSingleReport.visitSchedule
  );

  const [isChecked, setIsChecked] = useState<boolean>(false);

  const handleChangeTraineeFilter = () => {
    dispatch(reducerVisitScheduleTrainee(!isChecked));
    setIsChecked(!isChecked);
  };

  return (
    <div className="App">
      <Sidebar />
      <SectionContent
        section="График посещений"
        pageName="reports"
        headBlockChildren={
          <HeaderBtn
            content="Выгрузить в excel"
            purpose="unloadScheduleExcel"
            modalTitle="Выгрузить в excel"
          />
        }
        headBlockFilters={
          <div className="visit__trainee_block">
            <input type="checkbox" onClick={handleChangeTraineeFilter} />
            <span>Стажер</span>
          </div>
        }
      >
        <div className="content__main">
          <div className="btns">
            <div className="tab">
              <div className="buttons__btn --active">
                Всего
                <div className="tab__reports_count">
                  {!visitReportsCount && visitReportsCount !== 0 ? (
                    <CircleLoader />
                  ) : (
                    visitReportsCount
                  )}
                </div>
              </div>
            </div>
          </div>
          <VisitSchedule />
        </div>
      </SectionContent>
    </div>
  );
};

export default CustomerSingleReportSection;
