import React, { useState } from "react";
import classnames from "classnames";
import DayPicker from "react-day-picker";
import dayjs from "dayjs";
import { TextInput } from "../TextInput";
import { TextInputInterface } from "../../types";

import "./DatePicker.scss";

// returns date local to central time zone
const datePattern = /^(\d{4})-(\d{2})-(\d{2})/;
const displayFormat = "MMMM D, YYYY";

export const format = (date: Date): string => {
  return dayjs(date).format(displayFormat);
};

export const parseServerDate = (date: string): Date => {
  const [, year, month, day] = datePattern.exec(date);
  return new Date(`${year}-${month}-${day}T00:00:00-06:00`);
};

export const DatePicker = ({
  className,
  initialValue,
  ...rest
}: TextInputInterface): JSX.Element => {
  const [selectedDay, setSelectedDay] = useState<Date>(
    parseServerDate(initialValue.toString())
  );
  const [showCalendar, setShowCalendar] = useState(false);
  const daySelected = (day) => {
    console.log("dat", day);
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
    console.log("onBlur", event.target);
  };

  return (
    <div className="date-picker">
      {
        <TextInput
          {...rest}
          className={classnames("date-picker-input", className)}
          readOnly
          initialValue={selectedDay ? format(selectedDay) : ""}
          onFocus={onFocus}
          onBlur={onBlur}
        ></TextInput>
      }
      {showCalendar ? (
        <div className="date-picker-calendar">
          <DayPicker
            selectedDays={selectedDay}
            onDayClick={daySelected}
            showOutsideDays
          />
        </div>
      ) : null}
    </div>
  );
};
