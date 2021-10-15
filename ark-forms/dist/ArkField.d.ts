/// <reference types="react" />
import { FieldInterface } from './types';
export declare const ArkField: <ET extends HTMLElement & {
    value: string;
} = HTMLInputElement>(props: FieldInterface<ET>) => JSX.Element;
