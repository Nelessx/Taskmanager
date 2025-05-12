import styles from "./FunctionCard.module.css";
import { correctLight, crosLight } from "../../assets/index.js";

export const TasksFilterCard = ({ options, optionHandlder, currentSort }) => {
  return (
    <div className={styles["filter-card"]}>
      {options.map((option) => (
        <p
          key={option}
          className={`${styles["filter-option"]} ${
            currentSort?.toLowerCase() === option.toLowerCase()
              ? styles["active"]
              : ""
          }`}
          onClick={(e) => {
            e.stopPropagation();
            optionHandlder(false, e, option);
          }}
        >
          {option}
        </p>
      ))}
    </div>
  );
};

export const TaskOptionConfirmCard = ({ optionHandeler, closeHander }) => {
  return (
    <div
      className={styles["confirm-card-main"]}
      onMouseLeave={(e) => closeHander(e)}
    >
      <p>Are you sure?</p>
      <div className={styles["options"]}>
        <div
          className={styles["option-correct"]}
          onClick={(e) => optionHandeler(e)}
        >
          <img src={correctLight} alt={"correctimg"} />
        </div>
        <div className={styles["option-cross"]} onClick={(e) => closeHander(e)}>
          <img src={crosLight} alt={"cross"} />
        </div>
      </div>
    </div>
  );
};
