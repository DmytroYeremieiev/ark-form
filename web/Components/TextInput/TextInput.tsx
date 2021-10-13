import React, { useState } from 'react';
import { TextInputInterface, FieldStateClassNames } from '../../types';
import { ArkField, defaultFieldState, useFormContext, ValidityStateInterface } from 'ark-forms/src';

import classnames from 'classnames';

import styles from '../txoInput.module.scss';

const TestSuit = ({ name, pattern, required, validateOnChange }: TextInputInterface) => {
  const [testSuiteValue, setTestSuiteValue] = useState('');
  const formContext = useFormContext();
  return (
    <div className='test-suit'>
      <button
        type='button'
        onClick={() =>
          formContext.setFieldState(name, {
            configuration: {
              validate: value => ({ ...checkValidity(value, pattern, required), valid: true }),
            },
          })
        }
      >
        Set valid
      </button>
      <button
        type='button'
        onClick={() =>
          formContext.setFieldState(name, {
            configuration: {
              validate: value => ({ ...checkValidity(value, pattern, required), valid: false }),
            },
          })
        }
      >
        Set Invalid
      </button>
      <br></br>
      <button type='button' onClick={() => formContext.setFieldState(name, { dirty: true, pristine: false })}>
        Set Dirty
      </button>
      <button type='button' onClick={() => formContext.setFieldState(name, { dirty: false, pristine: true })}>
        Set Pristine
      </button>
      <br></br>
      <button
        type='button'
        onClick={() =>
          formContext.setFieldState(name, {
            configuration: {
              validate: value => checkValidity(value, pattern, false),
            },
          })
        }
      >
        Set Non-required
      </button>
      <button
        type='button'
        onClick={() =>
          formContext.setFieldState(name, {
            configuration: {
              validate: value => checkValidity(value, pattern, true),
            },
          })
        }
      >
        Set Required
      </button>
      <button
        type='button'
        onClick={() =>
          formContext.setFieldState(name, {
            ...defaultFieldState,
            configuration: {
              name,
              validateOnChange: validateOnChange,
              validateOnBlur: formContext.state.configuration.validateOnBlur,
              validate: value => checkValidity(value, pattern, required),
            },
          })
        }
      >
        RESET
      </button>
      <div className='test-suit-set-value'>
        <input
          id={name + 'test'}
          type='text'
          value={testSuiteValue}
          onChange={event => setTestSuiteValue(event.target.value)}
        />
        <button type='button' onClick={() => formContext.setFieldValue(name, testSuiteValue)}>
          Set value
        </button>
      </div>
    </div>
  );
};
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
        const _debug = process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'test';
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
                { [fieldState.validity.className]: fieldState.validity.className && !fieldState.validity.valid }
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
            {_debug && <TestSuit {...props} />}
          </div>
        );
      }}
    </ArkField>
  );
};
