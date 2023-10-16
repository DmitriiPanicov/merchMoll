import { FC, ReactNode, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import clsx from "clsx";

import { reducerTheme } from "../../redux/reducer/theme/reducers/reducerTheme";
import { convertHexToRGBA } from "../../utils/formatColor";
import { AppDispatch } from "../../redux/reducer/store";

import CriteriasPopup from "../custom/criteriasPopup/criteriasPopup";
import Select from "../custom/select/select";
import GroupBtn from "../groupBtn/groupBtn";

import "../../scss/App.scss";

const themeOptions = [
  { value: "purple", label: "Фиолетовый" },
  { value: "lightBlue", label: "Светло голубой" },
  { value: "blue", label: "Голубой" },
  { value: "darkBlue", label: "Синий" },
  { value: "light", label: "Светло серый" },
  { value: "dark", label: "Серый" },
  { value: "black", label: "Черный" },
  { value: "yellow", label: "Желтый" },
  { value: "red", label: "Красный" },
  { value: "orange", label: "Оранжевый" },
  { value: "green", label: "Зеленый" },
];

interface ISectionContentProps {
  headBlockFilters?: ReactNode;
  buttonsContainerRef?: any;
  isOpenGroupBtn?: boolean;
  headBlockChildren?: any;
  availableButtons?: any;
  children?: ReactNode;
  pageName?: string;
  section?: string;
  title?: string;
  root?: string;
  tail?: string;
}

const IS_VISIBLE_SIDEBAR = process.env.REACT_APP_IS_VISIBLE_SIDEBAR;

const SectionContent: FC<ISectionContentProps> = ({
  root = "Merch Online",
  buttonsContainerRef,
  headBlockChildren,
  headBlockFilters,
  availableButtons,
  isOpenGroupBtn,
  pageName,
  children,
  section,
  title,
  tail,
}) => {
  const dispatch = useDispatch<AppDispatch>();

  const { data, isOpenSidebar } = useSelector((state: any) => state.user.user);
  const theme = useSelector((state: any) => state.theme.theme);

  const photoViewerInstance = document.querySelector(".photoviewer-modal");
  const customThemeOptions = JSON.parse(
    localStorage.getItem("customThemeOptions") as string
  );

  const [selectedColor, setSelectedColor] = useState<any>(
    (customThemeOptions &&
      customThemeOptions.find((elem: any) => elem.property === "--main-color")
        ?.value) ||
      "#ffffff"
  );

  const isVisibleGroupBtn = !!availableButtons?.length && isOpenGroupBtn;
  const themeSelectValue = themeOptions.filter(
    (obj) => obj.value === theme.theme
  );

  if (photoViewerInstance && pageName !== "report") {
    photoViewerInstance.remove();
  }

  useEffect(() => {
    theme.theme === "custom" && applyStyles(customThemeOptions);
    document.documentElement.dataset.theme = theme.theme;
    localStorage.setItem("theme", theme.theme);
  }, [customThemeOptions, theme]);

  const handleChangeTheme = (event: any) => {
    localStorage.removeItem("customThemeOptions");
    applyStyles(customThemeOptions, "delete");
    dispatch(reducerTheme(event.value));
    setSelectedColor("#ffffff");
  };

  const handleChangeColorPicker = (event: any) => {
    const color = event?.target?.value;

    const customOptions = [
      { property: "--table-border-color", value: convertHexToRGBA(color, 0.2) },
      { property: "--btns-bg-color", value: convertHexToRGBA(color, 0.4) },
      { property: "--avatar-color", value: convertHexToRGBA(color, 0.24) },
      { property: "--active-tab-color", value: "#ffffff" },
      { property: "--main-text-color", value: color },
      { property: "--main-color", value: color },
      {
        property: "--table-head-bg-color",
        value: convertHexToRGBA(color, 0.08),
      },
      {
        property: "--menu-item-border-color",
        value: convertHexToRGBA(color, 0.32),
      },
      {
        property: "--background-color",
        value: convertHexToRGBA(color, 0.05),
      },
      {
        property: "--hover-edit-cell-color",
        value: convertHexToRGBA(color, 0.1),
      },
    ];

    localStorage.setItem("customThemeOptions", JSON.stringify(customOptions));
    dispatch(reducerTheme("custom"));
    applyStyles(customOptions);
    setSelectedColor(color);
  };

  const applyStyles = (styleOptions: any, purpose?: string) => {
    styleOptions?.forEach((elem: any) =>
      purpose === "delete"
        ? document.documentElement.style.removeProperty(elem.property)
        : document.documentElement.style.setProperty(elem.property, elem.value)
    );
  };

  return (
    <div className="content" style={{ marginLeft: 0 }}>
      <div
        className={clsx(
          JSON.parse(IS_VISIBLE_SIDEBAR as string) &&
            isOpenSidebar &&
            "active__head_block",
          !isOpenSidebar && "closed__head_block",
          "head__block"
        )}
      >
        <div
          className={
            isVisibleGroupBtn
              ? "active__block_children"
              : "head__block_children"
          }
          ref={buttonsContainerRef}
        >
          {headBlockChildren}
        </div>
        {isVisibleGroupBtn && <GroupBtn children={availableButtons} />}
        <div className="head__block_filters">{headBlockFilters}</div>
        <Select
          propsChange={(event: any) => handleChangeTheme(event)}
          defaultValue={themeSelectValue}
          placeholder="Выберите тему..."
          className="theme__select"
          value={themeSelectValue}
          options={themeOptions}
          name="theme"
        />
        <label className="color__selector">
          <span className="circle" style={{ background: selectedColor }} />
          <input
            onChange={handleChangeColorPicker}
            defaultValue={selectedColor}
            className="color__picker"
            type="color"
          />
        </label>
      </div>
      <div className="content__title">
        <div className="breadcrumbs">
          <span>{root}</span>
          <span>{section}</span>
          {pageName !== "reports" && pageName !== "unloadings" && (
            <span>{title}</span>
          )}
          {(pageName === "reportSignals" || pageName === "clientSettings") && (
            <span>{tail}</span>
          )}
        </div>
        {pageName === "report" && data && !data.isCustomer && (
          <CriteriasPopup />
        )}
      </div>
      {children}
    </div>
  );
};

export default SectionContent;
