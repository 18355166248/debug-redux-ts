import React, { FC } from "react";
import Counter from "./Components/Counter";

interface Props {}

const App: FC<Props> = () => {
  return (
    <div>
      <Counter></Counter>
    </div>
  );
};

export default App;
