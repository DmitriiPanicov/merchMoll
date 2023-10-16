import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

import UserSingleReport from "../../../pages/userSingleReport/userSingleReport";
import SectionContent from "../../../components/sectionContent/sectionContent";
import HeaderBtn from "../../../components/headerBtn/headerBtn";
import Sidebar from "../../../components/sidebar/Sidebar";

import "../../../scss/App.scss";

const CustomerSingleReportSection = () => {
  const { isVisibleTunderSignals, report } = useSelector(
    (state: any) => state.userSingleReport.userSingleReport
  );
  const { data } = useSelector((state: any) => state.user.user);
  const { id } = useParams<{ id: string }>();

  return (
    <div className="App">
      <Sidebar />
      <SectionContent
        section="Отчеты"
        pageName="report"
        title={"Отчет №" + id}
        headBlockChildren={
          <>
            {data.settings?.reviewer && report && report?.isRateable && (
              <HeaderBtn
                content="Оценить работу"
                purpose="reportCheck"
                modalTitle="Оценить отчет"
              />
            )}
            <HeaderBtn
              content="Настройки"
              purpose="singleReportSettings"
              modalTitle="Настройки"
            />
          </>
        }
      >
        <div className="content__single_report">
          <div className="btns" style={{ margin: "0 0 7px 4px" }}>
            <Link to={`/reports/${id}`} className="tab">
              <div className="buttons__btn --active">Отчет</div>
            </Link>
            {isVisibleTunderSignals && (
              <Link to={`/reports/${id}/signals`} className="tab">
                <div className="buttons__btn">Тандер</div>
              </Link>
            )}
          </div>
          <UserSingleReport />
        </div>
      </SectionContent>
    </div>
  );
};

export default CustomerSingleReportSection;
