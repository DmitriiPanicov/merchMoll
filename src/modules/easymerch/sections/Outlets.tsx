import { Link } from "react-router-dom";

import SectionContent from "../../../components/sectionContent/sectionContent";
import HeaderBtn from "../../../components/headerBtn/headerBtn";
import Outlets from "../../../pages/easymerch/outlets/outlets";
import Sidebar from "../../../components/sidebar/Sidebar";

import "../../../scss/App.scss";

const OutletsApp = () => {
  return (
    <div className="App">
      <Sidebar />

      <SectionContent
        section="easymerch"
        title="Торговые точки"
        headBlockChildren={
          <>
            <HeaderBtn
              content="Выгрузка торговых точек"
              purpose="outletsUnload"
              modalTitle="Выгрузка торговых точек"
            />
          </>
        }
      >
        <div className="content__main">
          <div className="btns">
            <Link to="/easymerch/outlets" className="tab">
              <div className="buttons__btn --active">Торговые точки</div>
            </Link>
            <Link to="/easymerch/report" className="tab">
              <div className="buttons__btn">Типы отчетов</div>
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
          <Outlets />
        </div>
      </SectionContent>
    </div>
  );
};

export default OutletsApp;
