import { Link } from "react-router-dom";

import SectionContent from "../../../components/sectionContent/sectionContent";
import Settings from "../../../pages/tunder/settings/settings";
import Sidebar from "../../../components/sidebar/Sidebar";

import "../../../scss/App.scss";

const SettingsApp = () => {
  return (
    <div className="App">
      <Sidebar />
      <SectionContent section="Тандер" title="Настройки">
        <div className="content__main">
          <div className="btns">
            <Link to="/tunder/retail-outlets" className="tab">
              <div className="buttons__btn">Торговые точки</div>
            </Link>
            <Link to="/tunder/signals" className="tab">
              <div className="buttons__btn">Сигналы</div>
            </Link>
            <Link to="/tunder/settings" className="tab">
              <div className="buttons__btn --active">Настройки</div>
            </Link>
          </div>
          <Settings />
        </div>
      </SectionContent>
    </div>
  );
};

export default SettingsApp;
