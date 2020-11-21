import React from 'react';

import './Button.module.css';

export const Button = ({ children, type }): JSX.Element => {
  return (
    <button className='button' type={type}>
      {children}
    </button>
  );
};
