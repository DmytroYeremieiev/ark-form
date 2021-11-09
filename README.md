# Ark Form - form validation library

## Overview

- small and ultra fast;
- no external dependencies;
- fully written in `typescript`;
- 2.6 kb minified & gzipped;
- compatible with `React v16.8+`;

### Codesandbox demos with examples

- [nextjs template]( https://codesandbox.io/s/arkforms-nextjs-react-sandbox-s2z8o?file=/pages/index.tsx)

- [plain react template]( https://codesandbox.io/s/arkforsm-react-sandbox-pu54w?file=/src/App.tsx)

## Motivation

Why not use `formik`?

- no dirty/pristine native concept support;
- extra re-renders, one field value changes, all fields under same form are getting re-rendered;
- no form state(e.g. validity status) is calculated before user interacts with a form.

## Installation

 `npm install ark-form --save` or `yarn add ark-form`

## Collaboration

Library source files are located at `./ark-forms/src`.

Tests reside at `./ark-forms/__tests__` and `./web/__tests__`.

`web` - next.js and `web-cra` - cra projects are sandboxes of real-world use.

## Top-level architecture

`ark-from` library is based on several components:

![General](https://dmytroyeremieiev.github.io/ark-form/images/ArkForms-General.png)

**The general data flow**:

1. `change` or `blur` event happens to the `input` wrapped in a field component `<ArkField/>`;
2. Calculate new field state with `fieldReducer`;
3. Dispatch new field state to `formReducer` and trigger form state re-evaluation;
4. Propagate new form & field states using `FormContext`;

**Field state evaluation logic when a `change` event occurs:**

![General](https://dmytroyeremieiev.github.io/ark-form/images/ArkForms-Field-Changed.png)

**Field state evaluation logic when a `blur` event occurs:**

![General](https://dmytroyeremieiev.github.io/ark-form/images/ArkForms-Field-Blurred.png)

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

When you need to hook up to a form context

```javascript
export interface FormContextInterface {
  state: FormState;
  dispatch: React.Dispatch<FormAction>;
  setFieldState: (name: string, setState: (currState: FieldState) => DeepPartial<FieldState>) => void;
  setFieldValue: (name: string, value: string, configuration?: Partial<FieldConfiguration>) => void;
}
```

within `<ArkForm/>`, you can call for the form context:  

```javascript
  const formContext = useFormContext();
```

, or outside of `<ArkForm/>` by passing ref obj:

```jsx
    const contextRef = useRef();
    return <ArkForm formContextRef={contextRef}>
      {({ state, formProps }) => (
        <form name={name} {...formProps}>
          {children}
        </form>
      )}
    </ArkForm>
```