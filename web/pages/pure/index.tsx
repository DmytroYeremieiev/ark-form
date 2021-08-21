import React from 'react';

import { ArkField, ValidityStateInterface } from 'ark-forms/src';
import { Button } from '@components/Button/Button';
import { Form } from '@components/Form';

import styles from './index.module.scss';
import fieldStyles from '@components/txoInput.module.scss';

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
    result.className = 'required--error';
    result.valid = false;
    return result;
  }
  if (pattern && value && !pattern.regexp.test(value)) {
    result.className = 'pattern-error';
    result.valid = false;
    result.errorMessage = pattern.message || 'Invalid value';
    return result;
  }
  return result;
};
const IndexPage = (): JSX.Element => {
  const onSubmit = (event, data) => {
    console.log('onSubmit', data);
  };
  const pattern = { regexp: /(^\d{5}$)/, message: 'field code must be 5 digits only' };
  const name = 'Field 1';

  return (
    <div className={styles['page-content']}>
      <Form name='tempForm' onSubmit={onSubmit} validateOnChange={false}>
        <ArkField name={name} validate={value => checkValidity(value, pattern, true)} initialValue={''}>
          {({ fieldProps, formContext, fieldState }) => {
            const formState = formContext.state;
            const id = formState.configuration.name + '-' + name;
            return (
              <div className={fieldStyles['txo-input']}>
                <div
                  title={`${name} field`}
                  className={`txo-input-container ${classnames(
                    {
                      ['filled']: fieldState.filled,
                      ['pristine']: fieldState.pristine,
                      ['dirty']: fieldState.dirty,
                      ['invalid']: !fieldState.validity.valid,
                      ['valid']: fieldState.validity.valid,
                    },
                    fieldState.validity.className
                  )}`}
                >
                  <input id={id} type='text' readOnly={false} {...fieldProps} />
                  <label htmlFor={id}>Field 1</label>
                </div>
                {fieldState.validity.errorMessage &&
                  !fieldState.validity.valid &&
                  (fieldState.dirty || formState.submitted) && (
                    <span className='error'>{fieldState.validity.errorMessage}</span>
                  )}
              </div>
            );
          }}
        </ArkField>
        <Button type='submit'>SUBMIT</Button>
      </Form>
    </div>
  );
};

export default IndexPage;
