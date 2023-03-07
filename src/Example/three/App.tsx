import { Unsubscribe } from "@reduxjs/toolkit";
import React, { FC, useEffect } from "react";
import ChangeTheme from "./components/ChangeTheme";
import CounterList from "./components/CounterList";
import CreateCounter from "./components/CreateCounter";
import { setupCounterListeners } from "./services/counter/counter-listeners";
import { setupThemeListeners } from "./services/theme/theme.linsteners";
import { startAppListening } from "./store";

interface Props {}

const App: FC<Props> = () => {
  useEffect(() => {
    const subscriptions: Unsubscribe[] = [
      setupCounterListeners(startAppListening),
      setupThemeListeners(startAppListening),
    ];

    return () => {
      subscriptions.forEach((unsubscribe) => unsubscribe());
    };
  }, []);
  return (
    <div className="main">
      <ChangeTheme />
      <CreateCounter />
      <CounterList />
    </div>
  );
};

export default App;
