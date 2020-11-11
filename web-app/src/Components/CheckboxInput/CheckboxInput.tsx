import React from 'react';
import { Field } from '../../../../ark-form/build/Field';
import { InputInterface } from 'shared/interfaces/FormInterfaces';
import classnames from 'classnames';

import styles from './CheckboxInput.module.scss';

const transformation = function (_input, target: HTMLInputElement): boolean {
  return target.checked;
};

export const CheckboxInput = ({
  initialValue = false,
  label,
  name,
  className,
  ...props
}: InputInterface<boolean>): JSX.Element => {
  return (
    <Field<boolean>
      name={name}
      transformInput={transformation}
      transformOutput={transformation}
      initialValue={initialValue}
      {...props}
      validateOnChange={true}
    >
      {({ field, fieldState, formState }) => {
        const id = formState.name + '-' + name;
        return (
          <div className={classnames(styles['checkbox-input'], className)}>
            <div title={`${name} field`} className={`txo-input-container`}>
              <input {...field} id={id} checked={field.value} value='true' type='checkbox' />
              <label htmlFor={id}>{label}</label>
            </div>
          </div>
        );
      }}
    </Field>
  );
};
