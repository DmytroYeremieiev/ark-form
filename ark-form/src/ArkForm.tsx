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

const isValid = (fieldsData: Map<string, FieldData>) => {
  if (!fieldsData) return false;
  for (const [, field] of fieldsData) {
    field.state = fieldReducer(field.state, { type: 'validate' });
    if (!field.state.validity.valid) {
      return false;
    }
  }
  return true;
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
  const configuration = {
    validateOnChange,
    validateOnBlur,
    name,
  };
  const [state, dispatch] = useReducer(formReducer, defaultFormState);
  const fieldsData = useRef(new Map<string, FieldData>());
  if (process.env.NODE_ENV !== 'production') {
    console.log(
      'Form:',
      `dirty ${state.dirty},  pristine: ${state.pristine}, submitted: ${state.submitted}, blurred: ${state.blurred}, invalid: ${state.invalid}, valid: ${state.valid}, changed: ${state.changed}`
    );
  }

  const setFieldData = (name: string, fieldData: FieldData) => {
    fieldsData.current.set(name, fieldData);
    // if (revalidate) {
    //   fieldsData.current = new Map(fieldsData.current);
    //   dispatch({ type: 'validate', fieldsData: fieldsData.current, configuration });
    // }
  };
  const deleteFieldData = (name: string) => {
    fieldsData.current.delete(name);
    // if (revalidate) {
    //   fieldsData.current = new Map(fieldsData.current);
    //   dispatch({ type: 'validate', fieldsData: fieldsData.current, configuration });
    // }
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
  const formProps = { name, onSubmit: _onSubmit, onBlur: _onBlur, onChange: _onChange };
  const formContext = {
    setFieldData,
    deleteFieldData,
    configuration,
    state,
    dispatch,
    fieldsData: fieldsData.current,
  };
  return <FormProvider value={formContext}>{children({ ...formContext, formProps })}</FormProvider>;
};
