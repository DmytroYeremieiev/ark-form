import React from 'react';
import classnames from 'classnames';
import { Field } from 'ark-form/src';
import { InputInterface, FieldStateClassNames } from '../../types';
import { ValidityStateInterface } from 'ark-form/src';

import styles from './SelectInput.module.scss';
import txoInputStyles from '../txoInput.module.scss';

const defaultOption = <option value='' key={-1}></option>;

type OptionValue = string | number;
type Option<OptionValue> = {
  value: OptionValue;
  label: string;
};
export interface TxoSelectInputInterface extends InputInterface<HTMLSelectElement> {
  options: Array<Option<OptionValue>>;
  required?: boolean;
}

const checkValidity = (value?: string, required?: boolean): ValidityStateInterface => {
  const result: ValidityStateInterface = {
    valid: true,
  };
  if (required && !value) {
    result.className = FieldStateClassNames.requiredError;
    result.valid = false;
    return result;
  }

  return result;
};

export const SelectInput = ({
  options,
  forceValidation,
  className,
  required,
  name,
  label,
  ...rest
}: TxoSelectInputInterface): JSX.Element => {
  const _options = options.map(o => <option label={o.label} value={o.value} key={o.value}></option>);
  _options.unshift(defaultOption);
  return (
    <Field<HTMLSelectElement> name={name} validate={value => checkValidity(value, required)} {...rest}>
      {({ fieldProps, fieldState, formContext }) => {
        const id = (formContext.configuration.name || '') + '-' + name;
        if (process.env.NODE_ENV !== 'production') {
          console.log('field', name, fieldProps.value, fieldState, formContext);
        }
        return (
          <div className={classnames(styles['select-input'], txoInputStyles['txo-input'], className)}>
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
              <select id={id} {...fieldProps}>
                {_options}
              </select>
              <label htmlFor={id}>{label}</label>
            </div>
          </div>
        );
      }}
    </Field>
  );
};
