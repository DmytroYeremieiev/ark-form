import React, { useReducer } from 'react';
import { FormConfiguration, FormContextInterface, FieldState, DeepPartial, FieldConfiguration } from './types';
import { FormProvider } from './FormContext';
import { fieldReducer, mergeState } from './fieldReducer';
import { formReducer, defaultFormState } from './formReducer';

interface FormProps {
  name: string;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onChange?: (event: React.FormEvent<HTMLFormElement>) => void;
  onBlur?: (event: React.FormEvent<HTMLFormElement>) => void;
}
export interface FormInterface extends FormConfiguration {
  name: string;
  formContextRef?: React.MutableRefObject<FormContextInterface>;
  onSubmit: (event: React.FormEvent<HTMLFormElement>, data: Map<string, FieldState>) => void;
  onChange?: (event: React.FormEvent<HTMLFormElement>, data: Map<string, FieldState>) => void;
  onBlur?: (event: React.FormEvent<HTMLFormElement>, data: Map<string, FieldState>) => void;
  children: (props: {
    formContext: FormContextInterface;
    formProps: FormProps;
  }) => React.ReactChild | React.ReactChild[];
}

export const ArkForm = ({
  name,
  onSubmit,
  children,
  validateOnChange = false,
  validateOnBlur = true,
  formContextRef,
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
  const setFieldState: FormContextInterface['setFieldState'] = (name, setNewState) => {
    const newState = setNewState(getFieldState(name));
    const mergedNewState = mergeState(getFieldState(name), newState);
    const validatedState = fieldReducer(mergedNewState, { type: 'validate' });
    dispatch({
      type: 'setField',
      fieldState: validatedState,
    });
  };
  const setFieldValue = (name: string, value: string, configuration?: Partial<FieldConfiguration>) => {
    const state = getFieldState(name);
    const newFieldState = fieldReducer(state, {
      value: value,
      type: 'change',
      configuration: { ...state.configuration, ...configuration, validateOnChange: true },
    });
    dispatch({
      type: 'change',
      fieldState: newFieldState,
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
  if (formContextRef) formContextRef.current = formContext;
  return <FormProvider value={formContext}>{children({ formContext, formProps })}</FormProvider>;
};
