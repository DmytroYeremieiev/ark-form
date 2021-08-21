import React, { useReducer } from 'react';
import { FormConfiguration, defaultFormState, FormContextInterface, FieldState, DeepPartial } from './types';
import { FormProvider } from './FormContext';
import { fieldReducer, mergeState } from './fieldReducer';
import { formReducer } from './formReducer';

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
    state.fieldsData = new Map<string, FieldState>();
    state.configuration = {
      validateOnChange,
      validateOnBlur,
      name,
    };
    return state;
  });
  const getFieldState = (name: string) => {
    const fieldState = state.fieldsData.get(name);
    if (!fieldState) throw 'field name is incorrect';
    return fieldState;
  };
  const setFieldState = (name: string, newState: DeepPartial<FieldState>) => {
    const mergedState = mergeState(getFieldState(name), newState);
    const validatedState = fieldReducer(mergedState, { type: 'validate' });
    dispatch({
      type: 'setField',
      fieldState: validatedState,
    });
  };
  const setFieldValue = (name: string, value: string) => {
    const newFieldState = fieldReducer(getFieldState(name), {
      value: value,
      type: 'change',
      configuration: { validateOnChange: true },
    });
    dispatch({
      type: 'change',
      fieldState: newFieldState,
    });
    dispatch({
      type: 'validate',
    });
  };
  const _onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    dispatch({ type: 'submit' });
    if (state.valid) onSubmit(event, state.fieldsData);
  };

  const formProps = { name, onSubmit: _onSubmit };
  const formContext = {
    state,
    setFieldState,
    setFieldValue,
    dispatch,
  };
  return <FormProvider value={formContext}>{children({ ...formContext, formProps })}</FormProvider>;
};