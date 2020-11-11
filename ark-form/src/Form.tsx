import React, { useState, useRef, useEffect, useMemo } from 'react';
import { ValidityStateInterface, InputType } from './types';
import { FormProvider } from './FormContext';
import classnames from 'classnames';

export enum ClassNames {
  dirty = 'form-dirty',
  submitted = 'form-submitted',
  pristine = 'form-pristine',
  invalid = 'form-invalid',
  valid = 'form-valid',
}

export interface FormInterface {
  name: string;
  onSubmit: (event: React.FormEvent<HTMLFormElement>, data: Map<string, FieldsData>) => void;
  onChange?: () => void;
  children: React.ReactChild | React.ReactChild[];
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
  forceValidation?: boolean;
}
type FieldsData = {
  value: InputType;
  validity: ValidityStateInterface;
};
const isValid = (fieldsData: Map<string, FieldsData>) => {
  if (!fieldsData) return false;
  for (const [, field] of fieldsData) {
    if (!field.validity.valid) {
      return false;
    }
  }
  return true;
};
export const Form = ({
  name,
  onSubmit,
  children,
  validateOnChange = false,
  validateOnBlur = true,
}: FormInterface): JSX.Element => {
  const [dirty, setDirty] = useState(false);
  const [pristine, setPristine] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [blurred, setBlurred] = useState(Date.now());
  const [invalid, setInvalid] = useState(true);
  const [valid, setValid] = useState(false);
  const [changed, setChanged] = useState(false);
  const formRef = useRef(null);
  const fieldsData = useRef(new Map<string, FieldsData>());
  // console.log(
  //   'Form:',
  //   `dirty ${dirty},  pristine: ${pristine}, submitted: ${submitted}, blurred: ${blurred}, invalid: ${invalid}, valid: ${valid}, changed: ${changed}`
  // );

  const validate = () => {
    const valid = isValid(fieldsData.current);
    setInvalid(!valid);
    setValid(valid);
    return valid;
  };
  const sendFieldData = (name: string, value: any, validity: ValidityStateInterface) => {
    fieldsData.current.set(name, { value, validity });
  };
  useEffect(() => {
    validate();
  }, []);
  const _onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
    const valid = validate();
    if (valid) onSubmit(event, fieldsData.current);
  };
  const _onChange = () => {
    setChanged(true);
    if (validateOnChange) {
      setDirty(true);
      setPristine(false);
      validate();
    }
  };
  const _onBlur = () => {
    setBlurred(Date.now());
    if (validateOnBlur && changed) {
      setDirty(true);
      setPristine(false);
      validate();
    }
  };

  return (
    <form
      noValidate
      ref={formRef}
      name={name}
      onSubmit={_onSubmit}
      onChange={_onChange}
      onBlur={_onBlur}
      className={classnames({
        [ClassNames.dirty]: dirty,
        [ClassNames.submitted]: submitted,
        [ClassNames.pristine]: pristine,
        [ClassNames.invalid]: invalid,
        [ClassNames.valid]: valid,
      })}
    >
      {useMemo(
        () => (
          <FormProvider
            value={{
              submitted,
              blurred,
              validateOnChange,
              validateOnBlur,
              sendFieldData,
              name,
            }}
          >
            {children}
          </FormProvider>
        ),
        [submitted, blurred]
      )}
    </form>
  );
};
