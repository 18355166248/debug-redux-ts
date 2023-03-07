import {
  AnyAction,
  isAllOf,
  isAnyOf,
  PayloadAction,
  Unsubscribe,
} from "@reduxjs/toolkit";
import { AppListenerEffectApi, AppStartListening } from "../../store";
import { counterActions, counterSelectors } from "./counter-slice";

function shouldStopAsyncTaskOf(id: string) {
  return isAllOf(
    isAnyOf(
      counterActions.removeCounter,
      counterActions.clearUpdateAsyncInterval
    ),
    (action: AnyAction): action is PayloadAction<string> =>
      action?.payload.id === id
  );
}

async function onUpdateAsync(
  {
    payload: { id, delayMs, num },
  }: ReturnType<typeof counterActions.updateAsync>,
  { getState, dispatch, condition }: AppListenerEffectApi
) {
  const counter = counterSelectors.selectById(getState(), id);
  if (!counter) {
    console.error("没有该数据");
    return;
  }
  // 异步调用方法
  dispatch(counterActions.updateLoadingById({ id, bool: true }));
  if (await condition(shouldStopAsyncTaskOf(id), delayMs)) {
    console.log(`打断 id: ${id} 的异步更新`);
  } else {
    dispatch(counterActions.updateById({ id, num: 1 }));
    dispatch(counterActions.updateLoadingById({ id, bool: false }));
  }
}

async function onUpdateAsyncInterval(
  {
    payload: { id, ms },
  }: ReturnType<typeof counterActions.updateAsyncInterval>,
  { getState, dispatch, condition, getOriginalState }: AppListenerEffectApi
) {
  const counter = counterSelectors.selectById(getState(), id);
  const beforeCounter = counterSelectors.selectById(getOriginalState(), id);
  console.log(counter, beforeCounter);

  const intervalRef = setInterval(() => {
    dispatch(counterActions.updateById({ id, num: 1 }));
  }, ms);

  await condition(shouldStopAsyncTaskOf(id));
  console.log(`清除 id: ${id} 的定时器`);

  clearInterval(intervalRef);
}

export function setupCounterListeners(
  startListening: AppStartListening
): Unsubscribe {
  const subscriptions = [
    startListening({
      actionCreator: counterActions.updateAsync,
      effect: onUpdateAsync,
    }),
    startListening({
      actionCreator: counterActions.updateAsyncInterval,
      effect: onUpdateAsyncInterval,
    }),
  ];

  return () => {
    subscriptions.forEach((unsubscribe) => unsubscribe());
  };
}
