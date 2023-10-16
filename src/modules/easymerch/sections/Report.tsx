import { Link } from "react-router-dom";

import SectionContent from "../../../components/sectionContent/sectionContent";
import Reports from "../../../pages/easymerch/reports/reports";
import Sidebar from "../../../components/sidebar/Sidebar";

import "../../../scss/App.scss";

const ReportApp = () => {
  return (
    <div className="App">
      <Sidebar />

      <SectionContent section="easymerch" title="Типы отчетов">
        <div className="content__main">
          <div className="btns">
            <Link to="/easymerch/outlets" className="tab">
              <div className="buttons__btn">Торговые точки</div>
            </Link>
            <Link to="/easymerch/report" className="tab">
              <div className="buttons__btn --active">Типы отчетов</div>
            </Link>
            <Link to="/easymerch/users" className="tab">
              <div className="buttons__btn">Физ. лица</div>
            </Link>
            <Link to="/easymerch/service-types" className="tab">
              <div className="buttons__btn">Типы обслуживания</div>
            </Link>
            <Link to="/easymerch/integration-errors" className="tab">
              <div className="buttons__btn">Ошибки Интеграции</div>
            </Link>
          </div>
          <Reports />
        </div>
      </SectionContent>
    </div>
  );
};

export default ReportApp;
