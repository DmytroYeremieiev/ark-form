import { FormState, FormAction, FieldState } from './types';
import { fieldReducer } from './fieldReducer';

export const defaultFormState: FormState = {
  dirty: false,
  pristine: true,
  invalid: true,
  valid: false,
  submitted: false,
  changed: false,
  blurred: 0,
  fieldsData: new Map<string, FieldState>(),
  configuration: {
    name: '',
    validateOnBlur: true,
    validateOnChange: false,
  },
};

const handleSubmit = (state: FormState): FormState => {
  return { ...state, ...handleValidation(state), submitted: true };
};

const setFieldsDirty = (fieldsData: Map<string, FieldState>) => {
  fieldsData.forEach((fieldState, fieldName) => {
    if (fieldState.filled && !fieldState.dirty && !fieldState.configuration.validateOnChange) {
      fieldsData.set(fieldName, fieldReducer(fieldReducer(fieldState, { type: 'dirty' }), { type: 'validate' }));
    }
  });
};

const handleBlur = (state: FormState, action: FormAction): FormState => {
  let newState: FormState = { ...state, blurred: state.blurred + 1 };
  const fieldState = action.fieldState!;
  newState.fieldsData.set(fieldState.configuration.name, fieldState);
  if (!state.configuration.validateOnBlur || !state.changed) return newState;
  newState.dirty = true;
  newState.pristine = false;
  setFieldsDirty(newState.fieldsData);
  newState = handleValidation(newState);
  return newState;
};

const handleChange = (state: FormState, action: FormAction): FormState => {
  let newState: FormState = { ...state, changed: true };
  const fieldState = action.fieldState!;
  newState.fieldsData.set(fieldState.configuration.name, fieldState);
  if (state.configuration.validateOnChange) {
    newState.dirty = true;
    newState.pristine = false;
    newState = handleValidation(newState);
  }
  return newState;
};

const handleValidation = (state: FormState): FormState => {
  const valid = isValid(state.fieldsData);
  return { ...state, invalid: !valid, valid: valid };
};

const registerField = (state: FormState, action: FormAction): FormState => {
  state.fieldsData = new Map<string, FieldState>(state.fieldsData);
  const fieldState = action.fieldState!;
  state.fieldsData.set(fieldState.configuration.name, fieldState);
  return handleValidation(state);
};
const setField = (state: FormState, action: FormAction): FormState => {
  const fieldState = action.fieldState!;
  state.fieldsData.set(fieldState.configuration.name, fieldState);
  return handleValidation(state);
};
const unregisterField = (state: FormState, action: FormAction): FormState => {
  state.fieldsData = new Map<string, FieldState>(state.fieldsData);
  state.fieldsData.delete(action.fieldState!.configuration.name);
  return handleValidation(state);
};

const isValid = (fieldsData: Map<string, FieldState>) => {
  if (!fieldsData) return false;
  for (const [, fieldState] of fieldsData) {
    if (!fieldState.validity.valid) {
      return false;
    }
  }
  return true;
};

export const formReducer = (state: FormState, action: FormAction) => {
  switch (action.type) {
    case 'submit':
      return handleSubmit(state);
    case 'change':
      return handleChange(state, action);
    case 'blur':
      return handleBlur(state, action);
    case 'validate':
      return handleValidation(state);
    case 'registerField':
      return registerField(state, action);
    case 'setField':
      return setField(state, action);
    case 'unregisterField':
      return unregisterField(state, action);
    default:
      throw new Error();
  }
};
