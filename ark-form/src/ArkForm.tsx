import React, { useReducer, useRef, useEffect } from 'react';
import {
  FormConfiguration,
  FormState,
  defaultFormState,
  FormContextInterface,
  FormAction,
  FieldState,
  FieldData,
} from './types';
import { FormProvider } from './FormContext';
import { fieldReducer } from './fieldReducer';

const handleSubmit = (state: FormState): FormState => {
  return { ...state, ...handleValidation(state), submitted: true };
};

const handleBlur = (state: FormState, action: FormAction): FormState => {
  let newState: FormState = { ...state, blurred: state.blurred + 1 };
  const fieldState = action.fieldState!;
  newState.configuration.fieldsData.set(fieldState.configuration.name, fieldState);
  if (state.configuration.validateOnBlur && state.changed) {
    newState.dirty = true;
    newState.pristine = false;
    newState = handleValidation(newState);
  }
  return newState;
};

const handleChange = (state: FormState, action: FormAction): FormState => {
  let newState: FormState = { ...state, changed: true };
  const fieldState = action.fieldState!;
  newState.configuration.fieldsData.set(fieldState.configuration.name, fieldState);
  if (state.configuration.validateOnChange) {
    newState.dirty = true;
    newState.pristine = false;
    newState = handleValidation(newState);
  }
  return newState;
};

const handleValidation = (state: FormState): FormState => {
  const valid = isValid(state.configuration.fieldsData);
  return { ...state, invalid: !valid, valid: valid };
};

const registerField = (state: FormState, action: FormAction): FormState => {
  state.configuration.fieldsData = new Map<string, FieldState>(state.configuration.fieldsData);
  const fieldState = action.fieldState!;
  state.configuration.fieldsData.set(fieldState.configuration.name, fieldState);
  return { ...state };
};
const unregisterField = (state: FormState, action: FormAction): FormState => {
  state.configuration.fieldsData = new Map<string, FieldState>(state.configuration.fieldsData);
  state.configuration.fieldsData.delete(action.fieldState!.configuration.name);
  return { ...state };
};

const isValid = (fieldsData: Map<string, FieldState>) => {
  if (!fieldsData) return false;
  for (const [, fieldState] of fieldsData) {
    if (!fieldState.validity.valid) {
      return false;
    }
  }
  return true;
};

const formReducer = (state: FormState, action: FormAction) => {
  switch (action.type) {
    case 'submit':
      return handleSubmit(state);
    case 'change':
      return handleChange(state, action);
    case 'blur':
      return handleBlur(state, action);
    case 'validate':
      return handleValidation(state);
    case 'registerField':
      return registerField(state, action);
    case 'unregisterField':
      return unregisterField(state, action);
    default:
      throw new Error();
  }
};

interface FormProps {
  name: string;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onChange?: (event: React.FormEvent<HTMLFormElement>) => void;
  onBlur?: (event: React.FormEvent<HTMLFormElement>) => void;
}
export interface FormInterface extends FormConfiguration {
  name: string;
  onSubmit: (event: React.FormEvent<HTMLFormElement>, data: Map<string, FieldState>) => void;
  onChange?: (event: React.FormEvent<HTMLFormElement>, data: Map<string, FieldState>) => void;
  onBlur?: (event: React.FormEvent<HTMLFormElement>, data: Map<string, FieldState>) => void;
  children: (
    props: FormContextInterface & {
      formProps: FormProps;
    }
  ) => React.ReactChild | React.ReactChild[];
}

export const ArkForm = ({
  name,
  onSubmit,
  children,
  validateOnChange = false,
  validateOnBlur = true,
}: FormInterface): JSX.Element => {
  const [state, dispatch] = useReducer(formReducer, defaultFormState, state => {
    state.configuration = {
      validateOnChange,
      validateOnBlur,
      name,
      fieldsData: new Map<string, FieldState>(),
    };
    return state;
  });
  if (process.env.NODE_ENV !== 'production') {
    console.log(
      'Form:',
      `dirty ${state.dirty},  pristine: ${state.pristine}, submitted: ${state.submitted}, blurred: ${state.blurred}, invalid: ${state.invalid}, valid: ${state.valid}, changed: ${state.changed}`
    );
  }

  const _onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    dispatch({ type: 'submit' });
    if (state.valid) onSubmit(event, state.configuration.fieldsData);
  };

  const formProps = { name, onSubmit: _onSubmit };
  const formContext = {
    state,
    dispatch,
  };
  return <FormProvider value={formContext}>{children({ ...formContext, formProps })}</FormProvider>;
};
