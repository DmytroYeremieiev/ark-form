import React from 'react';
// import { render, fireEvent, screen } from '../utils/testUtils';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import { doesElemHaveExactClassList, doesFormFieldHaveExactClassList } from 'ark-form/utils/formTestHelper';

import { Form } from 'ark-form/src';
import { ClassNames as FormClassNames } from 'ark-form/src';
import { FieldStateClassNames as FieldClassNames } from 'ark-form/types';

import { ValidationMessages, Patterns } from 'ark-form/constants';
import { TextInput } from 'ark-form/components/TextInput/TextInput';

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

describe('Submitting validation', () => {
  const props: ZipFormInterface = {
    form: { onSubmit: onSubmit, validateOnChange: true },
    zipCode: { value: '' },
    fullName: { value: '' },
  };

  test('submitting pristine form with empty input', () => {
    render(<ZipForm {...props}></ZipForm>);
    const form = screen.getByRole('form');
    const zipCodeField = screen.getByTitle('zip field') as HTMLInputElement;
    const fullNameField = screen.getByTitle('fullName field', { exact: false });

    const submitButton = screen.getByRole('button');
    fireEvent.click(submitButton);
    expect(
      doesElemHaveExactClassList(form, [FormClassNames.submitted, FormClassNames.invalid, FormClassNames.pristine])
    ).toBeTruthy();
    expect(
      doesFormFieldHaveExactClassList(zipCodeField, [
        FieldClassNames.invalid,
        FieldClassNames.requiredError,
        FieldClassNames.pristine,
      ])
    ).toBeTruthy();
    expect(
      doesFormFieldHaveExactClassList(fullNameField, [
        FieldClassNames.invalid,
        FieldClassNames.requiredError,
        FieldClassNames.pristine,
      ])
    ).toBeTruthy();
  });

  test('submitting pristine form with VALID input', () => {
    let submitted = false;
    let data = null;
    const _onSubmit = (event, _data) => {
      submitted = true;
      data = _data;
    };
    render(<ZipForm {...props} form={{ ...props.form, onSubmit: _onSubmit }}></ZipForm>);
    const form = screen.getByRole('form');
    const zipCodeField = screen.getByTitle('zip field', { exact: false });
    const zipCodeInput = screen.getByLabelText('zip', { exact: false, selector: 'input' }) as HTMLInputElement;
    const fullNameField = screen.getByTitle('fullName field', { exact: false });
    const fullNameInput = screen.getByLabelText('full name', {
      exact: false,
      selector: 'input',
    }) as HTMLInputElement;

    fireEvent.change(zipCodeInput, { target: { value: '12341' } });
    fireEvent.change(fullNameInput, { target: { value: 'asdas sadasd' } });
    expect(doesElemHaveExactClassList(form, [FormClassNames.valid, FormClassNames.dirty])).toBeTruthy();
    expect(
      doesFormFieldHaveExactClassList(zipCodeField, [
        FieldClassNames.valid,
        FieldClassNames.filled,
        FieldClassNames.dirty,
      ])
    ).toBeTruthy();
    expect(
      doesFormFieldHaveExactClassList(fullNameField, [
        FieldClassNames.valid,
        FieldClassNames.filled,
        FieldClassNames.dirty,
      ])
    ).toBeTruthy();

    const submitButton = screen.getByRole('button');
    fireEvent.click(submitButton);
    expect(
      doesElemHaveExactClassList(form, [FormClassNames.valid, FormClassNames.dirty, FormClassNames.submitted])
    ).toBeTruthy();
    expect(submitted).toBeTruthy();
    expect(data.get('fullName').value).toEqual('asdas sadasd');
    expect(data.get('fullName').validity.valid).toBeTruthy();
    expect(data.get('zip').value).toEqual('12341');
    expect(data.get('zip').validity.valid).toBeTruthy();
  });
});

