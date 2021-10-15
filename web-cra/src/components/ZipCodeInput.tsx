import React from "react";
import { TextInputInterface } from "../types";
import { TextInput } from "./TextInput";
import { Patterns, ValidationMessages } from "../constants";

const pattern = {
  regexp: Patterns.zipCode,
  message: ValidationMessages.zipCode.patternMismatch
};

export const ZipCodeInput = (props: TextInputInterface): JSX.Element => {
  return <TextInput pattern={pattern} {...props}></TextInput>;
};
