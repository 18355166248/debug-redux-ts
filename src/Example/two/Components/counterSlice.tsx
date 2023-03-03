import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchGetNum } from "../Service";
import { AppThunk, RootState } from "../store";

const colorList = ["red", "yellow", "green", "yellowgreen", "pink", "#000"];

interface CounterProps {
  value: number;
  status: "fulfilled" | "loading" | "failed";
  color: string;
}

const initialState: CounterProps = {
  value: 0,
  status: "fulfilled",
  color: "red",
};

const name = "counter";

export const addAsync = createAsyncThunk(
  `${name}/addAsync`,
  async (amount: number) => {
    const res = await fetchGetNum(amount);
    return res.data;
  }
);

export const counterSlice = createSlice({
  name,
  initialState,
  reducers: {
    add: (state) => {
      state.value += 1;
    },
    del: (state) => {
      state.value -= 1;
    },
    addByAmount: (state, action: PayloadAction<number>) => {
      state.value += action.payload;
    },
    setColor: (state, action: PayloadAction<string>) => {
      state.color = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addAsync.fulfilled, (state, action) => {
        state.status = "fulfilled";
        state.value += action.payload;
      })
      .addCase(addAsync.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export const { add, del, addByAmount, setColor } = counterSlice.actions;

export const selectCount = (state: RootState) => state.counter.value;
export const selectColor = (state: RootState) => state.counter.color;
export const selectStatus = (state: RootState) => state.counter.status;

export const changeColor = (): AppThunk => (dispatch, state) => {
  dispatch(setColor(colorList[Math.floor(Math.random() * 6)] || "#000"));
};

export default counterSlice.reducer;
