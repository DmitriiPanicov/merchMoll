import { useCallback, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

import CircleLoader from "../../../components/custom/circleLoader/circleLoader";
import SectionContent from "../../../components/sectionContent/sectionContent";
import UserReports from "../../../pages/userReports/userReports/userReports";
import HeaderBtn from "../../../components/headerBtn/headerBtn";
import Sidebar from "../../../components/sidebar/Sidebar";

import "../../../scss/App.scss";

const IS_VISIBLE_SIDEBAR = process.env.REACT_APP_IS_VISIBLE_SIDEBAR;

const CustomerReportsSection = () => {
  const { data, isOpenSidebar, contractsLength } = useSelector((state: any) => state.user.user);
  const { reportsCount, reportsInputValues, reportContracts } = useSelector(
    (state: any) => state.userReports.userReports
  );

  const buttonsContainerRef = useRef<any>(null);
  const headFilterRef = useRef<any>(null);

  const [overflowedBtnsCount, setOverflowedBtnsCount] = useState<number>(0);
  const [isOpenGroupBtn, setIsOpenGroupBtn] = useState(false);

  const sidebarWidth = isOpenSidebar ? 190 : 44;
  const headerFiltersAndSelectWidth = 260;
  const minEmptyWidthForNewBtn = 300;
  const groupBtnWidth = 70;
  const buttonWidth = 135;

  const availableButtons = [
    {
      component: (
        <HeaderBtn
          content="Настройки"
          purpose="customerReportsSettings"
          modalTitle="Настройки"
        />
      ),
    },
    !data?.settings?.onlyPhotoAndGeo && {
      component: (
        <HeaderBtn
          content="Выгрузить данные"
          purpose="unloadCustomerReportsData"
          modalTitle="Выгрузить данные"
        />
      ),
    },
    !data?.settings?.onlyPhotoAndGeo && {
      component: (
        <HeaderBtn
          content="Выгрузка по отчетам"
          purpose="unloadCustomerReports"
          modalTitle="Выгрузка по отчетам"
        />
      ),
    },
    reportsInputValues &&
      reportsInputValues.fromDate &&
      reportsInputValues.toDate &&
      (reportContracts?.length === 1 || contractsLength < 2) &&
      data?.settings?.periodOsa && {
        component: (
          <HeaderBtn
            content="OSA за период"
            purpose="osa"
            modalTitle="OSA за период"
          />
        ),
      },
    reportsInputValues &&
      reportsInputValues.fromDate &&
      reportsInputValues.toDate &&
      (reportContracts?.length === 1 || contractsLength < 2) &&
      !data?.settings?.onlyPhotoAndGeo && {
        component: (
          <HeaderBtn
            content="Выгрузить отчет"
            purpose="unloadClientReport"
            modalTitle="Сводный отчет"
          />
        ),
      },
    reportsInputValues &&
      reportsInputValues.fromDate &&
      reportsInputValues.toDate &&
      (reportContracts?.length === 1 || contractsLength < 2) &&
      !data?.settings?.onlyPhotoAndGeo && {
        component: (
          <HeaderBtn
            content="Выгрузить гор. линию"
            purpose="unloadHotline"
            modalTitle="Сводный отчет"
          />
        ),
      },
    reportsInputValues &&
      reportsInputValues.fromDate &&
      reportsInputValues.toDate &&
      (reportContracts?.length === 1 || contractsLength < 2) &&
      data?.settings?.averageFacing && {
        component: (
          <HeaderBtn
            content="Средний фейсинг"
            purpose="averageFacing"
            modalTitle="Средний фейсинг"
          />
        ),
      },
    data?.settings?.shareOfShelf &&
      (reportContracts?.length >= 1 || contractsLength < 2) && {
        component: (
          <HeaderBtn
            content="Доля полки"
            purpose="shelfShare"
            modalTitle="Доля полки"
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
  ];

  const filteredAvailableButtons = availableButtons.filter((btn: any) => btn);

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
        headBlockFilters={
          <div className="head__block_filters" ref={headFilterRef}></div>
        }
        availableButtons={displayedAvailableBtns}
        buttonsContainerRef={buttonsContainerRef}
        headBlockChildren={displayedHeadBtns}
        isOpenGroupBtn={isOpenGroupBtn}
        pageName="reports"
        section="Отчеты"
      >
        <div className="content__main">
          <div className="btns">
            <div className="tab">
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
            </div>
          </div>
          <UserReports />
        </div>
      </SectionContent>
    </div>
  );
};

export default CustomerReportsSection;
