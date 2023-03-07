import { AppListenerEffectApi, AppStartListening } from "../../store";
import { themeActions } from "./theme.slice";

function listenEffect(
  { payload }: ReturnType<typeof themeActions.changeTheme>,
  { getState, dispatch, condition }: AppListenerEffectApi
) {
  console.log("payload", payload);
  document.documentElement.classList.toggle("dark", payload.theme === "dark");
}

export function setupThemeListeners(startListening: AppStartListening) {
  const subscriptions = [
    startListening({
      actionCreator: themeActions.changeTheme,
      effect: listenEffect,
    }),
  ];

  return () => {
    subscriptions.forEach((unsubscribe) => unsubscribe());
  };
}
