import React, { useRef } from 'react';
// import { render, fireEvent, screen } from '../utils/testUtils';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import { FieldOuterProps } from 'ark-forms/src';
import { Form } from 'ark-forms/components/Form';

import { FieldInput } from 'ark-forms/components/FieldInput';
import { FieldInputInterface } from 'ark-forms/components/types';

const onSubmit = (event, data) => void 0;

interface TestFormInterface {
  form: { onSubmit; validateOnChange };
  field1: FieldInputInterface;
  field2: FieldInputInterface;
}

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

describe('testing states, validateOnChange:false ', () => {
  const defaultTestFormProps: TestFormInterface = {
    form: { onSubmit: onSubmit, validateOnChange: false },
    field1: { initialValue: '', name: 'field1', statesRef: { current: null } },
    field2: { initialValue: '', name: 'field2', statesRef: { current: null } },
  };
  test(`typing 123 into field1 doesn't affect other fields`, () => {
    const field1Ref: { current?: FieldOuterProps<HTMLInputElement> } = {};
    const field2Ref: { current?: FieldOuterProps<HTMLInputElement> } = {};
    render(
      <TestForm
        {...defaultTestFormProps}
        field1={{
          statesRef: field1Ref,
          name: 'field1',
          validate: () => ({
            valid: false,
          }),
        }}
        field2={{
          statesRef: field2Ref,
          name: 'field2',
          validate: () => ({
            valid: true,
          }),
        }}
      ></TestForm>
    );
    const field1Input = screen.getByLabelText('field1', {
      exact: false,
      selector: 'input',
    }) as HTMLInputElement;
    fireEvent.change(field1Input, { target: { value: '123' } });
    fireEvent.blur(field1Input);
    expect(field1Ref.current.fieldProps.value).toBe('123');
    expect(field1Ref.current.fieldState.filled).toBeTruthy();
    expect(field1Ref.current.fieldState.dirty).toBeTruthy();
    expect(field1Ref.current.fieldState.pristine).toBeFalsy();
    expect(field1Ref.current.fieldState.validity.valid).toBeFalsy();

    expect(field2Ref.current.fieldProps.value).toBe('');
    expect(field2Ref.current.fieldState.filled).toBeFalsy();
    expect(field2Ref.current.fieldState.dirty).toBeFalsy();
    expect(field2Ref.current.fieldState.pristine).toBeTruthy();
    expect(field2Ref.current.fieldState.validity.valid).toBeTruthy();
  });
});
