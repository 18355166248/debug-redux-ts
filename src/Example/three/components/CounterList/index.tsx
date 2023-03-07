import React, { FC } from "react";
import { counterSelectors } from "../../services/counter/counter-slice";
import { useAppSelector } from "../../store";
import Counter from "./Counter";
import styles from "./index.module.scss";

interface Props {}

const CounterList: FC<Props> = () => {
  const counterIds = useAppSelector((state) =>
    counterSelectors.selectIds(state)
  );
  return (
    <div className={styles["counter-list"]}>
      {counterIds.map((id) => (
        <Counter key={id} counterId={id} />
      ))}
    </div>
  );
};

export default CounterList;
