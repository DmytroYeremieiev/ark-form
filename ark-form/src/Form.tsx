import React from 'react';

export type FormProps = React.FormHTMLAttributes<HTMLFormElement> & {
  children;
};

export const Form = ({ children, ...rest }: FormProps): JSX.Element => {
  return <form {...rest}>{children}</form>;
};
