import { FC } from "react";

import styles from "./loader.module.scss";

const Loader: FC = () => {
  return (
    <div className={styles.linearActivity}>
      <div className={styles.indeterminate}></div>
    </div>
  );
};

export default Loader;
