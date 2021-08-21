import { createContext, useContext } from 'react';
import { FormContextInterface, defaultFormState, FieldData } from './types';

export const FormContext = createContext<FormContextInterface>({
  state: defaultFormState,
  setFieldData: () => void 0,
  deleteFieldData: () => void 0,
  fieldsData: new Map<string, FieldData>(),
  dispatch: () => void 0,
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
