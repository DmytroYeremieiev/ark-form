import React from 'react';
import { Field } from 'ark-form';
import { InputInterface } from '../../types';
import classnames from 'classnames';

import styles from './CheckboxInput.module.scss';

const transformation = function (_input, target?: HTMLInputElement)  {
  return target!.checked.toString();
};

export const CheckboxInput = ({
  initialValue = false,
  label,
  name,
  className,
  ...props
}: InputInterface): JSX.Element => {
  return (
    <Field
      name={name}
      transformInput={transformation}
      transformOutput={transformation}
      initialValue={initialValue}
      {...props}
      validateOnChange={true}
    >
      {({ field, fieldState, formState }) => {
        const id = formState.name + '-' + name;
        console.log("field.value", field.value);
        return (
          <div className={classnames(styles['checkbox-input'], className)}>
            <div title={`${name} field`} className={`txo-input-container`}>
              <input {...field} id={id} checked={field.value === 'true'} value='true' type='checkbox' />
              <label htmlFor={id}>{label}</label>
            </div>
          </div>
        );
      }}
    </Field>
  );
};
