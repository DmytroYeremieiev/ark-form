import { ValidityStateInterface, FieldAction, FieldState } from './types';

const defaultValidity: ValidityStateInterface = {
  valid: true,
};

const getValidity = () => defaultValidity;

export const defaultFieldState: FieldState = {
  changed: 0,
  dirty: false,
  pristine: true,
  filled: false,
  value: '',
  validity: {
    valid: false,
  },
  configuration: {
    validateOnChange: false,
    validateOnBlur: true,
    validate: getValidity,
    name: '',
  },
};

const handleChange = (state: FieldState, action: FieldAction): FieldState => {
  const newState: FieldState = { ...state, changed: state.changed + 1, value: action.value!, filled: !!action.value };
  const validateOnChange = action.configuration?.validateOnChange ?? state.configuration.validateOnChange;
  const validate = action.configuration?.validate ?? state.configuration.validate;
  if (validateOnChange) {
    newState.dirty = true;
    newState.pristine = false;
    newState.validity = validate(action.value);
  }
  return newState;
};

const handleBlur = (state: FieldState, action: FieldAction): FieldState => {
  const validateOnChange = action.configuration?.validateOnChange ?? state.configuration.validateOnChange;
  const validateOnBlur = action.configuration?.validateOnBlur ?? state.configuration.validateOnBlur;
  const validate = action.configuration?.validate ?? state.configuration.validate;
  if (!validateOnBlur || validateOnChange || state.changed === 0) return state;
  const validity = validate(state.value);
  return { ...state, dirty: true, pristine: false, validity };
};

const handleValidation = (state: FieldState, action: FieldAction): FieldState => {
  const validate = action.configuration?.validate ?? state.configuration.validate;
  const validity = validate(state.value);
  return { ...state, validity };
};

export const fieldReducer = (state: FieldState, action: FieldAction) => {
  switch (action.type) {
    case 'change':
      return handleChange(state, action);
    case 'blur':
      return handleBlur(state, action);
    case 'validate':
      return handleValidation(state, action);
    default:
      throw new Error('Invalid action type');
  }
};
