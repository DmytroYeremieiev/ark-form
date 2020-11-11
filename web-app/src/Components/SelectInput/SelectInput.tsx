import React from 'react';
import classnames from 'classnames';
import { Field } from 'shared/components/Forms/Field/Field';
import { InputInterface, ValidityStateInterface, FieldStateClassNames } from 'shared/interfaces/FormInterfaces';

import styles from './SelectInput.module.scss';
import txoInputStyles from '../txoInput.module.scss';

const defaultOption = <option value='' key={-1}></option>;

type OptionValue = string | number;
type Option<OptionValue> = {
  value: OptionValue;
  label: string;
};
export interface TxoSelectInputInterface extends InputInterface<OptionValue> {
  options: Array<Option<OptionValue>>;
  required?: boolean;
}

const checkValidity = (value: OptionValue, required?: boolean): ValidityStateInterface => {
  const result: ValidityStateInterface = {
    valid: true,
    className: null,
    errorMessage: null,
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
    <Field<OptionValue, HTMLSelectElement> name={name} validate={value => checkValidity(value, required)} {...rest}>
      {({ field, fieldState, formState }) => {
        const id = (formState.name || '') + '-' + name;
        // console.log('field', name, fieldState, formState);
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
              <select id={id} {...field}>
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
