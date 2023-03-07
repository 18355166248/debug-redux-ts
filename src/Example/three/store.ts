import {
  configureStore,
  createListenerMiddleware,
  ListenerEffectAPI,
  TypedStartListening,
} from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

import { counterSlice } from "./services/counter/counter-slice";
import { themeSlice } from "./services/theme/theme.slice";

const listenerMiddleware = createListenerMiddleware({
  onError: () => console.error,
});

const store = configureStore({
  reducer: {
    counter: counterSlice.reducer,
    theme: themeSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().prepend(listenerMiddleware.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStartListening = TypedStartListening<RootState, AppDispatch>;
export type AppListenerEffectApi = ListenerEffectAPI<RootState, AppDispatch>;

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const startAppListening =
  listenerMiddleware.startListening as AppStartListening;

export default store;
