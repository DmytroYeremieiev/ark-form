import * as React from "react";
import "./styles.scss";
import { Form } from "./components/Form";

import { FullNameInput } from "./components/FullNameInput";
import { PhoneInput } from "./components/PhoneInput";
import { ZipCodeInput } from "./components/ZipCodeInput";
import { SelectInput } from "./components/SelectInput/SelectInput";
import { CheckboxInput } from "./components/CheckboxInput/CheckboxInput";
import { DatePicker } from "./components/DatePicker/DatePicker";
import { Button } from "./components/Button/Button";

const App = (): JSX.Element => {
  const options = [
    { label: "Option 1", value: "option-1" },
    { label: "Option 2", value: "option-2" }
  ];
  const onPhoneOptInChecked = (event, value) => {
    console.log("onPhoneOptInChecked", value);
  };
  const onRoleSelected = (event, value) => {
    console.log("onRoleSelected", value);
  };
  const onSubmit = (event, data) => {
    console.log("onSubmit", data);
  };
  const onDateSelected = (event, value) => {
    console.log("onDateSelected", value);
  };

  return (
    <div className="page-content">
      <Form name="tempForm" onSubmit={onSubmit} validateOnChange={true}>
        <FullNameInput
          name="fullName"
          initialValue=""
          label="FULL NAME *"
          required
        ></FullNameInput>
        <ZipCodeInput name="zip" label="ZIP CODE *" required></ZipCodeInput>
        <PhoneInput
          name="phone"
          initialValue="123"
          label="PHONE *"
          required
        ></PhoneInput>
        <CheckboxInput
          initialValue={true}
          name="phoneOptIn"
          onChange={onPhoneOptInChecked}
          label="Pellentesque pulvinar dolor vitae augue facilisis ultrices. Donec at tristique leo. Integer a velit pharetra risus suscipit dictum."
        ></CheckboxInput>
        <SelectInput
          initialValue={options[0].value}
          name="role"
          label="SELECT ROLE *"
          options={options}
          onChange={onRoleSelected}
          required
        ></SelectInput>
        <DatePicker
          initialValue={"2020-12-12"}
          name="date"
          label="SELECT DATE *"
          onChange={onDateSelected}
          required
        ></DatePicker>
        <Button type="submit">SUBMIT</Button>
      </Form>
    </div>
  );
};

export default App;
