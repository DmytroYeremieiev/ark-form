import React from 'react';
import { ArkForm } from 'ark-forms';
import classnames from 'classnames';

export interface FormInterface {
  name: string;
  initialValues?;
  onSubmit: (event: React.FormEvent<HTMLFormElement>, data) => void;
  onChange?: () => void;
  children: React.ReactChild | React.ReactChild[];
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
  forceValidation?: boolean;
}

export enum ClassNames {
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
        const { state } = formContext;
        if (process.env.NODE_ENV !== 'production') {
          // console.log('<ArkForm/>', state);
        }
        return (
          <form
            className={classnames({
              [ClassNames.dirty]: state.dirty,
              [ClassNames.submitted]: state.submitted,
              [ClassNames.pristine]: state.pristine,
              [ClassNames.invalid]: state.invalid,
              [ClassNames.valid]: state.valid,
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
