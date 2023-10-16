import { FC, useEffect, useRef, useState } from "react";

import ArrowIcon from "../../../assets/icons/chevron.svg";

import styles from "./limitSelect.module.scss";

const options = [
  { value: 10, label: 10 },
  { value: 20, label: 20 },
  { value: 30, label: 30 },
  { value: 40, label: 40 },
  { value: 50, label: 50 },
  { value: 100, label: 100 },
  { value: 200, label: 200 },
  { value: 1000, label: 1000 },
  { value: 10000, label: 10000 },
  { value: 50000, label: 50000 },
  { value: 100000, label: 100000 },
];

interface ILimitSelectProps {
  pageName?: string;
  propsChange: any;
  limit: any;
}

const LimitSelect: FC<ILimitSelectProps> = ({
  propsChange,
  pageName,
  limit,
}) => {
  const [actualLimit, setActualLimit] = useState<string>(limit);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const selectRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleDocumentClick = (e: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(e.target as Node) &&
        selectRef.current &&
        !selectRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
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

  const handleOptionClick = (option: any) => {
    const textValue = option.target.innerText;

    if (parseFloat(textValue) !== limit) {
      propsChange({ value: parseFloat(textValue) });
      setActualLimit(textValue);
    }

    setIsOpen(false);
  };

  return (
    <div className={styles.select__wrapper}>
      <div
        className={styles.input__block}
        onClick={handleOpenModal}
        ref={selectRef}
      >
        <input
          placeholder={limit !== actualLimit ? actualLimit : limit}
          className={styles.input}
          type="text"
          readOnly
        />
        <img className={styles.icon} src={ArrowIcon} alt="arrow" />
      </div>
      {isOpen && (
        <div className={styles.modal} ref={modalRef}>
          <ul className={styles.list}>
            {(pageName === "visitSchedule"
              ? options?.slice(0, 6)
              : options
            )?.map(({ value, label }) => (
              <li
                className={limit === value ? styles.active__elem : styles.elem}
                onClick={handleOptionClick}
                key={value}
              >
                <span>{label}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default LimitSelect;
