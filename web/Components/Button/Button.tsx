import React from 'react';

import styles from './Button.module.css';
import classname from 'classnames';

type ButtonProps = {
  children: JSX.Element | string;
  type?: 'button' | 'submit' | 'reset';
  classNames?: string | string[];
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
};
export const Button = ({ children, classNames, ...rest }: ButtonProps): JSX.Element => {
  return (
    <button className={classname(styles['button'], classNames)} {...rest}>
      {children}
    </button>
  );
};
