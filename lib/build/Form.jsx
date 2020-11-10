import React, { useState, useRef, useEffect, useMemo } from 'react';
import { FormProvider } from './FormContext';
import classnames from 'classnames';
export var ClassNames;
(function (ClassNames) {
    ClassNames["dirty"] = "form-dirty";
    ClassNames["submitted"] = "form-submitted";
    ClassNames["pristine"] = "form-pristine";
    ClassNames["invalid"] = "form-invalid";
    ClassNames["valid"] = "form-valid";
})(ClassNames || (ClassNames = {}));
const isValid = (fieldsData) => {
    if (!fieldsData)
        return false;
    for (const [, field] of fieldsData) {
        if (!field.validity.valid) {
            return false;
        }
    }
    return true;
};
export const Form = ({ name, onSubmit, children, validateOnChange = false, validateOnBlur = true, }) => {
    const [dirty, setDirty] = useState(false);
    const [pristine, setPristine] = useState(true);
    const [submitted, setSubmitted] = useState(false);
    const [blurred, setBlurred] = useState(Date.now());
    const [invalid, setInvalid] = useState(true);
    const [valid, setValid] = useState(false);
    const [changed, setChanged] = useState(false);
    const formRef = useRef(null);
    const fieldsData = useRef(new Map());
    // console.log(
    //   'Form:',
    //   `dirty ${dirty},  pristine: ${pristine}, submitted: ${submitted}, blurred: ${blurred}, invalid: ${invalid}, valid: ${valid}, changed: ${changed}`
    // );
    const validate = () => {
        const valid = isValid(fieldsData.current);
        setInvalid(!valid);
        setValid(valid);
        return valid;
    };
    const sendFieldData = (name, value, validity) => {
        fieldsData.current.set(name, { value, validity });
    };
    useEffect(() => {
        validate();
    }, []);
    const _onSubmit = (event) => {
        event.preventDefault();
        setSubmitted(true);
        const valid = validate();
        if (valid)
            onSubmit(event, fieldsData.current);
    };
    const _onChange = () => {
        setChanged(true);
        if (validateOnChange) {
            setDirty(true);
            setPristine(false);
            validate();
        }
    };
    const _onBlur = () => {
        setBlurred(Date.now());
        if (validateOnBlur && changed) {
            setDirty(true);
            setPristine(false);
            validate();
        }
    };
    return (<form noValidate ref={formRef} name={name} onSubmit={_onSubmit} onChange={_onChange} onBlur={_onBlur} className={classnames({
        [ClassNames.dirty]: dirty,
        [ClassNames.submitted]: submitted,
        [ClassNames.pristine]: pristine,
        [ClassNames.invalid]: invalid,
        [ClassNames.valid]: valid,
    })}>
      {useMemo(() => (<FormProvider value={{
        submitted,
        blurred,
        validateOnChange,
        validateOnBlur,
        sendFieldData,
        name,
    }}>
            {children}
          </FormProvider>), [submitted, blurred])}
    </form>);
};
