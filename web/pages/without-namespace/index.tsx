import React from 'react';

import styles from './index.module.scss';
import classnames from 'classnames';

import { PhoneInput } from '@components/PhoneInput/PhoneInput';
import { SelectInput } from '@components/SelectInput/SelectInput';
import { FullNameInput } from '@components/FullNameInput/FullNameInput';
import { CheckboxInput } from '@components/CheckboxInput/CheckboxInput';
import { ZipCodeInput } from '@components/ZipCodeInput/ZipCodeInput';
import { DatePicker } from '@components/DatePicker/DatePicker';

import { Button } from '@components/Button/Button';
import { ArkForm } from 'ark-forms';
import { FormStateClassNames } from '@root/types';

export enum ClassNames {
  dirty = 'form-dirty',
  submitted = 'form-submitted',
  pristine = 'form-pristine',
  invalid = 'form-invalid',
  valid = 'form-valid',
}

const IndexPage = (): JSX.Element => {
  const options = [
    { label: 'Faculty', value: 'faculty' },
    { label: 'Student', value: 'student' },
  ];
  const onSubmit = (event, data) => {
    console.log('onSubmit', data);
  };
  const onPhoneOptInChecked = (event, value) => {
    console.log('onPhoneOptInChecked', value);
  };
  const onRoleSelected = (event, value) => {
    console.log('onRoleSelected', value);
  };
  const onDateSelected = (event, value) => {
    console.log('onDateSelected', value);
  };

  return (
    <div className={styles['page-content']}>
      <ArkForm name='tempForm' onSubmit={onSubmit} validateOnChange={false}>
        {({ state, formProps, setFieldState }) => {
          console.log('<ArkForm/>', state);
          return (
            <form
              {...formProps}
              className={classnames({
                [FormStateClassNames.dirty]: state.dirty,
                [FormStateClassNames.submitted]: state.submitted,
                [FormStateClassNames.pristine]: state.pristine,
                [FormStateClassNames.invalid]: state.invalid,
                [FormStateClassNames.valid]: state.valid,
              })}
            >
              {/* <FullNameInput name='fullName' initialValue='' label='FULL NAME *' required></FullNameInput>
              <ZipCodeInput name='zip' label='ZIP CODE *' required></ZipCodeInput>
              <PhoneInput name='phone' initialValue='123' label='PHONE *' required></PhoneInput> */}
              {/* <CheckboxInput
                initialValue={true}
                name='phoneOptIn'
                onChange={onPhoneOptInChecked}
                label='It’s OK for an consultant to call me about my event or other promotional events I won’t want to miss.'
              ></CheckboxInput> */}
              <DatePicker name='date' label='SELECT DATE *' onChange={onDateSelected} required></DatePicker>
              <Button
                onClick={() => {
                  setFieldState('date', {
                    configuration: {
                      validate: value => ({ valid: false }),
                    },
                  });
                }}
              >
                SET DATA VALID
              </Button>

              {/* <SelectInput
                initialValue={options[0].value}
                name='role'
                label='SELECT ROLE *'
                options={options}
                onChange={onRoleSelected}
                required
              ></SelectInput> */}
              <Button type='submit'>SUBMIT</Button>
            </form>
          );
        }}
      </ArkForm>
    </div>
  );
};

export default IndexPage;
