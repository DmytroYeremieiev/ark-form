import React from 'react';
import { ArkField } from '../src';
import { FieldInputInterface } from '../types';
import { ValidityStateInterface } from '../src';

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
    <ArkField name={name} validate={value => validate(value)} initialValue={initialValue} {...rest}>
      {props => {
        statesRef.current = props;
        const { fieldProps, fieldState, formContext } = props;
        const id = (formContext.state.configuration.name || '') + '-' + name;
        // console.log('field', name, fieldProps.value, fieldState, formContext);
        return (
          <div>
            <input id={id} type='text' {...fieldProps} />
            <label htmlFor={id}>{name}</label>
          </div>
        );
      }}
    </ArkField>
  );
};
