import React from "react";

import "./Button.scss";
import classname from "classnames";

type ButtonProps = {
  children: JSX.Element | string;
  type?: "button" | "submit" | "reset";
  classNames?: string | string[];
};
export const Button = ({
  children,
  type,
  classNames
}: ButtonProps): JSX.Element => {
  return (
    <button className={classname("button", classNames)} type={type}>
      {children}
    </button>
  );
};
