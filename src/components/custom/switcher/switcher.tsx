import { FC } from "react";
import Switch from "react-switch";

import clsx from "clsx";

import styles from "./switcher.module.scss";

interface ISwitcherProps {
  onChange: () => void;
  className?: string;
  icon?: JSX.Element;
  checked: boolean;
}

const Switcher: FC<ISwitcherProps> = ({
  className,
  onChange,
  checked,
  icon,
}) => {
  return (
    <Switch
      className={clsx(styles.switch, checked && styles.checkedValue, className)}
      uncheckedHandleIcon={icon}
      checkedHandleIcon={icon}
      offHandleColor={"#fff"}
      onChange={onChange}
      offColor={"#fff"}
      checked={checked}
    />
  );
};

export default Switcher;
