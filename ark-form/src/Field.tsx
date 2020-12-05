import React, { useRef, useEffect, useMemo, useReducer, useState } from 'react';
import { ValidityStateInterface, FieldInterface, FormContextInterface, FormConfiguration } from './types';
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
  const field = formContext.fieldsData.get(props.name);
  return <_Field {...props} formContext={formContext}></_Field>;
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
    field?.changed,
  ]);
};

type _FieldInterface<ET> = FieldInterface<ET> & {
  formContext: FormContextInterface;
};

const initializeFieldState = <ET extends HTMLElement & { value: string } = HTMLInputElement>(
  fieldProps: _FieldInterface<ET>,
  formConfiguration: FormConfiguration
) => {
  const value = fieldProps.initialValue?.toString() ?? '';
  const newState = { ...defaultFieldState, value, filled: !!value };
  newState.configuration = {
    validateOnChange: fieldProps.validateOnChange ?? formConfiguration.validateOnChange,
    validateOnBlur: formConfiguration.validateOnBlur,
    validate: fieldProps.validate ?? getValidity,
    name: fieldProps.name,
  };
  return newState;
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
    children,
    formContext,
  }: _FieldInterface<ET> = props;
  const { dispatch } = formContext;
  const [state] = useState(initializeFieldState(props, formContext.state.configuration));
  // const [state, dispatch] = useReducer(fieldReducer, { ...defaultFieldState }, state => {
  //   state.configuration = {
  //     validateOnChange: validateOnChange ?? formContext.configuration.validateOnChange,
  //     validateOnBlur: formContext.configuration.validateOnBlur,
  //     validate,
  //     name,
  //   };
  //   state.value = initialValue?.toString() ?? '';
  //   state.filled = !!state.value;
  //   return state;
  // });

  const inputRef = useRef<ET>();
  const didMountRef = useRef(false);

  // useEffect(() => {
  //   if (!didMountRef.current) return;
  //   dispatch({ type: 'blur', configuration: { validateOnBlur: true } });
  // }, [formContext.state.blurred]);

  useEffect(() => {
    if (!didMountRef.current) return;
    const _initialValue = initialValue?.toString() ?? '';
    dispatch({
      type: 'change',
      fieldState: fieldReducer(state, {
        value: _initialValue,
        type: 'change',
        configuration: { validateOnChange: true },
      }),
    });
  }, [initialValue]);

  useEffect(() => {
    // must be in  the latest effect
    didMountRef.current = true;
    dispatch({
      type: 'registerField',
      fieldState: state,
    });
    return () => {
      dispatch({
        type: 'unregisterField',
        fieldState: state,
      });
    };
  }, []);

  const _onChange = (event: React.ChangeEvent<ET>) => {
    const value = inputRef.current!.value;
    dispatch({
      type: 'change',
      fieldState: fieldReducer(state, { value: value, type: 'change' }),
    });
    onChange(event, value);
  };
  const _onBlur = (event: React.SyntheticEvent<ET>) => {
    onBlur(event);
    // if (!formContext.state.configuration.validateOnBlur || state.changed === 0) return;
    dispatch({
      type: 'blur',
      fieldState: fieldReducer(state, { type: 'blur' }),
    });
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
