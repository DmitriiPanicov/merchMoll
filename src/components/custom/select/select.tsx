import { FC } from "react";
import SelectComponent from "react-select";

import clsx from "clsx";

import styles from "./select.module.scss";

interface ISelectProps {
  isShowPlaceholder?: boolean;
  isDifStyles?: boolean;
  menuPlacement?: any;
  defaultValue?: any;
  propsChange?: any;
  placeholder?: any;
  className?: any;
  options?: any;
  value?: any;
  name?: any;
}

const Select: FC<ISelectProps> = ({
  isShowPlaceholder,
  menuPlacement,
  defaultValue,
  isDifStyles,
  propsChange,
  placeholder,
  className,
  options,
  value,
  name,
}) => {
  const customStyles = {
    control: (provided: any) => ({
      ...provided,
      border: isDifStyles && "none",
      borderRadius: "8px",
      flexWrap: "nowrap",
      fontWeight: "400",
    }),
    menu: (base: any) => ({
      ...base,
      minWidth: "100%",
      width: "max-content",
    }),
    menuList: (base: any) => ({
      ...base,
      maxHeight: "447px",
      "::-webkit-scrollbar": {
        background: "none",
        width: "8px",
      },
      "::-webkit-scrollbar-track": {
        background: "none",
      },
      "::-webkit-scrollbar-thumb": {
        backgroundColor: "var(--main-color)",
        border: "0px solid rgba(24, 24, 24, 0.795)",
        borderRadius: "8px",
      },
    }),
    option: (base: any, state: any) => ({
      ...base,
      fontSize: "14px !important",
      fontWeight: "400 !important",
      height: "fit-content",
      padding: "3px 10px",
      backgroundColor: state.isSelected ? "var(--main-color)" : "#fff",
      color: state.isSelected ? "var(--active-tab-color)" : "#000",
      ":hover": {
        backgroundColor: state.isSelected
          ? "var(--main-color)"
          : "var(--table-head-bg-color)",
      },
    }),
  };

  return (
    <div className={styles.custom__select_wrapper}>
      <span
        className={clsx(
          styles.custom__floating_placeholer,
          isShowPlaceholder && styles.active__floating_placeholder
        )}
      >
        {placeholder}
      </span>
      <SelectComponent
        menuPlacement={menuPlacement || "auto"}
        onChange={(e) => propsChange(e)}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className={className}
        styles={customStyles}
        isSearchable={false}
        options={options}
        value={value}
        name={name}
      />
    </div>
  );
};

export default Select;
