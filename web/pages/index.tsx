import React from 'react';

import styles from './index.module.scss';
import Forms from '@components/Forms';

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
      <Forms.Form name='tempForm' onSubmit={onSubmit} validateOnChange={true}>
        <Forms.FullNameInput name='fullName' initialValue='' label='FULL NAME *' required></Forms.FullNameInput>
        <Forms.ZipCodeInput name='zip' label='ZIP CODE *' required></Forms.ZipCodeInput>
        <Forms.PhoneInput name='phone' initialValue='123' label='PHONE *' required></Forms.PhoneInput>
        <Forms.CheckboxInput
          initialValue={true}
          name='phoneOptIn'
          onChange={onPhoneOptInChecked}
          label='It’s OK for an consultant to call me about my event or other promotional events I won’t want to miss.'
        ></Forms.CheckboxInput>
        <Forms.DatePicker name='date' label='SELECT DATE *' onChange={onDateSelected} required></Forms.DatePicker>
        <Forms.SelectInput
          initialValue={options[0].value}
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
