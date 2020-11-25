import React from 'react';

import styles from './index.module.scss';

import { PhoneInput } from '@components/PhoneInput/PhoneInput';
import { SelectInput } from '@components/SelectInput/SelectInput';
import { FullNameInput } from '@components/FullNameInput/FullNameInput';
import { CheckboxInput } from '@components/CheckboxInput/CheckboxInput';
import { ZipCodeInput } from '@components/ZipCodeInput/ZipCodeInput';
import { DatePicker } from '@components/DatePicker/DatePicker';

import { Form } from 'ark-form/src';

import { Button } from '@components/Button/Button';

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
      <Form name='tempForm' onSubmit={onSubmit} validateOnChange={false}>
        <FullNameInput name='fullName' initialValue='' label='FULL NAME *' required></FullNameInput>
        <ZipCodeInput name='zip' label='ZIP CODE *' required></ZipCodeInput>
        <PhoneInput name='phone' initialValue='123' label='PHONE *' required></PhoneInput>
        <CheckboxInput
          initialValue={true}
          name='phoneOptIn'
          onChange={onPhoneOptInChecked}
          label='It’s OK for an expert style consultant to call me about my event or other promotional events I won’t want to miss.'
        ></CheckboxInput>
        <DatePicker name='date' label='SELECT DATE *' onChange={onDateSelected} required></DatePicker>
        <SelectInput
          initialValue={options[0].value}
          name='role'
          label='SELECT ROLE *'
          options={options}
          onChange={onRoleSelected}
          required
        ></SelectInput>
        <Button type='submit'>RENT THIS LOOK</Button>
      </Form>
    </div>
  );
};

export default IndexPage;
