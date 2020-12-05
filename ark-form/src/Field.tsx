import React, { useRef, useEffect, useMemo, useReducer } from 'react';
import { ValidityStateInterface, FieldInterface, FormContextInterface } from './types';
import { useFormContext } from './FormContext';
import { fieldReducer, defaultFieldState } from './fieldReducer';

const defaultValidity: ValidityStateInterface = {
  valid: true,
};

const getValidity = () => defaultValidity;

export const Field = <ET extends HTMLElement & { value: string } = HTMLInputElement>(
  props: FieldInterface<ET>
): JSX.Element => {
  const formContext = useFormContext();
  const formState = formContext.state;
  return useMemo(() => <_Field {...props} formContext={formContext}></_Field>, [
    // list all state props manually, since form context generates new state obj each time(immutable)
    formState.blurred, // blurred - used to signal when using autocomplete(fill-up) on entire form with validateOnChange=false
    formState.submitted,
    formState.valid,
    formState.dirty,
    formState.changed,
    // <Field> must only concern about its initialValue, validate props change,
    // there's no value in changing other 'configurational' props and event handlers, such as 'name', 'validateOnChange', etc...
    props.initialValue,
    props.validate,
  ]);
};

type _FieldInterface<ET> = FieldInterface<ET> & {
  formContext: FormContextInterface;
};
const _Field = <ET extends HTMLElement & { value: string } = HTMLInputElement>(
  props: _FieldInterface<ET>
): JSX.Element => {
  const {
    name,
    initialValue,
    onChange = () => void 0,
    onFocus = () => void 0,
    onBlur = () => void 0,
    validateOnChange,
    children,
    validate = getValidity,
    formContext,
  }: _FieldInterface<ET> = props;

  const [state, dispatch] = useReducer(fieldReducer, defaultFieldState, state => {
    state.configuration.validateOnChange = validateOnChange ?? formContext.configuration.validateOnChange;
    state.configuration.validateOnBlur = formContext.configuration.validateOnBlur;
    state.configuration.validate = validate;
    state.value = initialValue?.toString() ?? '';
    return state;
  });

  const inputRef = useRef<ET>();
  const didMountRef = useRef(false);

  useEffect(() => {
    if (!didMountRef.current) return;
    dispatch({ type: 'blur', configuration: { validateOnBlur: true } });
  }, [formContext.state.blurred]);

  useEffect(() => {
    if (!didMountRef.current) return;
    const _initialValue = initialValue?.toString() ?? '';
    dispatch({ value: _initialValue, type: 'change', configuration: { validateOnChange: true } });
    formContext.setFieldData(name, _initialValue, validity);
  }, [initialValue]);

  useEffect(() => {
    // must be in  the latest effect
    didMountRef.current = true;
    formContext.setFieldData(name, initialValue, validity, true);
    return () => {
      formContext.deleteFieldData(name, true);
    };
  }, []);

  const _onChange = (event: React.ChangeEvent<ET>) => {
    const value = inputRef.current!.value;
    dispatch({ value: value, type: 'change' });
    formContext.setFieldData(name, value, validity);
    onChange(event, value);
  };
  const _onBlur = (event: React.SyntheticEvent<ET>) => {
    onBlur(event);
    if (!formContext.configuration.validateOnBlur || state.changed === 0) return;
    dispatch({ type: 'blur' });
  };
  const _onFocus = (event: React.FocusEvent<ET>) => {
    onFocus(event);
  };

  const fieldProps = {
    value: state.value,
    ref: inputRef,
    onChange: _onChange,
    onBlur: _onBlur,
    onFocus: _onFocus,
  };
  // if (process.env.NODE_ENV !== 'production') {
  //    console.log('field', name, value, fieldState, formState);
  // }

  return children({
    fieldProps,
    fieldState: state,
    formContext,
  });
};
