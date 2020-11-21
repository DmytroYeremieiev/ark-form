import React from 'react';
import { TextInputInterface } from '../../types';
import { TextInput } from '../TextInput/TextInput';
import { Patterns, ValidationMessages } from '../../constants';

const pattern = { regexp: Patterns.fullName, message: ValidationMessages.fullName.patternMismatch };

export const FullNameInput = (props: TextInputInterface): JSX.Element => {
  return <TextInput pattern={pattern} {...props}></TextInput>;
};
