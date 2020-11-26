import React from 'react';

import styles from './index.module.scss';

import { Field, Form, ValidityStateInterface } from 'ark-form/src';

import { Button } from '@components/Button/Button';
import { FieldStateClassNames } from 'types';
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
const IndexPage = (): JSX.Element => {
  const onSubmit = (event, data) => {
    console.log('onSubmit', data);
  };
  const pattern = { regexp: /(^\d{5}$)/, message: 'field code must be 5 digits only' };

  return (
    <div className={styles['page-content']}>
      <Form name='tempForm' onSubmit={onSubmit} validateOnChange={false}>
        <Field name={name} validate={value => checkValidity(value, pattern, true)} initialValue={''} {...rest}>
          {({ field, fieldState, formState }) => {
            const id = (formState.name || '') + '-' + name;
            // console.log('field', name, field.value, fieldState, formState);
            return (
              <div className={styles['txo-input']}>
                <div
                  title={`${name} field`}
                  className={`txo-input-container ${classnames(
                    {
                      [FieldStateClassNames.filled]: fieldState.filled,
                      [FieldStateClassNames.pristine]: fieldState.pristine,
                      [FieldStateClassNames.dirty]: fieldState.dirty,
                      [FieldStateClassNames.invalid]: !fieldState.validity.valid,
                      [FieldStateClassNames.valid]: fieldState.validity.valid,
                    },
                    fieldState.validity.className
                  )}`}
                >
                  <input id={id} type='text' readOnly={false} {...field} />
                  <label htmlFor={id}>''</label>
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
        <Button type='submit'>RENT THIS LOOK</Button>
      </Form>
    </div>
  );
};

export default IndexPage;
