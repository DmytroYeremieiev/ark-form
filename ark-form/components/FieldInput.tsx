import React from 'react';
import { Field } from 'ark-form/src';
import { FieldInputInterface } from './types';
import { ValidityStateInterface } from 'ark-form/src';

const checkValidity = (): ValidityStateInterface => {
  const result: ValidityStateInterface = {
    valid: true,
  };
  return result;
};
export const FieldInput = ({
  initialValue = '',
  name,
  validate = checkValidity,
  statesRef,
  ...rest
}: FieldInputInterface): JSX.Element => {
  return (
    <Field name={name} validate={value => validate(value)} initialValue={initialValue} {...rest}>
      {props => {
        statesRef.current = props;
        const { field, fieldState, formState } = props;
        const id = (formState.name || '') + '-' + name;
        // console.log('field', name, field.value, fieldState, formState);
        return <input id={id} type='text' {...field} />;
      }}
    </Field>
  );
};
