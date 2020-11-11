import {BasicInput} from 'ark-form'

export interface InputInterface<T> extends BasicInput<T> {
  label: string;
  className?: string;
  readOnly?: boolean;
  forceValidation?: boolean;
}

export interface TextInputInterface<T> extends InputInterface<T> {
  required?: boolean;
  pattern?: {
    regexp: RegExp;
    message?: string;
  };
}

export interface DateInputInterface<T> extends InputInterface<T> {
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