describe('Submitting validation with ONLY ON BLUR validation', () => {
  const props: ZipFormInterface = {
    form: { onSubmit: onSubmit, validateOnChange: false },
    zipCode: { value: '' },
    fullName: { value: '' },
  };

  test(`Submitting empty form, then filling with VALID autocomplete data`, () => {
    render(<ZipForm {...props}></ZipForm>);
    const form = screen.getByRole('form');
    const submitButton = screen.getByRole('button');
    fireEvent.click(submitButton);
    const zipCodeField = screen.getByTitle('zip field', { exact: false });
    const zipCodeInput = screen.getByLabelText('zip', { exact: false, selector: 'input' }) as HTMLInputElement;
    const fullNameField = screen.getByTitle('fullName field', { exact: false });
    const fullNameInput = screen.getByLabelText('full name', {
      exact: false,
      selector: 'input',
    }) as HTMLInputElement;

    expect(
      doesElemHaveExactClassList(form, [FormClassNames.submitted, FormClassNames.invalid, FormClassNames.pristine])
    ).toBeTruthy();
    expect(
      doesFormFieldHaveExactClassList(zipCodeField, [
        FieldClassNames.invalid,
        FieldClassNames.requiredError,
        FieldClassNames.pristine,
      ])
    ).toBeTruthy();
    expect(
      doesFormFieldHaveExactClassList(fullNameField, [
        FieldClassNames.invalid,
        FieldClassNames.requiredError,
        FieldClassNames.pristine,
      ])
    ).toBeTruthy();

    fireEvent.change(zipCodeInput, { target: { value: '12341' } });
    fireEvent.change(fullNameInput, { target: { value: 'asdas sadasd' } });
    expect(zipCodeInput.value).toEqual('12341');
    expect(fullNameInput.value).toEqual('asdas sadasd');
    expect(
      doesElemHaveExactClassList(form, [FormClassNames.submitted, FormClassNames.invalid, FormClassNames.pristine])
    ).toBeTruthy();
    expect(
      doesFormFieldHaveExactClassList(zipCodeField, [
        FieldClassNames.filled,
        FieldClassNames.invalid,
        FieldClassNames.requiredError,
        FieldClassNames.pristine,
      ])
    ).toBeTruthy();
    expect(
      doesFormFieldHaveExactClassList(fullNameField, [
        FieldClassNames.filled,
        FieldClassNames.invalid,
        FieldClassNames.requiredError,
        FieldClassNames.pristine,
      ])
    ).toBeTruthy();

    fireEvent.blur(zipCodeInput);
    fireEvent.blur(form);
    expect(
      doesElemHaveExactClassList(form, [FormClassNames.submitted, FormClassNames.valid, FormClassNames.dirty])
    ).toBeTruthy();
    expect(
      doesFormFieldHaveExactClassList(zipCodeField, [
        FieldClassNames.filled,
        FieldClassNames.valid,
        FieldClassNames.dirty,
      ])
    ).toBeTruthy();
    expect(
      doesFormFieldHaveExactClassList(fullNameField, [
        FieldClassNames.filled,
        FieldClassNames.valid,
        FieldClassNames.dirty,
      ])
    ).toBeTruthy();
  });

  test(`Submitting empty form, then filling with INVALID autocomplete data`, () => {
    render(<ZipForm {...props}></ZipForm>);
    const form = screen.getByRole('form');
    const submitButton = screen.getByRole('button');
    fireEvent.click(submitButton);
    const zipCodeField = screen.getByTitle('zip field', { exact: false });
    const zipCodeInput = screen.getByLabelText('zip', { exact: false, selector: 'input' }) as HTMLInputElement;
    const fullNameField = screen.getByTitle('fullName field', { exact: false });
    const fullNameInput = screen.getByLabelText('full name', {
      exact: false,
      selector: 'input',
    }) as HTMLInputElement;

    expect(
      doesElemHaveExactClassList(form, [FormClassNames.submitted, FormClassNames.invalid, FormClassNames.pristine])
    ).toBeTruthy();
    expect(
      doesFormFieldHaveExactClassList(zipCodeField, [
        FieldClassNames.invalid,
        FieldClassNames.requiredError,
        FieldClassNames.pristine,
      ])
    ).toBeTruthy();
    expect(
      doesFormFieldHaveExactClassList(fullNameField, [
        FieldClassNames.invalid,
        FieldClassNames.requiredError,
        FieldClassNames.pristine,
      ])
    ).toBeTruthy();

    fireEvent.change(zipCodeInput, { target: { value: '123' } });
    fireEvent.change(fullNameInput, { target: { value: 'asdas s' } });
    expect(zipCodeInput.value).toEqual('123');
    expect(fullNameInput.value).toEqual('asdas s');
    expect(
      doesElemHaveExactClassList(form, [FormClassNames.submitted, FormClassNames.invalid, FormClassNames.pristine])
    ).toBeTruthy();
    expect(
      doesFormFieldHaveExactClassList(zipCodeField, [
        FieldClassNames.filled,
        FieldClassNames.invalid,
        FieldClassNames.requiredError,
        FieldClassNames.pristine,
      ])
    ).toBeTruthy();
    expect(
      doesFormFieldHaveExactClassList(fullNameField, [
        FieldClassNames.filled,
        FieldClassNames.invalid,
        FieldClassNames.requiredError,
        FieldClassNames.pristine,
      ])
    ).toBeTruthy();

    fireEvent.blur(form);

    const zipCodeErrorMessage = screen.queryByText(ValidationMessages.zipCode.patternMismatch);
    expect(zipCodeErrorMessage).toBeInTheDocument();
    const fullNameErrorMessage = screen.queryByText(ValidationMessages.fullName.patternMismatch);
    expect(fullNameErrorMessage).toBeInTheDocument();

    expect(
      doesElemHaveExactClassList(form, [FormClassNames.submitted, FormClassNames.invalid, FormClassNames.dirty])
    ).toBeTruthy();
    expect(
      doesFormFieldHaveExactClassList(zipCodeField, [
        FieldClassNames.filled,
        FieldClassNames.invalid,
        FieldClassNames.dirty,
        FieldClassNames.patternError,
      ])
    ).toBeTruthy();
    expect(
      doesFormFieldHaveExactClassList(fullNameField, [
        FieldClassNames.filled,
        FieldClassNames.invalid,
        FieldClassNames.dirty,
        FieldClassNames.patternError,
      ])
    ).toBeTruthy();
  });
});
