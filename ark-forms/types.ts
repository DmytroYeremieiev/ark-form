import { BasicInput, FieldOuterProps } from './src';

export interface FieldInputInterface<ET = HTMLInputElement> extends BasicInput<ET> {
  statesRef: { current?: FieldOuterProps<ET> };
}
export interface InputInterface<ET = HTMLInputElement> extends BasicInput<ET> {
  label: string;
  className?: string;
  readOnly?: boolean;
}

export interface TextInputInterface<ET = HTMLInputElement> extends InputInterface<ET> {
  required?: boolean;
  forceValidation?: boolean;
  pattern?: {
    regexp: RegExp;
    message?: string;
  };
}
