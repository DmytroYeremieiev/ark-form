/// <reference types="react" />
import { FormStateInterface } from './types';
export declare const FormContext: import("react").Context<FormStateInterface>;
export declare const FormProvider: import("react").Provider<FormStateInterface>;
export declare const FormConsumer: import("react").Consumer<FormStateInterface>;
export declare function useFormContext(): FormStateInterface;
export default FormContext;
