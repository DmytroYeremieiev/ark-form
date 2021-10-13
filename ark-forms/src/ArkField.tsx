import React, { useRef, useEffect, useMemo } from 'react';
import { ValidityStateInterface, FieldInterface, FormContextInterface, FormConfiguration, FieldState } from './types';
import { useFormContext } from './FormContext';
import { fieldReducer, defaultFieldState } from './fieldReducer';

export const ArkField = <ET extends HTMLElement & { value: string } = HTMLInputElement>(
  props: FieldInterface<ET>
): JSX.Element => {
  const formContext = useFormContext();
  const formState = formContext.state;
  const fieldState = formState.fieldsData.get(props.name) ?? initializeFieldState(props, formState.configuration);

  return useMemo(
    () => <_ArkField {...props} formContext={formContext} state={fieldState}></_ArkField>,
    [
      // list all state props manually, since form context generates new state obj each time(immutable)
      formState.blurred, // blurred - used to signal when using autocomplete(fill-up) on entire form with validateOnChange=false
      formState.submitted,
      formState.valid,
      formState.dirty,
      formState.changed,
      formState.fieldsData,
      // <Field> must only concern about its initialValue, validate props change,
      // there's no value in changing other 'configurational' props and event handlers, such as 'name', 'validateOnChange', etc...
      props.initialValue,
      props.validate,
      //
      fieldState?.changed,
      fieldState?.validity,
      fieldState?.blurred,
      fieldState?.dirty,
      fieldState?.pristine,
      fieldState?.filled,
    ]
  );
};

type _FieldInterface<ET> = FieldInterface<ET> & {
  formContext: FormContextInterface;
  state: FieldState;
};

const defaultValidity: ValidityStateInterface = {
  valid: true,
};

const getValidity = () => defaultValidity;

const initializeFieldState = <ET extends HTMLElement & { value: string } = HTMLInputElement>(
  fieldProps: FieldInterface<ET>,
  formConfiguration: FormConfiguration
): FieldState => {
  const value = fieldProps.initialValue?.toString() ?? '';
  const newState: FieldState = {
    ...defaultFieldState,
    value,
    filled: !!value,
    configuration: {
      validateOnChange: fieldProps.validateOnChange ?? formConfiguration.validateOnChange ?? true,
      validateOnBlur: formConfiguration.validateOnBlur ?? false,
      validate: fieldProps.validate ?? getValidity,
      name: fieldProps.name,
    },
  };
  return newState;
};

const _ArkField = <ET extends HTMLElement & { value: string } = HTMLInputElement>(
  props: _FieldInterface<ET>
): JSX.Element => {
  const {
    initialValue,
    onChange = () => void 0,
    onFocus = () => void 0,
    onBlur = () => void 0,
    children,
    formContext,
    state,
  }: _FieldInterface<ET> = props;
  const { dispatch } = formContext;

  const inputRef = useRef<ET>();
  const didMountRef = useRef(false);

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
      fieldState: fieldReducer(state, { type: 'validate' }),
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
