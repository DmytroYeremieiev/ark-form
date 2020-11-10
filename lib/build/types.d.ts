/// <reference types="react" />
export interface FormStateInterface {
    submitted: boolean;
    name: string;
    blurred: number;
    sendFieldData: (name: string, value: any, validity: ValidityStateInterface) => void;
    validateOnBlur: boolean;
    validateOnChange: boolean;
}
interface FieldState {
    filled: boolean;
    pristine: boolean;
    dirty: boolean;
    validity: ValidityStateInterface;
}
interface Field<T, ET> {
    value: T;
    ref: React.MutableRefObject<any>;
    onChange?: (event: React.ChangeEvent<ET>) => void;
    onBlur?: (event: React.SyntheticEvent<ET>) => void;
    onFocus?: (event: React.FocusEvent<ET>) => void;
}
export interface ValidityStateInterface {
    valid: boolean;
    className?: string;
    errorMessage?: string;
}
export declare type InputType = string | number | boolean;
export interface BasicInput<T> {
    name: string;
    initialValue?: T;
    validate?: (value: T) => ValidityStateInterface;
    transformInput?: (input: T, target?: HTMLInputElement) => T;
    transformOutput?: (output: T, target?: HTMLInputElement) => T;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>, value?: T) => void;
    onBlur?: (event: React.FocusEvent<HTMLInputElement>, value?: T) => void;
    onFocus?: (event: React.FocusEvent<HTMLInputElement>, value?: T) => void;
}
interface FieldOuterProps<T, ET> {
    field: Field<T, ET>;
    formState: FormStateInterface;
    fieldState: FieldState;
}
export interface FieldInterface<T, ET> extends BasicInput<T> {
    children: ({ field, formState, fieldState }: FieldOuterProps<T, ET>) => JSX.Element;
    validateOnChange?: boolean;
}
export {};
