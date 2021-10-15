import React from "react";
import { ArkField } from "ark-forms";
import { InputInterface } from "../../types";
import classnames from "classnames";

import "./CheckboxInput.scss";

const transformation = function (fieldProps) {
  if (fieldProps.ref.current) {
    return fieldProps.ref.current.checked;
  } else {
    return fieldProps.value === "true";
  }
};

export const CheckboxInput = ({
  initialValue = false,
  label,
  name,
  className,
  ...props
}: InputInterface): JSX.Element => {
  return (
    <ArkField
      name={name}
      initialValue={initialValue}
      {...props}
      validateOnChange={true}
    >
      {({ fieldProps, fieldState, formContext }) => {
        const id = formContext.state.configuration.name + "-" + name;
        console.log("field", name, fieldProps.value, fieldState, formContext);
        const value = transformation(fieldProps);
        return (
          <div className={classnames("checkbox-input", className)}>
            <div title={`${name} field`} className={`txo-input-container`}>
              <input
                {...fieldProps}
                id={id}
                checked={value}
                value={value}
                type="checkbox"
              />
              <label htmlFor={id}>{label}</label>
            </div>
          </div>
        );
      }}
    </ArkField>
  );
};
