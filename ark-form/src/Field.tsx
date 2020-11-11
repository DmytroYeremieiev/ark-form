import { useState, useRef, useEffect, useMemo } from 'react';
import { InputType, ValidityStateInterface, FieldInterface } from './types';
import { useFormContext } from './FormContext';

const defaultValidity: ValidityStateInterface = {
  valid: true
};

const getValidity = () => defaultValidity;
export const Field = <T extends InputType, ET = HTMLInputElement>(props: FieldInterface<T, ET>): JSX.Element => {
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
  }: FieldInterface<T, ET> = props;
  const formState = useFormContext();
  const _validateOnChange = validateOnChange || formState.validateOnChange;

  const [value, setValue] = useState(initialValue);
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

  const inputRef = useRef(null);
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
    const transformedInput = transformInput(initialValue, target);
    const transformedOutput = transformOutput(initialValue, target);
    setValue(transformedInput);
    setFilled(!!transformedInput);
    setChanged(true);
    const validity = validate(initialValue);
    setValidity(validity);
    setDirty(true);
    setPristine(false);
    formState.sendFieldData(name, transformedOutput, validity);
  }, [initialValue]);

  useEffect(() => {
    // must be in  the latest effect
    didMountRef.current = true;
  });
  const _onChange = event => {
    const target = inputRef.current;
    const value = target.value;
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
  const _onBlur = event => {
    onBlur(event);
    if (!formState.validateOnBlur || !changed) return;
    setDirty(true);
    setPristine(false);
    setValidity(validate(value));
  };
  const _onFocus = event => {
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
