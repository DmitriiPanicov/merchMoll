import {
  ChangeEvent,
  useCallback,
  useEffect,
  useState,
  useRef,
  FC,
} from "react";
import { useDispatch } from "react-redux";

import clsx from "clsx";

import { AppDispatch } from "../../../redux/reducer/store";

import ArrowIcon from "../../../assets/icons/chevron.svg";

import styles from "./customMultiSelect.module.scss";

interface IProps {
  isShowPlaceholder?: boolean;
  placeholder?: string;
  className?: string;
  inputValues?: any;
  pageName?: string;
  resetPages?: any;
  setState?: any;
  reducer?: any;
  options?: any;
  action?: any;
  offset?: any;
  limit?: any;
  name?: any;
  page?: any;
}

const CustomMultiSelect: FC<IProps> = ({
  isShowPlaceholder,
  placeholder,
  inputValues,
  resetPages,
  pageName,
  setState,
  options,
  reducer,
  action,
  offset,
  limit,
  name,
  page,
}) => {
  const dispatch = useDispatch<AppDispatch>();

  const [selectedOptions, setSelectedOptions] = useState<any[]>(
    pageName === "unloadReportsPhotosModal"
      ? []
      : mapOptions(inputValues[name] || [], options)
  );
  const [defaultMultiselectValue, setDefaultMultiselectValue] =
    useState<string>(placeholder as string);
  const [isPending, setIsPending] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const selectRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const filteredOptions =
    options &&
    options
      ?.filter((option: any) =>
        option?.label?.toLowerCase()?.includes(searchTerm?.toLowerCase())
      )
      ?.sort((a: any, b: any) => a.label.localeCompare(b.label));

  const handleClickAcceptBtn = useCallback(() => {
    setIsPending(true);
    setIsOpen(false);

    if (
      pageName !== "unloadReportsPhotosModal" &&
      pageName !== "integrationErrors"
    ) {
      resetPages();
    }
  }, [pageName, resetPages]);

  useEffect(() => {
    if (isPending && pageName) {
      const filter =
        pageName === "integrationErrors"
          ? selectedOptions.map((option: any) => ({
              id: option.value,
              name: option.label,
            }))
          : {
              [name]: !!selectedOptions.length
                ? selectedOptions.map((option: any) => {
                    return (pageName === "visitSchedule" ||
                      pageName === "clientsList") &&
                      name !== "statuses"
                      ? {
                          id: option.value,
                        }
                      : option.value;
                  })
                : null,
            };

      if (pageName === "unloadReportsPhotosModal") {
        setState(selectedOptions.map((elem: any) => elem.label));
      } else if (pageName === "integrationErrors") {
        dispatch(
          reducer({
            ...inputValues,
            [name]: filter,
          })
        );
        dispatch(action(limit, offset));
      } else {
        dispatch(reducer({ ...inputValues, ...filter }));
        dispatch(action(limit, pageName === "visitSchedule" ? page : offset));
      }

      setIsPending(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPending]);

  useEffect(() => {
    const handleClickOutsideModal = (e: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(e.target as Node) &&
        selectRef.current &&
        !selectRef.current.contains(e.target as Node)
      ) {
        handleClickAcceptBtn();
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutsideModal);

    return () => {
      document.removeEventListener("mousedown", handleClickOutsideModal);
    };
  }, [handleClickAcceptBtn]);

  useEffect(() => {
    setDefaultMultiselectValue(
      selectedOptions?.length
        ? [selectedOptions?.length, options?.length].join("/")
        : (placeholder as string)
    );
  }, [options?.length, selectedOptions?.length, placeholder]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.select();
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleOpenModal = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (option: any) => {
    const isSelected = selectedOptions?.some(
      (selectedOption) => selectedOption.value === option.value
    );

    if (isSelected) {
      const updatedOptions = selectedOptions?.filter(
        (selectedOption) => selectedOption.value !== option.value
      );
      setSelectedOptions(updatedOptions);
    } else {
      const updatedOptions = [...selectedOptions, option];
      setSelectedOptions(updatedOptions);
    }
  };

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e?.target?.value);
  };

  const handleSelectAll = () => {
    if (filteredOptions.length) {
      setSelectedOptions(filteredOptions);
    } else {
      setSelectedOptions(options);
    }
  };

  const handleDeselectAll = () => {
    setSelectedOptions([]);
  };

  function mapOptions(values: any, options: any) {
    const condition =
      pageName === "integrationErrors" ||
      pageName === "visitSchedule" ||
      pageName === "clientsList";

    return values.map((elem: any) => {
      return {
        value: condition ? elem.id : elem,
        label: condition
          ? options.find((option: any) => option.value === elem.id)?.name
          : options.find((option: any) => option.value === elem)?.label,
      };
    });
  }

  return (
    <div className={styles.select__wrapper}>
      <span
        className={clsx(
          styles.custom__floating_placeholer,
          selectedOptions.length >= 1 &&
            isShowPlaceholder &&
            styles.active__floating_placeholder
        )}
      >
        {placeholder}
      </span>
      <div
        className={styles.input__block}
        onClick={handleOpenModal}
        ref={selectRef}
      >
        <input
          placeholder={defaultMultiselectValue}
          className={styles.input}
          type="text"
          readOnly
        />
        <img className={styles.icon} src={ArrowIcon} alt="arrow" />
      </div>
      {isOpen && (
        <div className={styles.modal} ref={modalRef}>
          <input
            onChange={handleSearchChange}
            className={styles.search}
            placeholder="Поиск..."
            value={searchTerm}
            ref={inputRef}
            type="text"
          />
          <div className={styles.btns}>
            <button className={styles.btn} onClick={handleSelectAll}>
              Выбрать все
            </button>
            <button className={styles.btn} onClick={handleDeselectAll}>
              Убрать все
            </button>
          </div>
          <ul className={styles.list}>
            {filteredOptions &&
              filteredOptions?.map((option: any, index: any) => (
                <li
                  key={index}
                  className={`${styles.elem} ${
                    selectedOptions?.some(
                      (selectedOption) => selectedOption.value === option.value
                    )
                      ? styles.active__elem
                      : ""
                  }`}
                  onClick={() => handleOptionClick(option)}
                >
                  {option.label}
                </li>
              ))}
          </ul>
          <button className={styles.accept__btn} onClick={handleClickAcceptBtn}>
            Применить
          </button>
        </div>
      )}
    </div>
  );
};

export default CustomMultiSelect;
