import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type ThemeProps = "light" | "dark";

export interface ThemeInitialProps {
  theme: ThemeProps;
}

export const themeSlice = createSlice({
  name: "theme",
  initialState: {
    theme: "light",
  } as ThemeInitialProps,
  reducers: {
    changeTheme(
      state,
      { payload: { theme } }: PayloadAction<{ theme: ThemeProps }>
    ) {
      state.theme = theme;
    },
  },
});

export const themeActions = themeSlice.actions;
