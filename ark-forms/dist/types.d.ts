/// <reference types="react" />
export interface FormContextInterface {
    state: FormState;
    setFieldState: (name: string, setState: (currState: FieldState) => DeepPartial<FieldState>) => void;
    setFieldValue: (name: string, value: string, configuration?: Partial<FieldConfiguration>) => void;
    dispatch: React.Dispatch<FormAction>;
}
export interface FormConfiguration {
    validateOnChange?: boolean;
    validateOnBlur?: boolean;
    name: string;
}
export declare type FormAction = {
    type: 'blur' | 'submit' | 'change' | 'validate' | 'registerField' | 'unregisterField' | 'setField';
    fieldState?: FieldState;
};
export interface FormState {
    dirty: boolean;
    submitted: boolean;
    pristine: boolean;
    invalid: boolean;
    valid: boolean;
    changed: boolean;
    blurred: number;
    fieldsData: Map<string, FieldState>;
    configuration: FormConfiguration;
}
export interface FieldConfiguration {
    validateOnChange: boolean;
    validateOnBlur: boolean;
    validate: (value?: string) => ValidityStateInterface;
    name: string;
}
export interface FieldData {
    state: FieldState;
    dispatch: React.Dispatch<FieldAction>;
}
export interface FieldState {
    changed: number;
    blurred: boolean;
    dirty: boolean;
    pristine: boolean;
    filled: boolean;
    value: string;
    validity: ValidityStateInterface;
    configuration: FieldConfiguration;
}
export declare type DeepPartial<T> = {
    [P in keyof T]?: Partial<T[P]>;
};
export declare type FieldAction = {
    type: 'change' | 'blur' | 'validate' | 'dirty';
    configuration?: Partial<FieldConfiguration>;
    value?: string;
};
interface FieldProps<ET> {
    value?: string;
    ref: React.MutableRefObject<any>;
    onChange?: (event: React.ChangeEvent<ET>) => void;
    onBlur?: (event: React.SyntheticEvent<ET>) => void;
    onFocus?: (event: React.FocusEvent<ET>) => void;
}
export interface ValidityStateInterface extends Record<string, any> {
    valid: boolean;
    className?: string;
    errorMessage?: string;
}
export declare type InputType = string | number | boolean | undefined;
export interface BasicInput<ET> {
    name: string;
    initialValue?: InputType;
    validateOnChange?: boolean;
    validate?: (value?: string) => ValidityStateInterface;
    onChange?: (event: React.ChangeEvent<ET>, value?: InputType) => void;
    onBlur?: (even: React.SyntheticEvent<ET>, value?: InputType) => void;
    onFocus?: (event: React.FocusEvent<ET>, value?: InputType) => void;
}
export interface FieldOuterProps<ET> {
    fieldProps: FieldProps<ET>;
    formContext: FormContextInterface;
    fieldState: FieldState;
}
export interface FieldInterface<ET> extends BasicInput<ET> {
    children: ({ fieldProps, formContext, fieldState }: FieldOuterProps<ET>) => JSX.Element;
}
export {};
