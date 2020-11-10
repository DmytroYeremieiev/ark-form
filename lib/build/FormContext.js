import { createContext, useContext } from 'react';
export const FormContext = createContext({
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
export function useFormContext() {
    return useContext(FormContext);
}
export default FormContext;
