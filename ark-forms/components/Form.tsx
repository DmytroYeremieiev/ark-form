import React from 'react';
import { ArkForm } from '../src/';
import classnames from 'classnames';

export interface FormInterface {
  name: string;
  initialValues?;
  onSubmit: (event: React.FormEvent<HTMLFormElement>, data) => void;
  onChange?: () => void;
  children: React.ReactChild | React.ReactChild[];
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
}

export enum FormStateClassNames {
  dirty = 'form-dirty',
  submitted = 'form-submitted',
  pristine = 'form-pristine',
  invalid = 'form-invalid',
  valid = 'form-valid',
}

export const Form = ({
  name,
  onSubmit,
  children,
  validateOnChange = false,
  validateOnBlur = true,
}: FormInterface): JSX.Element => {
  return (
    <ArkForm name={name} onSubmit={onSubmit} validateOnChange={validateOnChange} validateOnBlur={validateOnBlur}>
      {({ formContext, formProps }) => {
        if (process.env.NODE_ENV !== 'production') {
          // console.log('<ArkForm/>', state);
        }
        return (
          <form
            name={name}
            className={classnames({
              [FormStateClassNames.dirty]: formContext.state.dirty,
              [FormStateClassNames.submitted]: formContext.state.submitted,
              [FormStateClassNames.pristine]: formContext.state.pristine,
              [FormStateClassNames.invalid]: formContext.state.invalid,
              [FormStateClassNames.valid]: formContext.state.valid,
            })}
            {...formProps}
          >
            {children}
          </form>
        );
      }}
    </ArkForm>
  );
};
