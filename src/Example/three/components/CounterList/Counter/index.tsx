import { EntityId } from "@reduxjs/toolkit";
import React, { FC } from "react";
import {
  counterActions,
  counterSelectors,
} from "../../../services/counter/counter-slice";
import { useAppDispatch, useAppSelector } from "../../../store";
import styles from "./index.module.scss";

interface Props {
  counterId: EntityId;
}

const twoMs = 2_000;

const Counter: FC<Props> = ({ counterId }) => {
  const appDispatch = useAppDispatch();
  const detail = useAppSelector((state) =>
    counterSelectors.selectById(state, counterId)
  );

  if (!detail) return null;
  const { id } = detail;

  const add = () => appDispatch(counterActions.updateById({ id, num: 1 }));
  const del = () => appDispatch(counterActions.updateById({ id, num: -1 }));
  const addAfterMs = () =>
    appDispatch(counterActions.updateAsync({ id, num: 1, delayMs: twoMs }));
  const deleteCounter = () => appDispatch(counterActions.removeCounter({ id }));
  const addEveryM = () => {
    if (detail.intervalMs) {
      appDispatch(counterActions.clearUpdateAsyncInterval({ id }));
    } else {
      appDispatch(counterActions.updateAsyncInterval({ id, ms: 1_000 }));
    }
  };

  return (
    <div className={styles.counter}>
      <div className={styles.left}>
        <div className={styles.num}>数量: {detail.value}</div>
        <div className={styles.id}>ID: {detail.id}</div>
        <div className={`${styles.btn} ${styles.add}`} onClick={add}>
          +
        </div>
        <div className={`${styles.btn} ${styles.del}`} onClick={del}>
          -
        </div>
        <div
          className={`${styles.btn} ${styles.addEveryM}`}
          onClick={addEveryM}
        >
          {detail.intervalMs ? "暂停定时器" : "+1/s"}
        </div>
        <div
          className={`${styles.btn} ${styles.addAfterM}`}
          onClick={addAfterMs}
        >
          +1 After {twoMs / 1_000}s
        </div>
        {detail.loading && <div className={styles.loading}>更新中</div>}
      </div>
      <div className={styles.right}>
        <div className={`${styles.btn} ${styles.del}`} onClick={deleteCounter}>
          -
        </div>
      </div>
    </div>
  );
};

export default Counter;
