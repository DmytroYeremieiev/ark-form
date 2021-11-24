import React, { useState } from 'react';
import { TextInputInterface } from 'types';
import { defaultFieldState, FormContextInterface, ValidityStateInterface } from 'ark-forms';

const TestSuit = ({
  name,
  pattern,
  required,
  checkValidity,
  formContext,
}: TextInputInterface & {
  formContext: FormContextInterface;
  checkValidity: (value, ...rest) => ValidityStateInterface;
}) => {
  const [testSuiteValue, setTestSuiteValue] = useState('');
  return (
    <div className='test-suit'>
      <button
        type='button'
        onClick={() =>
          formContext.setFieldState(name, () => ({
            configuration: {
              validate: value => ({
                ...checkValidity(value, pattern, required),
                valid: true,
              }),
            },
          }))
        }
      >
        Set valid
      </button>
      <button
        type='button'
        onClick={() =>
          formContext.setFieldState(name, () => ({
            configuration: {
              validate: value => ({
                ...checkValidity(value, pattern, required),
                valid: false,
              }),
            },
          }))
        }
      >
        Set Invalid
      </button>
      <br></br>
      <button type='button' onClick={() => formContext.setFieldState(name, () => ({ dirty: true, pristine: false }))}>
        Set Dirty
      </button>
      <button type='button' onClick={() => formContext.setFieldState(name, () => ({ dirty: false, pristine: true }))}>
        Set Pristine
      </button>
      <br></br>
      <button
        type='button'
        onClick={() =>
          formContext.setFieldState(name, () => ({
            configuration: {
              validate: value => checkValidity(value, pattern, false),
            },
          }))
        }
      >
        Set Non-required
      </button>
      <button
        type='button'
        onClick={() =>
          formContext.setFieldState(name, () => ({
            configuration: {
              validate: value => checkValidity(value, pattern, true),
            },
          }))
        }
      >
        Set Required
      </button>
      <button
        type='button'
        onClick={() =>
          formContext.setFieldState(name, () => ({
            ...defaultFieldState,
            configuration: {
              validate: value => checkValidity(value, pattern, required),
            },
          }))
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
        <button
          type='button'
          onClick={() =>
            formContext.setFieldValue(name, testSuiteValue, {
              validate: value => checkValidity(value, pattern, required),
            })
          }
        >
          Set value
        </button>
      </div>
    </div>
  );
};

export default TestSuit;
