import { createContext, useContext } from 'react';
import { FormStateInterface } from './types';

export const FormContext = createContext<FormStateInterface>({
  submitted: false,
  name: '',
  blurred: 0,
  sendFieldData: (name, value, validity) => console.log('sendFieldData', name, value, validity),
  validateOnBlur: true,
  validateOnChange: false,
});

export const FormProvider = FormContext.Provider;
export const FormConsumer = FormContext.Consumer;

FormContext.displayName = 'FormContext';

export function useFormContext(): FormStateInterface {
  return useContext<FormStateInterface>(FormContext);
}

export default FormContext;
