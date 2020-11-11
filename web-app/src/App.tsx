import React from 'react';
import {Form} from 'ark-form';

import {FullNameInput} from './Components/FullNameInput/FullNameInput'
import {ZipCodeInput} from './Components/ZipCodeInput/ZipCodeInput'
import {PhoneInput} from './Components/PhoneInput/PhoneInput'
import {CheckboxInput} from './Components/CheckboxInput/CheckboxInput'
import {DatePicker} from './Components/DatePicker/DatePicker'
import {SelectInput} from './Components/SelectInput/SelectInput'

const App = (): JSX.Element => {
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
    <div className='App'>
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
        <button className='button' type='submit'>
          RENT THIS LOOK
        </button>
      </Form>
    </div>
  );
};

export default App;
