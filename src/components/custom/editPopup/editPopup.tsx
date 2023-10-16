import { FC, useEffect, useRef } from "react";
import { registerLocale } from "react-datepicker";
import DatePicker from "react-datepicker";

import ru from "date-fns/locale/ru";

import CheckMark from "../../../assets/icons/checkMark.svg";
import Close from "../../../assets/icons/close.svg";

interface IEditPopupProps {
  handleClickAcceptRenameBtn: any;
  handleClickCancelRenameBtn: any;
  handleAcceptOnKeyPress?: any;
  handleChangeValue: any;
  defaultValue: any;
  className: string;
  purpose?: string;
  modalRef: any;
  type?: string;
}

const EditPopup: FC<IEditPopupProps> = ({
  handleClickAcceptRenameBtn,
  handleClickCancelRenameBtn,
  handleAcceptOnKeyPress,
  handleChangeValue,
  defaultValue,
  className,
  modalRef,
  purpose,
  type = "text",
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    registerLocale("ru", ru);

    if (inputRef.current) {
      inputRef.current.select();
      inputRef.current.focus();
    }
  }, []);

  return (
    <div className={className} ref={modalRef}>
      {purpose === "photoDate" ? (
        <div className="claim__update_date">
          <DatePicker
            popperClassName="edit__datepicker_popper"
            onKeyDown={handleAcceptOnKeyPress}
            onFocus={handleAcceptOnKeyPress}
            dateFormat="MM/dd/yyyy HH:mm"
            onChange={handleChangeValue}
            selected={defaultValue}
            timeInputLabel="Время:"
            popperPlacement="top"
            showTimeInput
            locale={ru}
            name="date"
            autoFocus
            inline
          />
        </div>
      ) : (
        <input
          onKeyPress={handleAcceptOnKeyPress}
          onChange={handleChangeValue}
          defaultValue={defaultValue}
          className="rename__input"
          ref={inputRef}
          type={type}
        />
      )}
      <div className="btns__block">
        <button
          onClick={handleClickAcceptRenameBtn}
          className="accept__name_btn"
        >
          <img className="check__mark_icon" src={CheckMark} alt="accept" />
        </button>
        <button
          onClick={handleClickCancelRenameBtn}
          className="cancel__name_btn"
        >
          <img src={Close} alt="close" />
        </button>
      </div>
    </div>
  );
};

export default EditPopup;
