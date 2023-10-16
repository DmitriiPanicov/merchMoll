import { Link } from "react-router-dom";

import SectionContent from "../../../components/sectionContent/sectionContent";
import RetailOutlets from "../../../pages/tunder/retailOutlets/retailOutlets";
import HeaderBtn from "../../../components/headerBtn/headerBtn";
import Sidebar from "../../../components/sidebar/Sidebar";

import "../../../scss/App.scss";

const RetailOutletsApp = () => {
  return (
    <div className="App">
      <Sidebar />
      <SectionContent
        section="Тандер"
        title="Торговые точки"
        headBlockChildren={
          <HeaderBtn
            content="Загрузить торговые точки"
            purpose="outletsDownload"
            modalTitle="Загрузить торговые точки"
          />
        }
      >
        <div className="content__main">
          <div className="btns">
            <Link to="/tunder/retail-outlets" className="tab">
              <div className="buttons__btn --active">Торговые точки</div>
            </Link>
            <Link to="/tunder/signals" className="tab">
              <div className="buttons__btn">Сигналы</div>
            </Link>
            <Link to="/tunder/settings" className="tab">
              <div className="buttons__btn">Настройки</div>
            </Link>
          </div>
          <RetailOutlets />
        </div>
      </SectionContent>
    </div>
  );
};

export default RetailOutletsApp;
