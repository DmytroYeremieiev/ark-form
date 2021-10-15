/// <reference types="react" />
import { FormContextInterface } from './types';
export declare const FormContext: import("react").Context<FormContextInterface>;
export declare const FormProvider: import("react").Provider<FormContextInterface>;
export declare const FormConsumer: import("react").Consumer<FormContextInterface>;
export declare function useFormContext(): FormContextInterface;
export default FormContext;
