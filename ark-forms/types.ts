import { BasicInput } from 'ark-form/src';

export interface InputInterface<ET = HTMLInputElement> extends BasicInput<ET> {
  label: string;
  className?: string;
  readOnly?: boolean;
  forceValidation?: boolean;
}

export interface TextInputInterface<ET = HTMLInputElement> extends InputInterface<ET> {
  required?: boolean;
  pattern?: {
    regexp: RegExp;
    message?: string;
  };
}

export interface DateInputInterface<ET = HTMLInputElement> extends InputInterface<ET> {
  required?: boolean;
}

export enum FieldStateClassNames {
  filled = 'field-filled',
  pristine = 'field-pristine',
  dirty = 'field-dirty',
  valid = 'field-valid',
  invalid = 'field-invalid',
  requiredError = 'required-error',
  patternError = 'pattern-error',
  forceValidation = 'force-validation',
}
