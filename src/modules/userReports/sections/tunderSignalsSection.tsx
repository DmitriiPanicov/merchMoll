import { Link, useParams } from "react-router-dom";

import SingleReportTunderSignals from "../../../pages/singleReportTunderSignals/singleReportTunderSignals";
import SectionContent from "../../../components/sectionContent/sectionContent";
import Sidebar from "../../../components/sidebar/Sidebar";

import "../../../scss/App.scss";

const TunderSignalsSection = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="App">
      <Sidebar />
      <SectionContent
        section="Отчеты"
        pageName="reportSignals"
        title={"Отчет №" + id}
        tail="Тандер Сигналы"
      >
        <div className="content__single_report">
          <div className="btns" style={{ margin: "0 0 7px 4px" }}>
            <Link to={`/reports/${id}`} className="tab">
              <div className="buttons__btn">Отчет</div>
            </Link>
            <Link to={`/reports/${id}/signals`} className="tab">
              <div className="buttons__btn --active">Тандер</div>
            </Link>
          </div>
          <SingleReportTunderSignals />
        </div>
      </SectionContent>
    </div>
  );
};

export default TunderSignalsSection;
