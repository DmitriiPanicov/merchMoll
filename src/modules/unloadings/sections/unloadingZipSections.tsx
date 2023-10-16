import { FC } from "react";
import { Link } from "react-router-dom";

import SectionContent from "../../../components/sectionContent/sectionContent";
import UnloadingZip from "../../../pages/unloadings/unloadingZip/unloadingZip";
import Sidebar from "../../../components/sidebar/Sidebar";

import "../../../scss/App.scss";

const UnloadingZipSection: FC = () => {
  return (
    <div className="App">
      <Sidebar />
      <SectionContent section="Заказанные архивы" pageName="unloadings">
        <div className="content__main">
          <div className="btns">
            <Link to="/unloadings/excel" className="tab">
              <div className="buttons__btn">Excel</div>
            </Link>
            <Link to="/unloadings/zip" className="tab">
              <div className="buttons__btn --active">Zip</div>
            </Link>
          </div>
          <UnloadingZip />
        </div>
      </SectionContent>
    </div>
  );
};

export default UnloadingZipSection;
