import React, { useState } from 'react';
import classnames from 'classnames';
import DayPicker from 'react-day-picker';
import { FieldStateClassNames, TextInputInterface, ValidityStateInterface } from '../../types';
import { TextInput } from '../TextInput/TextInput';
import styles from './DatePicker.module.scss';
import { useFormContext } from 'ark-forms';

const toDate = (selectedDayField: string): Date => {
  if (!selectedDayField) return null;
  try {
    const res = new Date(selectedDayField);
    res.toISOString();
    return res;
  } catch {
    return null;
  }
};
export const DatePicker = ({ className, required, name, ...rest }: TextInputInterface): JSX.Element => {
  const { state, setFieldValue } = useFormContext();
  const displayValue = state.fieldsData.get(name)?.value ?? '';
  const selectedDay = toDate(displayValue);
  const setSelectedDay = date => {
    setFieldValue(name, date);
  };
  const [showCalendar, setShowCalendar] = useState(false);
  const validate = (date: string): ValidityStateInterface => {
    const result: ValidityStateInterface = {
      valid: true,
    };
    if (!date && required) {
      return { valid: false, className: FieldStateClassNames.requiredError };
    }
    try {
      new Date(date).toISOString();
    } catch {
      return { valid: false, errorMessage: 'Invalid format' };
    }
    return result;
  };
  const daySelected = day => {
    console.log('dat', day);
    setSelectedDay(day);
    setShowCalendar(false);
  };
  const onFocus = () => {
    setShowCalendar(true);
  };
  const onBlur = event => {
    if (!event.relatedTarget) {
      setShowCalendar(false);
    }
    console.log('onBlur', event.target);
  };

  return (
    <div className={styles['date-picker']}>
      {
        <TextInput
          {...rest}
          name={name}
          className={classnames(styles['date-picker-input'], className)}
          readOnly
          initialValue={displayValue}
          onFocus={onFocus}
          onBlur={onBlur}
          validate={validate}
        ></TextInput>
      }
      {showCalendar ? (
        <div className='date-picker-calendar'>
          <DayPicker initialMonth={selectedDay} selectedDays={selectedDay} onDayClick={daySelected} showOutsideDays />
        </div>
      ) : null}
    </div>
  );
};
