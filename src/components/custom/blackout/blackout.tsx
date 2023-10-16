import { FC, ReactNode, useEffect, useState } from "react";
import ReactDOM from "react-dom";

import styles from "./blackout.module.scss";

type TBlackoutProps = {
  onClose?: () => void;
  children: ReactNode;
  className?: string;
};

const Blackout: FC<TBlackoutProps> = (props) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => {
      setIsMounted(false);
    };
  }, []);

  useEffect(() => {
    if (isMounted) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isMounted]);

  if (typeof document === "undefined" || !isMounted) {
    return null;
  }

  const handleClose = () => {
    if (props.onClose) {
      props.onClose();
    }
  };

  const portalRoot = document.getElementById("root");

  const element = (
    <div
      className={props.className ? props.className : styles.blackout__portal}
      onClick={handleClose}
    >
      {props.children}
    </div>
  );

  if (!portalRoot) {
    throw new Error("Portal root element not found.");
  }

  return ReactDOM.createPortal(element, portalRoot);
};

export default Blackout;
