import { Link } from "react-router-dom";

import SectionContent from "../../../components/sectionContent/sectionContent";
import Signals from "../../../pages/tunder/signals/signals";
import Sidebar from "../../../components/sidebar/Sidebar";

import "../../../scss/App.scss";

const SignalsApp = () => {
  return (
    <div className="App">
      <Sidebar />
      <SectionContent section="Тандер" title="Сигналы">
        <div className="content__main">
          <div className="btns">
            <Link to="/tunder/retail-outlets" className="tab">
              <div className="buttons__btn">Торговые точки</div>
            </Link>
            <Link to="/tunder/signals" className="tab">
              <div className="buttons__btn --active">Сигналы</div>
            </Link>
            <Link to="/tunder/settings" className="tab">
              <div className="buttons__btn">Настройки</div>
            </Link>
          </div>
          <Signals />
        </div>
      </SectionContent>
    </div>
  );
};

export default SignalsApp;
