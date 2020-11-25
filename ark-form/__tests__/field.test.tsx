import React, { useRef } from 'react';
// import { render, fireEvent, screen } from '../utils/testUtils';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import { Form } from 'ark-form/src';

import { ValidationMessages, Patterns } from '../components/constants';
import { FieldInput } from 'ark-form/components/FieldInput';
import { FieldInputInterface } from 'ark-form/components/types';

const onSubmit = (event, data) => void 0;

interface TestFormInterface {
  form: { onSubmit; validateOnChange };
  field1: FieldInputInterface;
  field2: FieldInputInterface;
}
const defaultTestFormProps: TestFormInterface = {
  form: { onSubmit: onSubmit, validateOnChange: true },
  field1: { initialValue: '', name: 'field1', statesRef: { current: null } },
  field2: { initialValue: '', name: 'field2', statesRef: { current: null } },
};
const TestForm = ({ form, field1, field2 }: TestFormInterface) => {
  return (
    <Form name='tempForm' onSubmit={form.onSubmit} validateOnChange={form.validateOnChange}>
      <FieldInput name='field1' {...field1}></FieldInput>
      <FieldInput name='field2' {...field2}></FieldInput>
      <button className='button' type='submit'>
        RENT THIS LOOK
      </button>
    </Form>
  );
};

describe('', () => {
  test(`test1`, () => {
    const field1Ref = useRef();
    const field2Ref = useRef();
    render(
      <TestForm
        {...defaultTestFormProps}
        field1={{ statesRef: field1Ref, name: 'field1' }}
        field2={{ statesRef: field2Ref, name: 'field2' }}
      ></TestForm>
    );
    const zipCodeInput = screen.getByLabelText('zip', { exact: false, selector: 'input' }) as HTMLInputElement;
    expect(zipCodeInput.value).toBe('');
    const error = screen.queryByText(ValidationMessages.zipCode.patternMismatch);
    expect(error).not.toBeInTheDocument();
  });
});
