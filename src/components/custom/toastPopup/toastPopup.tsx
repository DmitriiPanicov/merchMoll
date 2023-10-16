import { FC } from "react";

import { ReactComponent as SuccessIcon } from "../../../assets/icons/toast-success.svg";
import { ReactComponent as ErrorIcon } from "../../../assets/icons/toast-error.svg";
import { ReactComponent as CloseIcon } from "../../../assets/icons/close.svg";

import styles from "./toastPopup.module.scss";

interface IProps {
  isSuccess?: boolean;
  title?: string;
  toast?: any;
  t?: any;
}

const ToastPopup: FC<IProps> = ({ isSuccess, toast, title, t }) => {
  return (
    <div className={styles.toast__wrapper}>
      {isSuccess ? (
        <SuccessIcon className={styles.icon} />
      ) : (
        <ErrorIcon className={styles.icon} />
      )}
      <span className={styles.title}>{title}</span>
      <CloseIcon
        onClick={() => toast.dismiss(t.id)}
        className={
          isSuccess ? styles.success__close_icon : styles.error__close_icon
        }
      />
    </div>
  );
};

export default ToastPopup;
