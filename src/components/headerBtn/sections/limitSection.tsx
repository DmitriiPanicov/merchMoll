import { FC } from "react";

import styles from "../headerBtn.module.scss";

interface IProps {
  handleChangeLimitInput: any;
  error: string;
}

const LimitSections: FC<IProps> = ({ handleChangeLimitInput, error }) => {
  return (
    <div className={styles.block__info}>
      <div className={styles.limit__block}>
        <span>Лимит выгрузки:</span>
        <div className={styles.error__input_block}>
          <input
            type="number"
            className={error ? styles.error__input : styles.limit__input}
            onChange={(event) => handleChangeLimitInput(event)}
          />
          {error && <span className={styles.error}>{error}</span>}
        </div>
      </div>
    </div>
  );
};

export default LimitSections;
