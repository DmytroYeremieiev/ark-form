import React, { useState } from 'react';
import classnames from 'classnames';
import DayPicker from 'react-day-picker';
import { TextInputInterface } from '../../types';
import {TextInput} from '../TextInput/TextInput';
import styles from './DatePicker.module.scss';

export const DatePicker = ({ className, ...rest }: TextInputInterface<string>): JSX.Element => {
  const [selectedDay, setSelectedDay] = useState<Date>(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const daySelected = day => {
    console.log('dat', day);
    setSelectedDay(day);
    setShowCalendar(false);
  };
  const onFocus = () => {
    setShowCalendar(true);
  };
  const onBlur = (event) => {
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
          className={classnames(styles['date-picker-input'], className)}
          readOnly
          initialValue={selectedDay ? selectedDay.toISOString() : ''}
          onFocus={onFocus}
          onBlur={onBlur}
        ></TextInput>
      }
      {showCalendar ? (
        <div className='date-picker-calendar'>
          <DayPicker selectedDays={selectedDay} onDayClick={daySelected} showOutsideDays />
        </div>
      ) : null}
    </div>
  );
};
