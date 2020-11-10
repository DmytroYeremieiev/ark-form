/// <reference types="react" />
import { FieldInterface } from './types';
export declare const Field: <T extends string | number | boolean, ET = HTMLInputElement>(props: FieldInterface<T, ET>) => JSX.Element;
