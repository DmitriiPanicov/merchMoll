import { FC } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import ExpiredReports from "../../../pages/userReports/expiredReports/expiredReports";
import CircleLoader from "../../../components/custom/circleLoader/circleLoader";
import SectionContent from "../../../components/sectionContent/sectionContent";
import HeaderBtn from "../../../components/headerBtn/headerBtn";
import Sidebar from "../../../components/sidebar/Sidebar";

import "../../../scss/App.scss";

const ExpiredReportsSection: FC = () => {
  const { expiredReportsCount } = useSelector(
    (state: any) => state.userReports.expiredReports
  );

  return (
    <div className="App">
      <Sidebar />
      <SectionContent
        section="Отчеты"
        title="Не сданы"
        headBlockChildren={
          <>
            <HeaderBtn
              content="Настройки"
              purpose="expiredReportsSettings"
              modalTitle="Настройки"
            />
            <HeaderBtn
              content="Выгрузить список"
              purpose="unloadExpiredList"
              modalTitle="Выгрузить список"
            />
            <HeaderBtn
              content="Удалить"
              purpose="deleteExpired"
              modalTitle="Удалить отчеты"
            />
            <HeaderBtn
              content="Создать отчеты"
              purpose="createExpiredReports"
              modalTitle="Создать отчеты"
            />
          </>
        }
      >
        <div className="content__main">
          <div className="btns">
            <Link to="/reports" className="tab">
              <div className="buttons__btn">Всего</div>
            </Link>
            <Link to="/reports/expired" className="tab">
              <div className="buttons__btn --active">
                Не сданы
                <div className="tab__reports_count">
                  {!expiredReportsCount && expiredReportsCount !== 0 ? (
                    <CircleLoader />
                  ) : (
                    expiredReportsCount
                  )}
                </div>
              </div>
            </Link>
          </div>
          <ExpiredReports />
        </div>
      </SectionContent>
    </div>
  );
};

export default ExpiredReportsSection;
