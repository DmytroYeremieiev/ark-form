import React from 'react';
import { Field } from 'ark-forms/src';
import { TextInputInterface, FieldStateClassNames } from '../../types';
import { ValidityStateInterface } from 'ark-forms/src';

import classnames from 'classnames';

import styles from '../txoInput.module.scss';

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
  className,
  pattern,
  required,
  readOnly,
  transformInput = value => value,
  ...rest
}: TextInputInterface): JSX.Element => {
  return (
    <Field
      name={name}
      validate={value => checkValidity(value, pattern, required)}
      initialValue={initialValue}
      {...rest}
    >
      {({ fieldProps, fieldState, formContext }) => {
        const id = (formContext.state.configuration.name || '') + '-' + name;
        if (process.env.NODE_ENV !== 'production') {
          console.log('field', name, fieldProps.value, fieldState, formContext.state, formContext.state.fieldsData);
        }
        return (
          <div className={classnames(styles['txo-input'], className)}>
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
              <input id={id} type='text' readOnly={readOnly} {...fieldProps} value={transformInput(fieldProps.value)} />
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
    </Field>
  );
};
