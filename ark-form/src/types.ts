export interface FormContextInterface {
  configuration: FormConfiguration;
  sendFieldData: (name: string, value: any, validity: ValidityStateInterface) => void;
  state: FormState;
}
export interface FormConfiguration {
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
  forceValidation?: boolean;
  name: string;
}
export interface FormState {
  dirty: boolean;
  submitted: boolean;
  pristine: boolean;
  invalid: boolean;
  valid: boolean;
  changed: boolean;
  blurred: number;
}
export const defaultFormState: FormState = {
  dirty: false,
  pristine: true,
  invalid: true,
  valid: false,
  submitted: false,
  changed: false,
  blurred: 0,
};

interface FieldState {
  filled: boolean;
  pristine: boolean;
  dirty: boolean;
  validity: ValidityStateInterface;
}

interface Field<ET> {
  value?: string;
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

export type InputType = string | number | boolean | undefined;

export interface BasicInput<ET> {
  name: string;
  initialValue?: InputType;
  validate?: (value?: string) => ValidityStateInterface;
  transformInput?: (input?: string, target?: ET) => string | undefined;
  transformOutput?: (output?: string, target?: ET) => any;
  onChange?: (event: React.ChangeEvent<ET>, value?: InputType) => void;
  onBlur?: (even: React.SyntheticEvent<ET>, value?: InputType) => void;
  onFocus?: (event: React.FocusEvent<ET>, value?: InputType) => void;
}

export interface FieldOuterProps<ET> {
  field: Field<ET>;
  formState: FormStateInterface;
  fieldState: FieldState;
}

export interface FieldInterface<ET> extends BasicInput<ET> {
  children: ({ field, formState, fieldState }: FieldOuterProps<ET>) => JSX.Element;
  validateOnChange?: boolean;
}
