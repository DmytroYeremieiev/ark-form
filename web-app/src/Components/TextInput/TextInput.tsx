import React from 'react';
import { Field } from 'ark-form';
import { TextInputInterface, FieldStateClassNames} from '../../types';
import { ValidityStateInterface  } from 'ark-form';

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
    valid: true
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
  ...rest
}: TextInputInterface): JSX.Element => {
  return (
    <Field
      name={name}
      validate={value => checkValidity(value, pattern, required)}
      initialValue={initialValue}
      {...rest}
    >
      {({ field, fieldState, formState }) => {
        const id = (formState.name || '') + '-' + name;
        // console.log('field', name, field.value, fieldState, formState);
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
              <input id={id} type='text' readOnly={readOnly} {...field} />
              <label htmlFor={id}>{label}</label>
            </div>
            {fieldState.validity.errorMessage &&
              !fieldState.validity.valid &&
              (fieldState.dirty || formState.submitted) && (
                <span className='error'>{fieldState.validity.errorMessage}</span>
              )}
          </div>
        );
      }}
    </Field>
  );
};