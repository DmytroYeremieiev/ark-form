import { createContext, useContext } from 'react';
import { FormContextInterface, defaultFormState } from './types';

export const FormContext = createContext<FormContextInterface>({
  state: defaultFormState,
  sendFieldData: (name, value, validity) => console.log('sendFieldData', name, value, validity),
  configuration: {
    validateOnChange: true,
    validateOnBlur: true,
    forceValidation: false,
    name: '',
  },
});

export const FormProvider = FormContext.Provider;
export const FormConsumer = FormContext.Consumer;

FormContext.displayName = 'FormContext';

export function useFormContext(): FormContextInterface {
  return useContext<FormContextInterface>(FormContext);
}

export default FormContext;
