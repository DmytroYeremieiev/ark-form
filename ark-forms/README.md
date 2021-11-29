<p align="center">
  <img src="https://dmytroyeremieiev.github.io/ark-form/images/logo1.svg" height="220">
  <h1 align="center">Ark Form validation library</h1>
</p>

<p align="center">
  <a aria-label="NPM version" href="https://www.npmjs.com/package/ark-forms">
    <img alt="" src="https://img.shields.io/github/v/tag/DmytroYeremieiev/ark-form?label=version">
  </a>
  <a aria-label="NPM version" href="https://github.com/DmytroYeremieiev/ark-form/blob/main/ark-forms/dist/ark-forms.cjs.production.min.js">
    <img alt="" src="https://img.badgesize.io/DmytroYeremieiev/ark-form/main/ark-forms/dist/ark-forms.cjs.production.min.js?compression=gzip">
  </a>
  <a aria-label="License" href="https://github.com/DmytroYeremieiev/ark-form/blob/main/LICENSE">
    <img alt="" src="https://img.shields.io/github/license/DmytroYeremieiev/ark-form">
  </a>
</p>

## Table of Contents

- [Overview](#overview)
  - [Codesandbox demos](#codesandbox-demos)
  - [Installation](#installation)
- [Motivation](#motivation)
- [Collaboration](#collaboration)
- [Top-level architecture](#top-level-architecture)
  - [The general data flow](#the-general-data-flow)
  - [Field state evaluation logic](#field-state-evaluation-logic)
  - [Validation](#validation)
  - [`<ArkForm/>` component](#arkform-component)
  - [`<ArkField/>` component](#arkfield-component)
  - [How manually set the field state](#how-manually-set-the-field-state)
- [Connecting to more complex elements](#connecting-to-more-complex-elements)

## Overview

- small, ultra fast and flexible `react` based form validation library;
- predictable and synchronous validation flow, clear and fast test suits
- allows granularly fine-tune each field validation trigger. E.g., consider you need the 1-st field to be validated after `onChange` event occurred and the second field only after `onBlur` event;
- no external dependencies;
- fully written in `typescript`;
- 2.6 kb minified & gzipped;
- compatible with `React v16.8+`;

### Codesandbox demos

- [NextJS template]( https://codesandbox.io/s/arkforms-nextjs-react-sandbox-s2z8o?file=/pages/index.tsx)

- [CRA template]( https://codesandbox.io/s/arkforsm-react-sandbox-pu54w?file=/src/App.tsx)

### Installation

 `npm install ark-form --save` or `yarn add ark-form`

## Motivation

Why not [formik](https://formik.org/docs/overview)?

- extra re-renders, e.g., one field value changes, all other fields within same form undergo re-render;
- can't granularly fine-tune each field validation trigger. All fields within the form are subject to the same validation trigger's rules(`validateOnBlur`, `validateOnChange` exposed only on a top form level);
- `formik` asynchronous validation nature requires the use of `await` constructs: [example1](https://nancyhuynh-til.netlify.app/react-testing-library-waitFor-Formik/), [example2](https://scottsauber.com/2019/05/25/testing-formik-with-react-testing-library/), [example3](https://stackoverflow.com/questions/65753374/react-native-test-failed-when-using-formik-and-yup-as-validation-schema), [example4](https://hackernoon.com/react-forms-with-formik-and-unit-testing-with-react-testing-library-j0b32c9).
- bigger lib size: > ~12kb minified & gzipped
- no `dirty/pristine` indicators' native support for a particular field(you need to resort to custom state `fieldMeta.touched && fieldMeta.initialValue !== fieldMeta.value` constructs);

## Collaboration

Library source files are located at `./ark-forms/src`.

Tests reside at `./ark-forms/__tests__` and `./web/__tests__`.

`web` - next.js and `web-cra` - cra projects are sandboxes of real-world use.

## Top-level architecture

`ark-from` library is based on several components:

![General](https://dmytroyeremieiev.github.io/ark-form/images/ArkForms-General.png)

### The general data flow

All data flow except form submitting) flows start at `<ArkField/>` components which listen for proper event type.

1. `change` or `blur` event happens to the `input` wrapped in a field component `<ArkField/>`;
2. Calculating new field state with `fieldReducer`;
3. Dispatching new field state to `formReducer`, triggering entire form state re-evaluation;
4. Propagating new form & field states using `FormContext` downwards;

### Field state evaluation logic

**when a `change` event occurs:**

![General](https://dmytroyeremieiev.github.io/ark-form/images/ArkForms-Field-Changed.png)

**when a `blur` event occurs:**

![General](https://dmytroyeremieiev.github.io/ark-form/images/ArkForms-Field-Blurred.png)

### Validation

All validation depends on auxiliary function `validate` which executed within `Calculate field validity` stage([field state evaluation logic](#field-state-evaluation-logic)).

```javascript
    interface BasicInput<ET> {
      // ...
      validate?: (value?: string) => ValidityStateInterface;
      // ...
    }
    interface ValidityStateInterface extends Record<string, any>  {
        valid: boolean;
        className?: string;
        errorMessage?: string;
    }
```

### `<ArkForm/>` component

- holds inner `<form/>` element & `<Field>` components;
- manages form state, configuration, creates `<FormContext/>`
- distributes it through `<FormContext/>` between inner `<ArkField>` components.  

Hooking-up managed state with `<form/>` elem happens through setting-up `name`, `onSubmit`, `onChange`, `onBlur` props on your elem. However there's shortcut, through spread operator `{...formProps}`: 

```jsx
    <ArkForm>
      {({ state, formProps }) => (
        <form name={name} {...formProps}>
          {children}
        </form>
      )}
    </ArkForm>
```

**\<ArkForm/> props:**

| Props            | Description                                                  | Default Value |
| :--------------- | :----------------------------------------------------------- | ------------: |
| name             | <form\/> name                                                |          none |
| onSubmit         | onsubmit event handler                                       |          none |
| onChange         | onchange event handler, <br>called on any inner field change |          none |
| validateOnBlur   | Runs fields validation on blur                               |          true |
| validateOnChange | Runs fields validation on change                             |         false |

### `<ArkField/>` component

- encapsulates input field state
- uses children render prop technique in order to share managed state with user's components
- implicitly connected to parent form state through `FormContext`

Hooking-up managed state with html input elem happens through setting-up `value`, `ref`, `onChange`, `onBlur`, `onFocus` props on your input elem:

```jsx
<ArkField>
  {({ fieldProps, fieldState, formContext }) => (
      <div>
          <input id='field1' type='text' {...fieldProps} />
          <label htmlFor='field1'>Field 1</label>
      </div>
  )}
</ArkField>
```

**\<ArkField/> props:**

| Prop         | Description                 | Default |
| ------------ | --------------------------- | ------- |
| name         | Field name                  | none    |
| initialValue | Field initial value         | none    |
| onChange     | onchange event handler      | none    |
| onFocus      | onfocus event handler       | none    |
| onBlur       | onblur event handler        | none    |
| validate     | your own validator callback | none    |

### How manually set the field state

First, you need to hook up to a form context:

```javascript
export interface FormContextInterface {
  state: FormState;
  dispatch: React.Dispatch<FormAction>;
  setFieldState: (name: string, setState: (currState: FieldState) => DeepPartial<FieldState>) => void;
  setFieldValue: (name: string, value: string, configuration?: Partial<FieldConfiguration>) => void;
}
```

Within `<ArkForm/>`, you can call for the form context:  

```javascript
  const formContext = useFormContext();
```

Outside of `<ArkForm/>`, pass ref obj:

```jsx
  ...
  const contextRef = useRef();
  return <ArkForm formContextRef={contextRef}>
    {({ formContext, formProps }) => (
      <form name={name} {...formProps}>
        {children}
      </form>
    )}
  </ArkForm>
```

Once you get formContext reference, you're free to use `formContext.dispatch`, method to alter the form state in any imaginative way. Internally, all components operate only through `dispatch` method and `formReducer`, `fieldReducer` reducers.

Here's implementations of `setFieldState`, `setFieldValue` helper methods exposed publicly to cover most of user's needs:

```javascript
  const setFieldState: FormContextInterface['setFieldState'] = (name, setNewState) => {
    const newState = setNewState(getFieldState(name));
    const mergedNewState = mergeState(getFieldState(name), newState);
    const validatedState = fieldReducer(mergedNewState, { type: 'validate' });
    dispatch({
      type: 'setField',
      fieldState: validatedState,
    });
  };

  const setFieldValue = (name: string, value: string, configuration?: Partial<FieldConfiguration>) => {
    const state = getFieldState(name);
    const newFieldState = fieldReducer(state, {
      value: value,
      type: 'change',
      configuration: { ...state.configuration, ...configuration, validateOnChange: true },
    });
    dispatch({
      type: 'change',
      fieldState: newFieldState,
    });
  };
```

> You can peek more `setFieldState`, `setFieldValue` usages examples at  `/web/components/TestSuit.tsx`.

**Setting field valid:**

```javascript
  formContext.setFieldState(name, () => ({
    configuration: {
      validate: value => ({valid: true}),
    },
  }))
```

**Setting field dirty:**

```javascript
  formContext.setFieldState(name, () => ({ dirty: true, pristine: false }))
```

**Setting field pristine:**

```javascript
  formContext.setFieldState(name, () => ({ dirty: false, pristine: true }))
```

**Consider you having some custom and complex validation logic described at:**

```javascript
  const checkValidity = (
    value?: string,
    pattern?: {
      regexp: RegExp;
      message?: string;
    },
    required?: boolean
  ): ValidityStateInterface => {
    const result: ValidityStateInterface = {
      valid: true,
    };
    if (required && !value) {
      result.className = FieldStateClassNames.requiredError;
      result.valid = false;
      return result;
    }
    if (pattern && value && !pattern.regexp.test(value)) {
      result.className = FieldStateClassNames.patternError;
      result.valid = false;
      result.errorMessage = pattern.message || 'Invalid value';
      return result;
    }
    return result;
  };
  export const TextInput = ({ initialValue = '', name, label, pattern, required, readOnly, ...rest }) => {
    return (
      <ArkField
        name={name}
        validate={value => checkValidity(value, pattern, required)}
        initialValue={initialValue}
        {...rest}
      >
        {({ fieldProps, fieldState, formContext }) => {
          const id = (formContext.state.configuration.name || '') + '-' + name;

          let ErrorMessage = null;
          if (
            fieldState.validity.errorMessage &&
            !fieldState.validity.valid &&
            (fieldState.dirty || formContext.state.submitted)
          ) {
            ErrorMessage = <span className='error'>{fieldState.validity.errorMessage}</span>;
          }

          return (
            <div>
              <div
                title={`${name} field`}
                className={`txo-input-container ${classnames(
                  {
                    [FieldStateClassNames.filled]: fieldState.filled,
                    [FieldStateClassNames.pristine]: fieldState.pristine,
                    [FieldStateClassNames.dirty]: fieldState.dirty,
                    [FieldStateClassNames.invalid]: !fieldState.validity.valid,
                    [FieldStateClassNames.valid]: fieldState.validity.valid,
                  },
                  {
                    [fieldState.validity.className]: fieldState.validity.className && !fieldState.validity.valid,
                  }
                )}`}
              >
                <input id={id} type='text' readOnly={readOnly} {...fieldProps} />
                <label htmlFor={id}>{label}</label>
              </div>
              {ErrorMessage}
            </div>
          );
        }}
      </ArkField>
    );
  };
```

, then in order to maintain all existing validation rules except mandatory requirement rule you will just need to  update your custom validator `checkValidity` arguments:

```javascript
  formContext.setFieldState(name, () => ({
    configuration: {
      validate: value => checkValidity(value, pattern, false),
    },
  }))
```

**Resetting field state:**

```javascript
  formContext.setFieldState(name, () => ({
    ...defaultFieldState,
    configuration: {
      validate: value => checkValidity(value, pattern, required),
    },
  }))
```

**Setting field value:**

```javascript
  formContext.setFieldValue(name, 'Some new value')
```

## Connecting to more complex elements

Plain and simple examples on how to create and connect with a form validation more complex input elements. Original source code is under `./web/components/**`. 

- [Implement datepicker](https://codesandbox.io/s/arkforms-nextjs-react-sandbox-s2z8o?file=/components/DatePicker/DatePicker.tsx)

- [Implement checkbox](https://codesandbox.io/s/arkforms-nextjs-react-sandbox-s2z8o?file=/components/CheckboxInput/CheckboxInput.tsx)

- [Implement select](https://codesandbox.io/s/arkforms-nextjs-react-sandbox-s2z8o?file=/components/SelectInput/SelectInput.tsx)
