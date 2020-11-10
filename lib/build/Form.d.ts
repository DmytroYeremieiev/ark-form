import React from 'react';
import { ValidityStateInterface, InputType } from './types';
export declare enum ClassNames {
    dirty = "form-dirty",
    submitted = "form-submitted",
    pristine = "form-pristine",
    invalid = "form-invalid",
    valid = "form-valid"
}
export interface FormInterface {
    name: string;
    onSubmit: (event: React.FormEvent<HTMLFormElement>, data: Map<string, FieldsData>) => void;
    onChange?: () => void;
    children: React.ReactChild | React.ReactChild[];
    validateOnChange?: boolean;
    validateOnBlur?: boolean;
    forceValidation?: boolean;
}
declare type FieldsData = {
    value: InputType;
    validity: ValidityStateInterface;
};
export declare const Form: ({ name, onSubmit, children, validateOnChange, validateOnBlur, }: FormInterface) => JSX.Element;
export {};
