import React from 'react';
import { TextInputInterface, FieldStateClassNames } from '@root/types';
import { _debug } from '@root/constants';
import TestSuit from 'components/TestSuit';
import { ArkField, ValidityStateInterface } from 'ark-forms';

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
export const TextInput = (props: TextInputInterface & { transformInput?: (any) => any }): JSX.Element => {
  const {
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
  } = props;
  return (
    <ArkField
      name={name}
      validate={value => checkValidity(value, pattern, required)}
      initialValue={initialValue}
      {...rest}
    >
      {({ fieldProps, fieldState, formContext }) => {
        const id = (formContext.state.configuration.name || '') + '-' + name;
        if (_debug) {
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
                {
                  [fieldState.validity.className]: fieldState.validity.className && !fieldState.validity.valid,
                }
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
            {_debug && <TestSuit {...props} formContext={formContext} checkValidity={checkValidity} />}
          </div>
        );
      }}
    </ArkField>
  );
};
