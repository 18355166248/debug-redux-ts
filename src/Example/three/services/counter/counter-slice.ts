import {
  createEntityAdapter,
  createSlice,
  PayloadAction,
  nanoid,
} from "@reduxjs/toolkit";

export interface Counter {
  value: number;
  id: string;
  loading?: boolean;
  intervalMs?: number;
}

const counterEntity = createEntityAdapter<Counter>();

export const counterSlice = createSlice({
  name: "counter",
  initialState: {
    counters: counterEntity.getInitialState(),
  },
  reducers: {
    add(
      state,
      { payload: { initialValue } }: PayloadAction<{ initialValue: number }>
    ) {
      counterEntity.addOne(state.counters, {
        value: initialValue,
        id: nanoid(),
      });
    },
    addMany(
      state,
      {
        payload: { initialValue, num },
      }: PayloadAction<{ initialValue: number; num: number }>
    ) {
      counterEntity.addMany(
        state.counters,
        Array(num)
          .fill({})
          .map(() => ({
            value: initialValue,
            id: nanoid(),
          }))
      );
    },
    updateLoadingById(
      state,
      { payload: { id, bool } }: PayloadAction<{ id: string; bool: boolean }>
    ) {
      counterEntity.updateOne(state.counters, {
        id,
        changes: { loading: bool },
      });
    },
    updateById(
      state,
      { payload: { id, num } }: PayloadAction<{ id: string; num: number }>
    ) {
      const prevValue = state.counters.entities[id]?.value;
      if (typeof prevValue === "number") {
        counterEntity.updateOne(state.counters, {
          id,
          changes: { value: num + prevValue },
        });
      }
    },
    // 异步更新
    updateAsync(
      state,
      {
        payload: { id, delayMs, num },
      }: PayloadAction<{ id: string; delayMs: number; num: number }>
    ) {},
    removeCounter(state, { payload: { id } }: PayloadAction<{ id: string }>) {
      counterEntity.removeOne(state.counters, id);
    },
    updateAsyncInterval(
      state,
      { payload: { id, ms } }: PayloadAction<{ id: string; ms: number }>
    ) {
      const prevValue = state.counters.entities[id]?.value;
      const prevMs = state.counters.entities[id]?.intervalMs;
      if (
        typeof prevValue === "number" &&
        Number.isFinite(ms) &&
        ms > 0 &&
        !prevMs
      ) {
        counterEntity.updateOne(state.counters, {
          id,
          changes: { intervalMs: ms },
        });
      }
    },
    clearUpdateAsyncInterval(
      state,
      { payload: { id } }: PayloadAction<{ id: string }>
    ) {
      delete state.counters.entities[id]?.intervalMs;
    },
  },
});

export const counterActions = counterSlice.actions;

export type CounterSlice = {
  [counterSlice.name]: ReturnType<typeof counterSlice["reducer"]>;
};

export const counterSelectors = counterEntity.getSelectors<CounterSlice>(
  (state) => state[counterSlice.name].counters
);
