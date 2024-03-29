import React from 'react';
import { ArkField } from '../src';
import { TextInputInterface } from '../types';
import { ValidityStateInterface } from '../src';

export enum FieldStateClassNames {
  filled = 'field-filled',
  pristine = 'field-pristine',
  dirty = 'field-dirty',
  valid = 'field-valid',
  invalid = 'field-invalid',
  requiredError = 'required-error',
  patternError = 'pattern-error',
  forceValidation = 'force-validation',
}

import classnames from 'classnames';

const checkValidity = (
  value?: string,
  pattern?: {
    regexp: RegExp;
    message?: string;
  },
  required?: boolean
): ValidityStateInterface => {
  const result: ValidityStateInterface = {
    valid: true,
  };
  if (required && !value) {
    result.className = FieldStateClassNames.requiredError;
    result.valid = false;
    return result;
  }
  if (pattern && value && !pattern.regexp.test(value)) {
    result.className = FieldStateClassNames.patternError;
    result.valid = false;
    result.errorMessage = pattern.message || 'Invalid value';
    return result;
  }
  return result;
};
export const TextInput = ({
  initialValue = '',
  forceValidation,
  name,
  label,
  pattern,
  required,
  readOnly,
  statesRef = { current: null },
  ...rest
}: TextInputInterface): JSX.Element => {
  return (
    <ArkField
      name={name}
      validate={value => checkValidity(value, pattern, required)}
      initialValue={initialValue}
      {...rest}
    >
      {props => {
        statesRef.current = props;
        const { fieldProps, fieldState, formContext } = props;
        const id = (formContext.state.configuration.name || '') + '-' + name;
        if (process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'test') {
          console.log('field', name, fieldProps.value, fieldState, formContext.state, formContext.state.fieldsData);
        }
        return (
          <div>
            <div
              title={`${name} field`}
              className={`txo-input-container ${classnames(
                {
                  [FieldStateClassNames.filled]: fieldState.filled,
                  [FieldStateClassNames.pristine]: fieldState.pristine,
                  [FieldStateClassNames.dirty]: fieldState.dirty,
                  [FieldStateClassNames.invalid]: !fieldState.validity.valid,
                  [FieldStateClassNames.valid]: fieldState.validity.valid,
                  [FieldStateClassNames.forceValidation]: forceValidation,
                },
                fieldState.validity.className
              )}`}
            >
              <input id={id} type='text' readOnly={readOnly} {...fieldProps} />
              <label htmlFor={id}>{label}</label>
            </div>
            {fieldState.validity.errorMessage &&
              !fieldState.validity.valid &&
              (fieldState.dirty || formContext.state.submitted) && (
                <span className='error'>{fieldState.validity.errorMessage}</span>
              )}
          </div>
        );
      }}
    </ArkField>
  );
};
