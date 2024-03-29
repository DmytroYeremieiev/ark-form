import React, { useState } from 'react';

import styles from './index.module.scss';
import Forms from '@components/Forms';

import { Button } from '@components/Button/Button';
const options = [
  { label: 'Faculty', value: 'faculty' },
  { label: 'Student', value: 'student' },
];
const IndexPage = (): JSX.Element => {
  const [role, setRole] = useState(options[0].value);

  const onSubmit = (event, data) => {
    console.log('onSubmit', data);
  };
  const onPhoneOptInChecked = (event, value) => {
    console.log('onPhoneOptInChecked', value);
  };
  const onRoleSelected = (event, value) => {
    console.log('onRoleSelected', value);
    setRole(value);
  };
  const onDateSelected = (event, value) => {
    console.log('onDateSelected', value);
  };
  return (
    <div className={styles['page-content']}>
      <Forms.Form name='tempForm' onSubmit={onSubmit} validateOnChange={false}>
        <Forms.FullNameInput name='fullName' initialValue='' label='FULL NAME *' required></Forms.FullNameInput>
        <Forms.ZipCodeInput name='zip' label='ZIP CODE *' required></Forms.ZipCodeInput>
        <Forms.PhoneInput name='phone' initialValue='123' label='PHONE *' required></Forms.PhoneInput>
        <Forms.CheckboxInput
          initialValue={false}
          name='phoneOptIn'
          onChange={onPhoneOptInChecked}
          label='Pellentesque pulvinar dolor vitae augue facilisis ultrices. Donec at tristique leo. Integer a velit pharetra risus suscipit dictum.'
        ></Forms.CheckboxInput>
        <Forms.DatePicker name='date' label='SELECT DATE *' onChange={onDateSelected} required></Forms.DatePicker>
        <Forms.SelectInput
          // initialValue={options[0].value}
          name='role'
          label='SELECT ROLE *'
          options={options}
          onChange={onRoleSelected}
          required
        ></Forms.SelectInput>
        <Button type='submit'>SUBMIT</Button>
      </Forms.Form>
    </div>
  );
};

export default IndexPage;
