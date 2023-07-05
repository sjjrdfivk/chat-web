import * as React from "react";
import styles from "./index.module.scss";

interface IIconButton {
  onClick?: () => void;
  icon?: JSX.Element;
  text?: string;
  bordered?: boolean;
  shadow?: boolean;
  noDark?: boolean;
  className?: string;
  title?: string;
  disabled?: boolean;
}

export const IconButton: React.FC<IIconButton> = React.memo((props) => {
  return (
    <button
      className={
        styles["icon-button"] +
        ` ${props.bordered && styles.border} ${props.shadow && styles.shadow} ${
          props.className ?? ""
        } clickable`
      }
      onClick={props.onClick}
      title={props.title}
      disabled={props.disabled}
    >
      {props.icon && (
        <div
          className={
            styles["icon-button-icon"] + ` ${props.noDark && "no-dark"}`
          }
        >
          {props.icon}
        </div>
      )}
      {props.text && (
        <div className={styles["icon-button-text"]}>{props.text}</div>
      )}
    </button>
  );
});
