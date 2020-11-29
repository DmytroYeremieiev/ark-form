import React from 'react';
// import { render, fireEvent, screen } from 'ark-form/utils/testUtils';
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
  form: { onSubmit; validateOnChange; validateOnBlur };
  field: { forceValidation?; initialValue };
}
const ZipForm = (props: ZipFormInterface) => {
  return (
    <Form
      name='tempForm'
      onSubmit={props.form.onSubmit}
      validateOnChange={props.form.validateOnChange}
      validateOnBlur={props.form.validateOnBlur}
    >
      <TextInput
        name='zip'
        initialValue={props.field.initialValue}
        label='ZIP CODE *'
        forceValidation={props.field.forceValidation}
        required
        pattern={{
          regexp: Patterns.zipCode,
          message: ValidationMessages.zipCode.patternMismatch,
        }}
      ></TextInput>
      <TextInput
        name='fullName'
        initialValue={props.field.initialValue}
        label='FULL NAME *'
        forceValidation={props.field.forceValidation}
        required
        pattern={{
          regexp: Patterns.fullName,
          message: ValidationMessages.fullName.patternMismatch,
        }}
      ></TextInput>
      <button className='button' type='submit'>
        RENT THIS LOOK
      </button>
    </Form>
  );
};

describe('Zip Code - text field validation', () => {
  const props: ZipFormInterface = {
    form: { onSubmit: onSubmit, validateOnChange: true, validateOnBlur: true },
    field: { forceValidation: false, initialValue: '' },
  };

  test(`doing nothing will not result in no error`, () => {
    render(<ZipForm {...props}></ZipForm>);
    const zipCodeInput = screen.getByLabelText('zip', {
      exact: false,
      selector: 'input',
    }) as HTMLInputElement;
    expect(zipCodeInput.value).toBe('');
    const error = screen.queryByText(ValidationMessages.zipCode.patternMismatch);
    expect(error).not.toBeInTheDocument();
  });

  test(`erasing input will result in zip FIELD having next classes: ${[
    FieldClassNames.dirty,
    FieldClassNames.invalid,
    FieldClassNames.requiredError,
  ].toString()}`, () => {
    render(<ZipForm {...props} field={{ initialValue: '123' }}></ZipForm>);
    const zipCodeInput = screen.getByLabelText('zip', {
      exact: false,
      selector: 'input',
    }) as HTMLInputElement;
    const zipCodeField = screen.getByTitle('zip field') as HTMLInputElement;
    fireEvent.change(zipCodeInput, { target: { value: '' } });
    expect(
      doesFormFieldHaveExactClassList(zipCodeField, [
        FieldClassNames.dirty,
        FieldClassNames.invalid,
        FieldClassNames.requiredError,
      ])
    ).toBeTruthy();
  });

  test(`erasing input will result in FORM having next classes: ${[
    FormClassNames.dirty,
    FormClassNames.invalid,
  ].toString()}`, () => {
    render(<ZipForm {...props} field={{ initialValue: '123' }}></ZipForm>);
    const zipCodeInput = screen.getByLabelText('zip', {
      exact: false,
      selector: 'input',
    }) as HTMLInputElement;
    const form = screen.getByRole('form');
    fireEvent.change(zipCodeInput, { target: { value: '' } });
    expect(doesElemHaveExactClassList(form, [FormClassNames.dirty, FormClassNames.invalid])).toBeTruthy();
  });

  test(`typing 123 will result in error: ${ValidationMessages.zipCode.patternMismatch}`, () => {
    render(<ZipForm {...props}></ZipForm>);
    const zipCodeInput = screen.getByLabelText('zip', {
      exact: false,
      selector: 'input',
    }) as HTMLInputElement;
    fireEvent.change(zipCodeInput, { target: { value: '123' } });
    expect(zipCodeInput.value).toBe('123');
    const error = screen.getByText(ValidationMessages.zipCode.patternMismatch);
    expect(error).toBeInTheDocument();
  });

  test(`typing 123 will result in FIELD having next classes: ${[
    FieldClassNames.filled,
    FieldClassNames.dirty,
    FieldClassNames.invalid,
    FieldClassNames.patternError,
  ].toString()}`, () => {
    render(<ZipForm {...props}></ZipForm>);
    const zipCodeInput = screen.getByLabelText('zip', {
      exact: false,
      selector: 'input',
    }) as HTMLInputElement;
    const zipCodeField = screen.getByTitle('zip field') as HTMLInputElement;
    fireEvent.change(zipCodeInput, { target: { value: '123' } });
    expect(
      doesFormFieldHaveExactClassList(zipCodeField, [
        FieldClassNames.filled,
        FieldClassNames.dirty,
        FieldClassNames.invalid,
        FieldClassNames.patternError,
      ])
    ).toBeTruthy();
  });

  test(`typing 123 will result in FORM having next classes: ${[
    FormClassNames.dirty,
    FormClassNames.invalid,
  ].toString()}`, () => {
    render(<ZipForm {...props}></ZipForm>);
    const zipCodeInput = screen.getByLabelText('zip', {
      exact: false,
      selector: 'input',
    }) as HTMLInputElement;
    const form = screen.getByRole('form');
    fireEvent.change(zipCodeInput, { target: { value: '123' } });
    expect(doesElemHaveExactClassList(form, [FormClassNames.dirty, FormClassNames.invalid])).toBeTruthy();
  });
});

