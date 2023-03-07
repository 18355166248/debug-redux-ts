import React, { FC } from "react";
import { themeActions } from "../../services/theme/theme.slice";
import { useAppDispatch, useAppSelector } from "../../store";
import styles from "./index.module.scss";

interface Props {}

const ChangeTheme: FC<Props> = () => {
  const dispatch = useAppDispatch();
  const theme = useAppSelector((state) => state.theme);

  function changeTheme() {
    dispatch(
      themeActions.changeTheme({
        theme: theme.theme === "dark" ? "light" : "dark",
      })
    );
  }

  return (
    <div className={styles["change-theme"]}>
      <svg
        className={styles.icon}
        onClick={changeTheme}
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {theme.theme === "light" ? (
          <>
            <circle cx="12" cy="12" r="5" />
            <line x1="12" y1="1" x2="12" y2="3" />
            <line x1="12" y1="21" x2="12" y2="23" />
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
            <line x1="1" y1="12" x2="3" y2="12" />
            <line x1="21" y1="12" x2="23" y2="12" />
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
          </>
        ) : (
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        )}
      </svg>
    </div>
  );
};

export default ChangeTheme;
