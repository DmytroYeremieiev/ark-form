import React from 'react';
import { ArkForm, FormContextInterface } from 'ark-forms';
import classnames from 'classnames';

export interface FormInterface {
  name: string;
  initialValues?;
  contextRef?: React.MutableRefObject<FormContextInterface>;
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
      {({ state, formProps }) => {
        if (process.env.NODE_ENV !== 'production') {
          // console.log('<ArkForm/>', state);
        }
        return (
          <form
            name={name}
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
