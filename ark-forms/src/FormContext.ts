import { createContext, useContext } from 'react';
import { FormContextInterface } from './types';
import { defaultFormState } from './formReducer';

export const FormContext = createContext<FormContextInterface>({
  state: defaultFormState,
  setFieldState: () => void 0,
  setFieldValue: () => void 0,
  dispatch: () => void 0,
});

export const FormProvider = FormContext.Provider;
export const FormConsumer = FormContext.Consumer;

FormContext.displayName = 'FormContext';

export function useFormContext(): FormContextInterface {
  return useContext<FormContextInterface>(FormContext);
}

export default FormContext;