describe('Zip Code - text field validation ONLY ON BLUR', () => {
  const props: ZipFormInterface = {
    form: { onSubmit: onSubmit, validateOnChange: false, validateOnBlur: true },
    field: { forceValidation: false, initialValue: '' },
  };

  test(`typing 123 and not blurring, ERROR message check`, () => {
    render(<ZipForm {...props}></ZipForm>);
    const zipCodeInput = screen.getByLabelText('zip', {
      exact: false,
      selector: 'input',
    }) as HTMLInputElement;
    const fullNameInput = screen.getByLabelText('full name', {
      exact: false,
      selector: 'input',
    }) as HTMLInputElement;
    fireEvent.change(zipCodeInput, { target: { value: '123' } });
    expect(zipCodeInput.value).toBe('123');
    expect(fullNameInput.value).toBe('');
    const error = screen.queryByText(ValidationMessages.zipCode.patternMismatch);
    expect(error).not.toBeInTheDocument();
  });

  test(`typing 123 and not blurring FORM classes check`, () => {
    render(<ZipForm {...props}></ZipForm>);
    const zipCodeInput = screen.getByLabelText('zip', {
      exact: false,
      selector: 'input',
    }) as HTMLInputElement;
    const form = screen.getByRole('form');
    fireEvent.change(zipCodeInput, { target: { value: '123' } });
    expect(doesElemHaveExactClassList(form, [FormClassNames.pristine, FormClassNames.invalid])).toBeTruthy();
  });

  test(`typing 123 into zip field and not blurring FIELDs classes check`, () => {
    render(<ZipForm {...props}></ZipForm>);
    const zipCodeInput = screen.getByLabelText('zip', {
      exact: false,
      selector: 'input',
    }) as HTMLInputElement;
    const zipCodeField = screen.getByTitle('zip field');
    const fullNameField = screen.getByTitle('fullName field');

    fireEvent.change(zipCodeInput, { target: { value: '123' } });
    expect(
      doesFormFieldHaveExactClassList(zipCodeField, [
        FieldClassNames.requiredError,
        FieldClassNames.filled,
        FieldClassNames.pristine,
        FieldClassNames.invalid,
      ])
    ).toBeTruthy();
    expect(
      doesFormFieldHaveExactClassList(fullNameField, [
        FieldClassNames.requiredError,
        FieldClassNames.pristine,
        FieldClassNames.invalid,
      ])
    ).toBeTruthy();
  });

  test(`typing 123 will and blurring FORM and FIELDs classes check`, () => {
    render(<ZipForm {...props}></ZipForm>);
    const form = screen.getByRole('form');
    const zipCodeInput = screen.getByLabelText('zip', {
      exact: false,
      selector: 'input',
    }) as HTMLInputElement;
    const zipCodeField = screen.getByTitle('zip field');
    const fullNameInput = screen.getByLabelText('full name', {
      exact: false,
      selector: 'input',
    }) as HTMLInputElement;
    const fullNameField = screen.getByTitle('fullName field');

    expect(doesElemHaveExactClassList(form, [FormClassNames.pristine, FormClassNames.invalid])).toBeTruthy();
    expect(
      doesFormFieldHaveExactClassList(zipCodeField, [
        FieldClassNames.pristine,
        FieldClassNames.invalid,
        FieldClassNames.requiredError,
      ])
    ).toBeTruthy();
    expect(
      doesFormFieldHaveExactClassList(fullNameField, [
        FieldClassNames.pristine,
        FieldClassNames.invalid,
        FieldClassNames.requiredError,
      ])
    ).toBeTruthy();

    fireEvent.change(zipCodeInput, { target: { value: '123' } });
    fireEvent.blur(zipCodeInput);
    expect(zipCodeInput.value).toBe('123');
    expect(fullNameInput.value).toBe('');
    expect(doesElemHaveExactClassList(form, [FormClassNames.dirty, FormClassNames.invalid])).toBeTruthy();
    expect(
      doesFormFieldHaveExactClassList(zipCodeField, [
        FieldClassNames.dirty,
        FieldClassNames.filled,
        FieldClassNames.invalid,
        FieldClassNames.patternError,
      ])
    ).toBeTruthy();
    expect(
      doesFormFieldHaveExactClassList(fullNameField, [
        FieldClassNames.pristine,
        FieldClassNames.invalid,
        FieldClassNames.requiredError,
      ])
    ).toBeTruthy();
  });
});
