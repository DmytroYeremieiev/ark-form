import React from 'react';
import { ArkForm, Form as FormElem } from '../src/';
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
      {({ state, formHooks }) => {
        console.log('<ArkForm/>', state);
        return (
          <FormElem
            name={name}
            className={classnames({
              [ClassNames.dirty]: state.dirty,
              [ClassNames.submitted]: state.submitted,
              [ClassNames.pristine]: state.pristine,
              [ClassNames.invalid]: state.invalid,
              [ClassNames.valid]: state.valid,
            })}
            {...formHooks}
          >
            {children}
          </FormElem>
        );
      }}
    </ArkForm>
  );
};