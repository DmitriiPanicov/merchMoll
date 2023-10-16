import { FC } from "react";

import styles from "./circleLoader.module.scss";

const CircleLoader: FC = () => {
  return (
    <div className={styles.spinner}>
      <div></div>
      <div></div>
    </div>
  );
};

export default CircleLoader;
