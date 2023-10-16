import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

import UserSingleReport from "../../../pages/userSingleReport/userSingleReport";
import SectionContent from "../../../components/sectionContent/sectionContent";
import HeaderBtn from "../../../components/headerBtn/headerBtn";
import Sidebar from "../../../components/sidebar/Sidebar";

import "../../../scss/App.scss";

const AdminSingleReportSection = () => {
  const { id } = useParams<{ id: string }>();
  const { isVisibleTunderSignals } = useSelector(
    (state: any) => state.userSingleReport.userSingleReport
  );

  return (
    <div className="App">
      <Sidebar />
      <SectionContent
        section="Отчеты"
        pageName="report"
        title={"Отчет №" + id}
        headBlockChildren={
          <>
            <HeaderBtn
              content="Настройки"
              purpose="adminSingleReportSettings"
              modalTitle="Настройки"
            />
            <HeaderBtn
              content="Скопировать отчет"
              purpose="copyReport"
              modalTitle="Скопировать отчет"
            />
            <HeaderBtn
              content="Удалить отчет"
              purpose="deleteReport"
              modalTitle="Удалить отчет"
            />
            <HeaderBtn
              content="Удалить фотографии"
              purpose="deletePhotos"
              modalTitle="Подтверждение удаления фотографий"
            />
          </>
        }
      >
        <div className="content__single_report">
          <div className="btns" style={{ margin: "0 0 7px 4px" }}>
            <Link to={`/reports/${id}`} className="tab">
              <div className="buttons__btn --active">Отчет</div>
            </Link>
            {isVisibleTunderSignals && (
              <Link to={`/reports/${id}/signals`} className="tab">
                <div className="buttons__btn">Тандер</div>
              </Link>
            )}
          </div>
          <UserSingleReport />
        </div>
      </SectionContent>
    </div>
  );
};

export default AdminSingleReportSection;
