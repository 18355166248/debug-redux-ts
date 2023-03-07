import React, { FC, useState } from "react";
import { counterActions } from "../../services/counter/counter-slice";
import { useAppDispatch } from "../../store";

interface Props {}

const CreateCounter: FC<Props> = () => {
  const appDispatch = useAppDispatch();
  const [initialValue, setInitialValue] = useState(0);

  function add() {
    appDispatch(counterActions.add({ initialValue }));
  }

  function addMany() {
    appDispatch(counterActions.addMany({ initialValue, num: 3 }));
  }

  return (
    <div style={{ userSelect: "none" }}>
      <div>
        <div style={{ width: 100 }}>初始化值: {initialValue}</div>
        <input
          type="range"
          min={0}
          max={10}
          value={initialValue}
          onChange={(e) => setInitialValue(Number(e.target.value))}
        />
      </div>
      <button onClick={add} style={{ marginRight: 10, width: 80 }}>
        增加
      </button>
      <button onClick={addMany} style={{ width: 80 }}>
        增加三个
      </button>
    </div>
  );
};

export default CreateCounter;
