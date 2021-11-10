import React from 'react';
import { ArkForm, FormContextInterface } from 'ark-forms';
import classnames from 'classnames';
import { _debug } from '@root/constants';

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
      {({ formContext, formProps }) => {
        if (_debug) {
          console.log('<ArkForm/>', formContext.state);
        }
        return (
          <form
            name={name}
            className={classnames({
              [ClassNames.dirty]: formContext.state.dirty,
              [ClassNames.submitted]: formContext.state.submitted,
              [ClassNames.pristine]: formContext.state.pristine,
              [ClassNames.invalid]: formContext.state.invalid,
              [ClassNames.valid]: formContext.state.valid,
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
