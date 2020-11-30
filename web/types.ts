import { BasicInput } from 'ark-forms/src';

export interface InputInterface<ET = HTMLInputElement> extends BasicInput<ET> {
  label: string;
  className?: string;
  readOnly?: boolean;
  forceValidation?: boolean;
  transformInput?: (input?: string, target?: ET) => string | undefined;
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
