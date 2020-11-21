import React from 'react';

import styles from './Button.module.css';
import classname from 'classnames';

type ButtonProps = {
  children: JSX.Element;
  type?: 'button' | 'submit' | 'reset';
  classNames?: string | string[];
};
export const Button = ({ children, type, classNames }: ButtonProps): JSX.Element => {
  return (
    <button className={classname(styles['button'], classNames)} type={type}>
      {children}
    </button>
  );
};
