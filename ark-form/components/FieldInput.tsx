import React from 'react';
import { Field } from 'ark-form/src';
import { TextInputInterface, FieldStateClassNames } from './types';
import { ValidityStateInterface } from 'ark-form/src';

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
export const FieldInput = ({
  initialValue = '',
  name,
  pattern,
  required,
  readOnly,
  statesRef,
  ...rest
}: TextInputInterface): JSX.Element => {
  return (
    <Field
      name={name}
      validate={value => checkValidity(value, pattern, required)}
      initialValue={initialValue}
      {...rest}
    >
      {props => {
        statesRef.current = props;
        const { field, fieldState, formState } = props;
        const id = (formState.name || '') + '-' + name;
        // console.log('field', name, field.value, fieldState, formState);
        return <input id={id} type='text' readOnly={readOnly} {...field} />;
      }}
    </Field>
  );
};
