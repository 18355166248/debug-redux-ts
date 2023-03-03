import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "./store";

export const useCounterDispatch = () => useDispatch<AppDispatch>();
export const useCounterSelector: TypedUseSelectorHook<RootState> = useSelector;
