import { Link } from "react-router-dom";

import SectionContent from "../../../components/sectionContent/sectionContent";
import HeaderBtn from "../../../components/headerBtn/headerBtn";
import Sidebar from "../../../components/sidebar/Sidebar";
import Users from "../../../pages/easymerch/users/users";

import "../../../scss/App.scss";

const UsersApp = () => {
  return (
    <div className="App">
      <Sidebar />
      <SectionContent
        section="easymerch"
        title="Физ. лица"
        headBlockChildren={
          <HeaderBtn
            modalTitle="Отправить маршруты в EasyMerch"
            content="Отправить маршруты в EasyMerch"
            purpose="sendRoutesToEasyMerch"
          />
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
              <div className="buttons__btn --active">Физ. лица</div>
            </Link>
            <Link to="/easymerch/service-types" className="tab">
              <div className="buttons__btn">Типы обслуживания</div>
            </Link>
            <Link to="/easymerch/integration-errors" className="tab">
              <div className="buttons__btn">Ошибки Интеграции</div>
            </Link>
          </div>
          <Users />
        </div>
      </SectionContent>
    </div>
  );
};

export default UsersApp;
