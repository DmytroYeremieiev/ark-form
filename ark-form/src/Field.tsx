import React, { useState, useRef, useEffect, useMemo } from 'react';
import { ValidityStateInterface, FieldInterface } from './types';
import { useFormContext } from './FormContext';

const defaultValidity: ValidityStateInterface = {
  valid: true,
};

const getValidity = () => defaultValidity;
export const Field = <ET extends HTMLElement & { value: string } = HTMLInputElement>(
  props: FieldInterface<ET>
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
  }: FieldInterface<ET> = props;
  const formContext = useFormContext();
  const _validateOnChange = validateOnChange || formContext.configuration.validateOnChange;

  const [value, setValue] = useState(initialValue?.toString());
  const [filled, setFilled] = useState(!!initialValue);

  const initialValidity = useMemo(() => {
    const validity = validate(value);
    formContext.sendFieldData(name, initialValue, validity);
    return validity;
  }, []);

  const [validity, setValidity] = useState<ValidityStateInterface>(initialValidity);
  const [changed, setChanged] = useState(false);
  const [pristine, setPristine] = useState(true);
  const [dirty, setDirty] = useState(false);

  const inputRef = useRef<ET>();
  const didMountRef = useRef(false);

  useEffect(() => {
    if (!didMountRef.current || _validateOnChange || !changed) return;
    setDirty(true);
    setPristine(false);
    setValidity(validate(value));
  }, [formContext.state.blurred]);

  useEffect(() => {
    if (!didMountRef.current) return;
    const _initialValue = initialValue?.toString();
    setValue(_initialValue);
    setFilled(!!_initialValue);
    setChanged(true);
    const validity = validate(_initialValue);
    setValidity(validity);
    setDirty(true);
    setPristine(false);
    formContext.sendFieldData(name, _initialValue, validity);
  }, [initialValue]);

  useEffect(() => {
    // must be in  the latest effect
    didMountRef.current = true;
  });
  const _onChange = (event: React.ChangeEvent<ET>) => {
    const value = inputRef.current!.value;
    setValue(value);
    setFilled(!!value);
    setChanged(true);
    const validity = validate(value);
    if (_validateOnChange) {
      setValidity(validity);
      setDirty(true);
      setPristine(false);
    }
    formContext.sendFieldData(name, value, validity);
    onChange(event, value);
  };
  const _onBlur = (event: React.SyntheticEvent<ET>) => {
    onBlur(event);
    if (!formContext.configuration.validateOnBlur || !changed) return;
    setDirty(true);
    setPristine(false);
    setValidity(validate(value));
  };
  const _onFocus = (event: React.FocusEvent<ET>) => {
    onFocus(event);
  };

  const fieldProps = {
    value: value,
    ref: inputRef,
    onChange: _onChange,
    onBlur: _onBlur,
    onFocus: _onFocus,
  };
  const fieldState = {
    filled,
    pristine,
    dirty,
    validity: validity,
  };
  // if (process.env.NODE_ENV !== 'production') {
  //    console.log('field', name, value, fieldState, formState);
  // }

  return children({
    fieldProps,
    fieldState,
    formContext,
  });
};
