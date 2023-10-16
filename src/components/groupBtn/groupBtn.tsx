import { FC, useEffect, useRef, useState } from "react";

import ArrowRight from "../../assets/icons/arrowRight.svg";

import styles from "./groupBtn.module.scss";

interface IGroupBtnProps {
  children?: any;
}

const GroupBtn: FC<IGroupBtnProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const modalRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleDocumentClick = (e: MouseEvent) => {
      const headerBtnModal = document.getElementById("headerBtnModal");

      if (headerBtnModal?.getAttribute("id") === "headerBtnModal") {
        return;
      } else {
        if (
          modalRef.current &&
          !modalRef.current.contains(e.target as Node) &&
          btnRef.current &&
          !btnRef.current.contains(e.target as Node)
        ) {
          setIsOpen(false);
        }
      }
    };

    document.addEventListener("mousedown", handleDocumentClick);

    return () => {
      document.removeEventListener("mousedown", handleDocumentClick);
    };
  }, []);

  const handleOpenModal = (event: React.MouseEvent) => {
    event.stopPropagation();
    setIsOpen(!isOpen);
  };

  return (
    <div className={styles.wrapper} id="groupBtn">
      <div className={styles.btn} onClick={handleOpenModal} ref={btnRef}>
        <span className={styles.title}>Еще</span>
        <img src={ArrowRight} alt="arrow" />
      </div>
      {isOpen && (
        <div className={styles.modal} ref={modalRef}>
          <div className={styles.modal__content}>{children}</div>
        </div>
      )}
    </div>
  );
};

export default GroupBtn;
