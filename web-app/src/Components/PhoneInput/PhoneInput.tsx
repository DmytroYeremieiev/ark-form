import React from 'react';
import { TextInputInterface } from '../../types';
import { TextInput } from '../TextInput/TextInput';

import { Patterns, ValidationMessages } from '../../constants';

const pattern = { regexp: Patterns.phone, message: ValidationMessages.phone.patternMismatch };

export const PhoneInput = (props: TextInputInterface): JSX.Element => {
  const transformInput = input => {
    if (/^\d{10}$/.test(input)) {
      const arr = input.split('');
      arr.splice(3, 0, '-');
      arr.splice(7, 0, '-');
      return arr.join('');
    }
    return input;
  };
  return <TextInput pattern={pattern} transformInput={transformInput} {...props}></TextInput>;
};
