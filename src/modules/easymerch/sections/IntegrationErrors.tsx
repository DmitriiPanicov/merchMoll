import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { formatHistoryDateTime } from "../../../utils/formatDate";

import IntegrationErrors from "../../../pages/easymerch/integrationErrors/integrationErrors";
import SectionContent from "../../../components/sectionContent/sectionContent";
import HeaderBtn from "../../../components/headerBtn/headerBtn";
import Sidebar from "../../../components/sidebar/Sidebar";

import "../../../scss/App.scss";

const IntegrationErrorsApp = () => {
  const { lastUpdate } = useSelector(
    (state: any) => state.easymerch.integrationErrors
  );

  return (
    <div className="App">
      <Sidebar />
      <SectionContent
        section="easymerch"
        title="Ошибки Интеграции"
        headBlockChildren={
          <>
            <HeaderBtn
              content="Выгрузка ошибок интеграции"
              purpose="errorsUnload"
              modalTitle="Выгрузка ошибок интеграции"
            />
          </>
        }
      >
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
              <div className="buttons__btn">Типы обслуживания</div>
            </Link>
            <Link to="/easymerch/integration-errors" className="tab">
              <div className="buttons__btn --active">Ошибки Интеграции</div>
            </Link>
            {lastUpdate && (
              <div className="last__update_block">
                <span>
                  Последнее обновление: {formatHistoryDateTime(lastUpdate)}
                </span>
              </div>
            )}
          </div>
          <IntegrationErrors />
        </div>
      </SectionContent>
    </div>
  );
};

export default IntegrationErrorsApp;
