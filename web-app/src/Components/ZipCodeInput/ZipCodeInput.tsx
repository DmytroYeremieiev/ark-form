import React from 'react';
import { TextInputInterface } from 'shared/interfaces/FormInterfaces';
import { TextInput } from 'shared/components/Forms/TextInput/TextInput';
import { Patterns, ValidationMessages } from 'shared/services/constants';

const pattern = { regexp: Patterns.zipCode, message: ValidationMessages.zipCode.patternMismatch };

export const ZipCodeInput = (props: TextInputInterface<string>): JSX.Element => {
  return <TextInput pattern={pattern} {...props}></TextInput>;
};
