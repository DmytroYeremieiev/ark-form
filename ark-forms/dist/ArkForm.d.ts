import React from 'react';
import { FormConfiguration, FormContextInterface, FieldState } from './types';
interface FormProps {
    name: string;
    onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
    onChange?: (event: React.FormEvent<HTMLFormElement>) => void;
    onBlur?: (event: React.FormEvent<HTMLFormElement>) => void;
}
export interface FormInterface extends FormConfiguration {
    name: string;
    onSubmit: (event: React.FormEvent<HTMLFormElement>, data: Map<string, FieldState>) => void;
    onChange?: (event: React.FormEvent<HTMLFormElement>, data: Map<string, FieldState>) => void;
    onBlur?: (event: React.FormEvent<HTMLFormElement>, data: Map<string, FieldState>) => void;
    children: (props: FormContextInterface & {
        formProps: FormProps;
    }) => React.ReactChild | React.ReactChild[];
}
export declare const ArkForm: ({ name, onSubmit, children, validateOnChange, validateOnBlur, }: FormInterface) => JSX.Element;
export {};
