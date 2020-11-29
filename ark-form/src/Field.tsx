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
    transformInput = input => input,
    transformOutput = output => output,
    validateOnChange,
    children,
    validate = getValidity,
  }: FieldInterface<ET> = props;
  const formState = useFormContext();
  const _validateOnChange = validateOnChange || formState.validateOnChange;

  const [value, setValue] = useState(initialValue?.toString());
  const [filled, setFilled] = useState(!!initialValue);

  const initialValidity = useMemo(() => {
    const validity = validate(value);
    formState.sendFieldData(name, initialValue, validity);
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
  }, [formState.blurred]);

  useEffect(() => {
    if (!didMountRef.current) return;
    const target = inputRef.current;
    const _initialValue = initialValue?.toString();
    const transformedInput = transformInput(_initialValue, target);
    const transformedOutput = transformOutput(_initialValue, target);
    setValue(transformedInput);
    setFilled(!!transformedInput);
    setChanged(true);
    const validity = validate(_initialValue);
    setValidity(validity);
    setDirty(true);
    setPristine(false);
    formState.sendFieldData(name, transformedOutput, validity);
  }, [initialValue]);

  useEffect(() => {
    // must be in  the latest effect
    didMountRef.current = true;
  });
  const _onChange = (event: React.ChangeEvent<ET>) => {
    const target = inputRef.current;
    const value = target!.value;
    const transformedInput = transformInput(value, target);
    const transformedOutput = transformOutput(value, target);
    setValue(transformedInput);
    setFilled(!!transformedInput);
    setChanged(true);
    const validity = validate(value);
    if (_validateOnChange) {
      setValidity(validity);
      setDirty(true);
      setPristine(false);
    }
    formState.sendFieldData(name, transformedOutput, validity);
    onChange(event, transformedOutput);
  };
  const _onBlur = (event: React.SyntheticEvent<ET>) => {
    onBlur(event);
    if (!formState.validateOnBlur || !changed) return;
    setDirty(true);
    setPristine(false);
    setValidity(validate(value));
  };
  const _onFocus = (event: React.FocusEvent<ET>) => {
    onFocus(event);
  };

  const field = {
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
  // console.log('field', name, value, fieldState, formState);

  return children({
    field: field,
    fieldState: fieldState,
    formState: formState,
  });
};
