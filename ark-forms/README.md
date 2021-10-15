# ark form
## Overview:
- small and ultra fast;
- no external dependencies;
- fully written in `typescript`;
- 2.6 kb minified & gzipped;

[Codesandbox nextjs template playground with examples..]( https://codesandbox.io/s/arkforms-nextjs-react-sandbox-s2z8o?file=/pages/index.tsx)
[Codesandbox plain react template playground with examples..]( https://codesandbox.io/s/arkforsm-react-sandbox-k3oul?file=/src/App.tsx)

## Motivation:
Why not use `formik`? 
- no dirty/pristine native concept support;
- extra re-renders, one field value changes, all fields under same form are getting re-rendered;
- no form state(e.g. validity status) is calculated before user interacts with a form.

## Installation:


 `npm install ark-form --save`

 or 

 `yarn add ark-form`


, `ark-form` is compatible with `React v16.8+`.


## Top-level architecture:
`ark-from` based on 2 main entities: `<ArkForm/>` & `<Field>`:

### `<ArkForm/>` component:
- holds inner `<form/>` element & `<Field>` components;
- manages form state, configuration, creates `<FormContext/>`
- distributes it through `<FormContext/>` between inner `<Field>` components.  

Hooking-up managed state with `<form/>` elem happens through setting-up `name`, `onSubmit`, `onChange`, `onBlur` props on your elem. However there's shortcut, through spread operator `{...formProps}`: 
```
    <ArkForm>
      {({ state, formProps }) => (
        <form name={name} {...formProps}>
          {children}
        </form>
      )}
    </ArkForm>
```

**\<ArkForm/> props:**

| Props      | Description | Default Value     |
| :---        |    :----   |          ---: |
| name      | <form\/> name       | none   |
| onSubmit   | onsubmit event handler        | none      |
| onChange   | onchange event handler, <br>called on any inner field change        | none      |
| validateOnBlur   | Runs fields validation on blur       | true      |
| validateOnChange   | Runs fields validation on change          | false      |
<br>

### `<Field/>` component:

- encapsulates input field state
- uses children render prop technique in order to share managed state with user's components
- implicitly connected to parent form state through `FormContext`

Hooking-up managed state with html input elem happens through setting-up `value`, `ref`, `onChange`, `onBlur`, `onFocus` props on your input elem:

```
<Field>
  {({ fieldProps, fieldState, formContext }) => {
    return (
      <div>
          <input id='field1' type='text' {...fieldProps} />
          <label htmlFor='field1'>Field 1</label>
      </div>
    );
  }}
</Field>
```

**\<Field/> props:**

| Prop         | Description                  | Default |
|--------------|------------------------------|---------|
| name         | Field name                   | none    |
| initialValue | Field initial value          | none    |
| onChange     | onchange event handler       | none    |
| onFocus      | onfocus event handler        | none    |
| onBlur       | onblur event handler         | none    |
| validate     | your own validator callback  | none    |
<br>
