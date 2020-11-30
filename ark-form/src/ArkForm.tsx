import React, { useReducer, useRef, useEffect, useMemo } from 'react';
import { ValidityStateInterface, InputType, FormConfiguration, FormState, defaultFormState } from './types';
import { FormProvider } from './FormContext';

type FormAction = {
  type: 'blur' | 'submit' | 'change' | 'validate';
  configuration: FormConfiguration;
  fieldsData: Map<string, FieldsData>;
};
const handleBlur = (state: FormState, action: FormAction): FormState => {
  let newState: FormState = { ...state, blurred: state.blurred + 1 };
  if (action.configuration.validateOnBlur && state.changed) {
    newState.dirty = true;
    newState.pristine = false;
    newState = handleValidation(newState, action);
  }
  return newState;
};
const handleSubmit = (state: FormState, action: FormAction): FormState => {
  return { ...state, ...handleValidation(state, action), submitted: true };
};
const handleChange = (state: FormState, action: FormAction): FormState => {
  let newState: FormState = { ...state, changed: true };
  if (action.configuration.validateOnChange) {
    newState.dirty = true;
    newState.pristine = false;
    newState = handleValidation(newState, action);
  }
  return newState;
};

const handleValidation = (state: FormState, action: FormAction): FormState => {
  const valid = isValid(action.fieldsData);
  return { ...state, invalid: !valid, valid: valid };
};
const formReducer = (state: FormState, action: FormAction) => {
  switch (action.type) {
    case 'submit':
      return handleSubmit(state, action);
    case 'change':
      return handleChange(state, action);
    case 'blur':
      return handleBlur(state, action);
    case 'validate':
      return handleValidation(state, action);
    default:
      throw new Error();
  }
};

interface FormHooks {
  name: string;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onChange?: (event: React.FormEvent<HTMLFormElement>) => void;
  onBlur?: (event: React.FormEvent<HTMLFormElement>) => void;
}
export interface FormInterface extends FormConfiguration {
  name: string;
  onSubmit: (event: React.FormEvent<HTMLFormElement>, data: Map<string, FieldsData>) => void;
  onChange?: (event: React.FormEvent<HTMLFormElement>, data: Map<string, FieldsData>) => void;
  onBlur?: (event: React.FormEvent<HTMLFormElement>, data: Map<string, FieldsData>) => void;
  children: (props: {
    state: FormState;
    dispatch: React.Dispatch<FormAction>;
    configuration: FormConfiguration;
    formHooks: FormHooks;
  }) => React.ReactChild | React.ReactChild[];
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
export const ArkForm = ({
  name,
  onSubmit,
  children,
  validateOnChange = false,
  validateOnBlur = true,
}: FormInterface): JSX.Element => {
  const configuration = {
    validateOnChange,
    validateOnBlur,
    name,
  };
  const [state, dispatch] = useReducer(formReducer, defaultFormState);
  const fieldsData = useRef(new Map<string, FieldsData>());
  if (process.env.NODE_ENV !== 'production') {
    console.log(
      'Form:',
      `dirty ${state.dirty},  pristine: ${state.pristine}, submitted: ${state.submitted}, blurred: ${state.blurred}, invalid: ${state.invalid}, valid: ${state.valid}, changed: ${state.changed}`
    );
  }

  const sendFieldData = (name: string, value: any, validity: ValidityStateInterface) => {
    fieldsData.current.set(name, { value, validity });
  };
  useEffect(() => {
    dispatch({ type: 'validate', fieldsData: fieldsData.current, configuration });
  }, []);
  const _onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    dispatch({ type: 'submit', fieldsData: fieldsData.current, configuration });
    if (state.valid) onSubmit(event, fieldsData.current);
  };
  const _onChange = () => {
    dispatch({ type: 'change', fieldsData: fieldsData.current, configuration });
  };
  const _onBlur = () => {
    dispatch({ type: 'blur', fieldsData: fieldsData.current, configuration });
  };
  const formHooks = { name, onSubmit: _onSubmit, onBlur: _onBlur, onChange: _onChange };
  return useMemo(
    () => (
      <FormProvider
        value={{
          sendFieldData,
          configuration,
          state,
        }}
      >
        {children({ state, dispatch, configuration, formHooks })}
      </FormProvider>
    ),
    [state.submitted, state.blurred, state.dirty, state.valid, state.changed]
  );
};
