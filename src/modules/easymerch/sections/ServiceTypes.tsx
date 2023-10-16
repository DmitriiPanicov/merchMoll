import { Link } from "react-router-dom";

import SectionContent from "../../../components/sectionContent/sectionContent";
import ServiceTypes from "../../../pages/easymerch/serviceTypes/serviceTypes";
import Sidebar from "../../../components/sidebar/Sidebar";

import "../../../scss/App.scss";

const ServiceTypesApp = () => {
  return (
    <div className="App">
      <Sidebar />
      <SectionContent section="easymerch" title="Типы обслуживания">
        <div className="content__main">
          <div className="btns">
            <Link to="/easymerch/outlets" className="tab">
              <div className="buttons__btn">Торговые точки</div>
            </Link>
            <Link to="/easymerch/report" className="tab">
              <div className="buttons__btn">Типы отчетов</div>
            </Link>
            <Link to="/easymerch/users" className="tab">
              <div className="buttons__btn">Физ. лица</div>
            </Link>
            <Link to="/easymerch/service-types" className="tab">
              <div className="buttons__btn --active">Типы обслуживания</div>
            </Link>
            <Link to="/easymerch/integration-errors" className="tab">
              <div className="buttons__btn">Ошибки Интеграции</div>
            </Link>
          </div>
          <ServiceTypes />
        </div>
      </SectionContent>
    </div>
  );
};

export default ServiceTypesApp;
