import React from 'react';
// import { render, fireEvent, screen } from '../utils/testUtils';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import { doesElemHaveExactClassList, doesFormFieldHaveExactClassList } from 'ark-form/utils/formTestHelper';

import { Form } from 'ark-form/src';
import { ClassNames as FormClassNames } from 'ark-form/src';
import { FieldStateClassNames as FieldClassNames } from 'ark-form/components/types';

import { ValidationMessages, Patterns } from '../components/constants';
import { TextInput } from 'ark-form/components/TextInput';

const onSubmit = (event, data) => void 0;

interface ZipFormInterface {
  form: { onSubmit; validateOnChange };
  fullName: { value };
  zipCode: { value };
}
const ZipForm = ({ form, zipCode, fullName }: ZipFormInterface) => {
  return (
    <Form name='tempForm' onSubmit={form.onSubmit} validateOnChange={form.validateOnChange}>
      <TextInput
        name='zip'
        initialValue={zipCode.value}
        label='ZIP CODE *'
        required
        pattern={{ regexp: Patterns.zipCode, message: ValidationMessages.zipCode.patternMismatch }}
      ></TextInput>
      <TextInput
        name='fullName'
        initialValue={fullName.value}
        label='FULL NAME *'
        required
        pattern={{ regexp: Patterns.fullName, message: ValidationMessages.fullName.patternMismatch }}
      ></TextInput>
      <button className='button' type='submit'>
        RENT THIS LOOK
      </button>
    </Form>
  );
};

describe('', () => {
  const props: ZipFormInterface = {
    form: { onSubmit: onSubmit, validateOnChange: true },
    zipCode: { value: '' },
    fullName: { value: '' },
  };
});
