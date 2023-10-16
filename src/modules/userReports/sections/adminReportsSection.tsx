import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { reducerUserReportsInputValues } from "../../../redux/reducer/userReports/reducers/userReports";
import { actionGetUserReports } from "../../../redux/action/userReports/actionUserReports";
import { AppDispatch } from "../../../redux/reducer/store";

import CircleLoader from "../../../components/custom/circleLoader/circleLoader";
import SectionContent from "../../../components/sectionContent/sectionContent";
import UserReports from "../../../pages/userReports/userReports/userReports";
import HeaderBtn from "../../../components/headerBtn/headerBtn";
import Sidebar from "../../../components/sidebar/Sidebar";

import "../../../scss/App.scss";

const IS_VISIBLE_SIDEBAR = process.env.REACT_APP_IS_VISIBLE_SIDEBAR;

const AdminReportsSection = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { reportsCount, reportsInputValues, limit, page, reportContracts } =
    useSelector((state: any) => state.userReports.userReports);
  const { isOpenSidebar } = useSelector((state: any) => state.user.user);

  const [isPendingCheckbox, setIsPendingCheckbox] = useState<boolean>(false);
  const [overflowedBtnsCount, setOverflowedBtnsCount] = useState<number>(0);
  const [isInputChange, setIsInputChange] = useState<boolean>(false);
  const [auditValue, setAuditValue] = useState<boolean>(false);
  const [isOpenGroupBtn, setIsOpenGroupBtn] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const buttonsContainerRef = useRef<any>(null);
  const headFilterRef = useRef<any>(null);

  const sidebarWidth = isOpenSidebar ? 190 : 44;
  const headerFiltersAndSelectWidth = 380;
  const minEmptyWidthForNewBtn = 300;
  const groupBtnWidth = 70;
  const buttonWidth = 135;

  const availableButtons = [
    {
      component: (
        <HeaderBtn
          content="Настройки"
          purpose="adminReportsSettings"
          modalTitle="Настройки"
        />
      ),
    },
    {
      component: (
        <HeaderBtn
          content="Выгрузить данные с ссылками"
          purpose="unloadReportsWithLinks"
          modalTitle="Сводный отчет"
        />
      ),
    },
    {
      component: (
        <HeaderBtn
          content="Выгрузить данные"
          purpose="unloadReportsConsolidated"
          modalTitle="Сводный отчет"
        />
      ),
    },
    reportContracts?.length > 0 && {
      component: (
        <HeaderBtn
          content="Выгрузить отчет"
          purpose="unloadClientReport"
          modalTitle="Сводный отчет"
        />
      ),
    },
    reportContracts?.length > 0 && {
      component: (
        <HeaderBtn
          content="OSA за период"
          purpose="osa"
          modalTitle="OSA за период"
        />
      ),
    },
    reportContracts?.length > 0 && {
      component: (
        <HeaderBtn
          content="Средний фейсинг"
          purpose="averageFacing"
          modalTitle="Средний фейсинг"
        />
      ),
    },
    {
      component: (
        <HeaderBtn
          content="Доля полки"
          purpose="shelfShare"
          modalTitle="Доля полки"
        />
      ),
    },
    reportContracts?.length > 0 && {
      component: (
        <HeaderBtn
          content="Выгрузить гор. линию"
          purpose="unloadHotline"
          modalTitle="Сводный отчет"
        />
      ),
    },
    {
      component: (
        <HeaderBtn
          content="Выгрузить список"
          purpose="unloadReportsList"
          modalTitle="Сводный отчет"
        />
      ),
    },
    {
      component: (
        <HeaderBtn
          content="Выгрузить фото"
          purpose="unloadReportsPhotos"
          modalTitle="Выгрузить zip архив с фотоотчетом"
        />
      ),
    },
    {
      component: (
        <HeaderBtn
          content="Скопировать отчеты"
          purpose="copyReports"
          modalTitle="Скопировать отчеты"
        />
      ),
    },
    {
      component: (
        <HeaderBtn
          content="Статус доставки"
          purpose="updateDeliveryStatus"
          modalTitle="Редактировать статус доставки отчетов"
        />
      ),
    },
    reportContracts?.length === 1 && {
      component: (
        <HeaderBtn
          content="Статус проверки"
          purpose="updateReviewStatus"
          modalTitle="Редактировать статус проверки отчетов"
        />
      ),
    },
    {
      component: (
        <HeaderBtn
          content="Статус оценки"
          purpose="updateRateStatus"
          modalTitle="Редактировать статус оценки отчетов"
        />
      ),
    },
    {
      component: (
        <HeaderBtn
          content="Создать геолокацию"
          purpose="createGeo"
          modalTitle="Создание геолокации отчетов"
        />
      ),
    },
  ];

  const filteredAvailableButtons = availableButtons.filter((btn: any) => btn);

  useEffect(() => {
    if (isPendingCheckbox) {
      dispatch(
        reducerUserReportsInputValues({
          ...reportsInputValues,
          audit: auditValue,
        })
      );

      dispatch(actionGetUserReports(limit, page));

      setIsPendingCheckbox(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auditValue]);

  useEffect(() => {
    const handleDocumentClick = () => {
      dispatch(
        reducerUserReportsInputValues({
          ...reportsInputValues,
          techInfo: inputValue,
        })
      );

      dispatch(actionGetUserReports(limit, page));

      setIsInputChange(false);
    };

    if (isInputChange) {
      document.addEventListener("click", handleDocumentClick);

      return () => {
        document.removeEventListener("click", handleDocumentClick);
      };
    } else
      return () => {
        document.removeEventListener("click", handleDocumentClick);
      };
  }, [isInputChange, reportsInputValues, inputValue, dispatch, limit, page]);

  useEffect(() => {
    setOverflowedBtnsCount(0);
  }, [reportContracts]);

  useEffect(() => {
    if (
      filteredAvailableButtons.slice(-(overflowedBtnsCount as number)).length +
        filteredAvailableButtons.slice(
          0,
          filteredAvailableButtons.length - overflowedBtnsCount
        ).length >
      filteredAvailableButtons.length
    ) {
      setOverflowedBtnsCount(0);
    }
  }, [filteredAvailableButtons, overflowedBtnsCount]);

  const handleWindowResize = useCallback(() => {
    const allButtonsWidth =
      filteredAvailableButtons.slice(
        0,
        filteredAvailableButtons.length - overflowedBtnsCount
      ).length * buttonWidth;
    const spaceToLeftSideOfFilters =
      headFilterRef.current?.getBoundingClientRect().left;
    const windowWidth = window.innerWidth;

    const isOverflowed = JSON.parse(IS_VISIBLE_SIDEBAR as string)
      ? allButtonsWidth >
        windowWidth - headerFiltersAndSelectWidth - sidebarWidth
      : allButtonsWidth > windowWidth - headerFiltersAndSelectWidth;

    if (isOverflowed) {
      setIsOpenGroupBtn(true);
      setOverflowedBtnsCount((prevValue: number) => {
        if (overflowedBtnsCount === filteredAvailableButtons.length) {
          return prevValue;
        } else return prevValue + 1;
      });
    }

    const isEnoughtSpace = JSON.parse(IS_VISIBLE_SIDEBAR as string)
      ? spaceToLeftSideOfFilters -
          sidebarWidth -
          allButtonsWidth +
          groupBtnWidth >
        minEmptyWidthForNewBtn
      : spaceToLeftSideOfFilters - allButtonsWidth + groupBtnWidth >
        minEmptyWidthForNewBtn;

    if (isEnoughtSpace) {
      setOverflowedBtnsCount((prevValue: number) => {
        if (prevValue <= 1) {
          setIsOpenGroupBtn(false);
          return 0;
        } else return prevValue - 1;
      });
    }
  }, [filteredAvailableButtons, overflowedBtnsCount, sidebarWidth]);

  useEffect(() => {
    handleWindowResize();

    window.addEventListener("resize", handleWindowResize);

    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, [handleWindowResize]);

  const handleClickCheckbox = () => {
    setIsPendingCheckbox(true);
    setAuditValue(!auditValue);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    setInputValue(value);
    setIsInputChange(true);
  };

  const handleKeyPress = (event: any) => {
    if (event.key === "Enter") {
      dispatch(
        reducerUserReportsInputValues({
          ...reportsInputValues,
          techInfo: inputValue,
        })
      );

      dispatch(actionGetUserReports(limit, page));

      setIsInputChange(false);
    }
  };

  const displayedAvailableBtns = filteredAvailableButtons
    ?.slice(-(overflowedBtnsCount as number))
    ?.map((elem: any, index: number) => {
      return elem && <div key={index}>{elem?.component}</div>;
    });

  const displayedHeadBtns = filteredAvailableButtons
    ?.slice(0, filteredAvailableButtons.length - overflowedBtnsCount)
    ?.map((elem: any, index: any) => {
      return elem && <div key={index}>{elem?.component}</div>;
    });

  return (
    <div className="App">
      <Sidebar />
      <SectionContent
        availableButtons={displayedAvailableBtns}
        buttonsContainerRef={buttonsContainerRef}
        headBlockChildren={displayedHeadBtns}
        isOpenGroupBtn={isOpenGroupBtn}
        pageName="reports"
        section="Отчеты"
        headBlockFilters={
          <div className="head__block_filters" ref={headFilterRef}>
            <div className="audit__filter_block">
              <span>Аудиты</span>
              <input
                defaultChecked={reportsInputValues.audit}
                onChange={handleClickCheckbox}
                type="checkbox"
              />
            </div>
            <input
              defaultValue={reportsInputValues.techInfo}
              onChange={handleInputChange}
              className="tech__info_input"
              onKeyPress={handleKeyPress}
              placeholder="Tex. инфо"
              type="text"
            />
          </div>
        }
      >
        <div className="content__main">
          <div className="btns">
            <Link to="/reports" className="tab">
              <div className="buttons__btn --active">
                Всего
                <div className="tab__reports_count">
                  {!reportsCount && reportsCount !== 0 ? (
                    <CircleLoader />
                  ) : (
                    reportsCount
                  )}
                </div>
              </div>
            </Link>
            <Link to="/reports/expired" className="tab">
              <div className="buttons__btn">Не сданы</div>
            </Link>
          </div>
          <UserReports />
        </div>
      </SectionContent>
    </div>
  );
};

export default AdminReportsSection;
