import React, { FC, useState } from "react";
import {
  selectCount,
  add,
  del,
  addByAmount,
  addAsync,
  selectColor,
  selectStatus,
  changeColor,
} from "./counterSlice";
import "./Counter.scss";
import { useCounterDispatch, useCounterSelector } from "../hooks";

interface Props {}

const Counter: FC<Props> = () => {
  const [input, setInput] = useState(2);
  const count = useCounterSelector(selectCount);
  const color = useCounterSelector(selectColor);
  const status = useCounterSelector(selectStatus);
  const dispatch = useCounterDispatch();

  return (
    <div className="counter">
      <div className="num" style={{ color }}>
        {count}
      </div>
      <div className="btn-list">
        <div className="btn" onClick={() => dispatch(add())}>
          + 1
        </div>
        <div className="btn" onClick={() => dispatch(del())}>
          - 1
        </div>
        <div className="btn">
          <span className="mr-10" onClick={() => dispatch(addByAmount(input))}>
            增加{" "}
          </span>
          <span onClick={() => dispatch(addAsync(input))}>
            {status === "loading" ? "添加中....." : "异步添加数字"}
          </span>
          <input
            value={input}
            type="number"
            onChange={(e) => setInput(Number(e.target.value))}
          />
        </div>
        <div className="btn" onClick={() => dispatch(changeColor())}>
          改变颜色
        </div>
      </div>
    </div>
  );
};

export default Counter;
