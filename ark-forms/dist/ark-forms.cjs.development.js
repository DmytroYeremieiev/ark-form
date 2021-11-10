'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = require('react');
var React__default = _interopDefault(React);

function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _createForOfIteratorHelperLoose(o, allowArrayLike) {
  var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];
  if (it) return (it = it.call(o)).next.bind(it);

  if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
    if (it) o = it;
    var i = 0;
    return function () {
      if (i >= o.length) return {
        done: true
      };
      return {
        done: false,
        value: o[i++]
      };
    };
  }

  throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

var defaultFieldState = {
  changed: 0,
  blurred: false,
  dirty: false,
  pristine: true,
  filled: false,
  value: '',
  validity: {
    valid: false
  }
};

var handleChange = function handleChange(state, action) {
  var _action$configuration, _action$configuration2, _action$configuration3, _action$configuration4;

  var newState = _extends({}, state, {
    changed: state.changed + 1,
    value: action.value,
    filled: !!action.value
  });

  var validateOnChange = (_action$configuration = (_action$configuration2 = action.configuration) == null ? void 0 : _action$configuration2.validateOnChange) != null ? _action$configuration : state.configuration.validateOnChange;
  var validate = (_action$configuration3 = (_action$configuration4 = action.configuration) == null ? void 0 : _action$configuration4.validate) != null ? _action$configuration3 : state.configuration.validate;

  if (validateOnChange) {
    newState.dirty = true;
    newState.pristine = false;
    newState.validity = validate(action.value);
  }

  return newState;
};

var handleBlur = function handleBlur(state, action) {
  var _action$configuration5, _action$configuration6, _action$configuration7, _action$configuration8;

  var validateOnBlur = (_action$configuration5 = (_action$configuration6 = action.configuration) == null ? void 0 : _action$configuration6.validateOnBlur) != null ? _action$configuration5 : state.configuration.validateOnBlur;
  var validate = (_action$configuration7 = (_action$configuration8 = action.configuration) == null ? void 0 : _action$configuration8.validate) != null ? _action$configuration7 : state.configuration.validate;
  if (!validateOnBlur || state.changed === 0) return _extends({}, state, {
    blurred: true
  });
  var validity = validate(state.value);
  return _extends({}, state, {
    dirty: true,
    pristine: false,
    blurred: true,
    validity: validity
  });
};

var setDirty = function setDirty(state) {
  return _extends({}, state, {
    dirty: true,
    pristine: false
  });
};

var handleValidation = function handleValidation(state, action) {
  var _action$configuration9, _action$configuration10;

  var validate = (_action$configuration9 = (_action$configuration10 = action.configuration) == null ? void 0 : _action$configuration10.validate) != null ? _action$configuration9 : state.configuration.validate;
  var validity = validate(state.value);
  return _extends({}, state, {
    validity: validity
  });
};

var mergeState = function mergeState(prevState, newState) {
  var result = _extends({}, prevState, newState);

  return _extends({}, result, {
    configuration: _extends({}, prevState.configuration, newState.configuration),
    validity: _extends({}, prevState.validity, newState.validity)
  });
};
var fieldReducer = function fieldReducer(state, action) {
  switch (action.type) {
    case 'change':
      return handleChange(state, action);

    case 'blur':
      return handleBlur(state, action);

    case 'dirty':
      return setDirty(state);

    case 'validate':
      return handleValidation(state, action);

    default:
      throw new Error('Invalid action type');
  }
};

var defaultFormState = {
  dirty: false,
  pristine: true,
  invalid: true,
  valid: false,
  submitted: false,
  changed: false,
  blurred: 0,
  fieldsData: /*#__PURE__*/new Map(),
  configuration: {
    name: '',
    validateOnBlur: true,
    validateOnChange: false
  }
};

var handleSubmit = function handleSubmit(state) {
  return _extends({}, state, handleValidation$1(state), {
    submitted: true
  });
};

var setFieldsDirty = function setFieldsDirty(fieldsData) {
  fieldsData.forEach(function (fieldState, fieldName) {
    if (fieldState.changed && !fieldState.dirty && !fieldState.configuration.validateOnChange) {
      fieldsData.set(fieldName, fieldReducer(fieldReducer(fieldState, {
        type: 'dirty'
      }), {
        type: 'validate'
      }));
    }
  });
};

var handleBlur$1 = function handleBlur(state, action) {
  var newState = _extends({}, state, {
    blurred: state.blurred + 1
  });

  var fieldState = action.fieldState;
  newState.fieldsData.set(fieldState.configuration.name, fieldState);
  if (!state.configuration.validateOnBlur || !state.changed) return newState;
  newState.dirty = true;
  newState.pristine = false;
  setFieldsDirty(newState.fieldsData);
  newState = handleValidation$1(newState);
  return newState;
};

var handleChange$1 = function handleChange(state, action) {
  var newState = _extends({}, state, {
    changed: true
  });

  var fieldState = action.fieldState;
  newState.fieldsData.set(fieldState.configuration.name, fieldState);

  if (state.configuration.validateOnChange) {
    newState.dirty = true;
    newState.pristine = false;
    newState = handleValidation$1(newState);
  }

  return newState;
};

var handleValidation$1 = function handleValidation(state) {
  var valid = isValid(state.fieldsData);
  return _extends({}, state, {
    invalid: !valid,
    valid: valid
  });
};

var registerField = function registerField(state, action) {
  state.fieldsData = new Map(state.fieldsData);
  var fieldState = action.fieldState;
  state.fieldsData.set(fieldState.configuration.name, fieldState);
  return handleValidation$1(state);
};

var setField = function setField(state, action) {
  var fieldState = action.fieldState;
  state.fieldsData.set(fieldState.configuration.name, fieldState);
  return handleValidation$1(state);
};

var unregisterField = function unregisterField(state, action) {
  state.fieldsData = new Map(state.fieldsData);
  state.fieldsData["delete"](action.fieldState.configuration.name);
  return handleValidation$1(state);
};

var isValid = function isValid(fieldsData) {
  if (!fieldsData) return false;

  for (var _iterator = _createForOfIteratorHelperLoose(fieldsData), _step; !(_step = _iterator()).done;) {
    var _step$value = _step.value,
        fieldState = _step$value[1];

    if (!fieldState.validity.valid) {
      return false;
    }
  }

  return true;
};

var formReducer = function formReducer(state, action) {
  switch (action.type) {
    case 'submit':
      return handleSubmit(state);

    case 'change':
      return handleChange$1(state, action);

    case 'blur':
      return handleBlur$1(state, action);

    case 'validate':
      return handleValidation$1(state);

    case 'registerField':
      return registerField(state, action);

    case 'setField':
      return setField(state, action);

    case 'unregisterField':
      return unregisterField(state, action);

    default:
      throw new Error();
  }
};

var FormContext = /*#__PURE__*/React.createContext({
  state: defaultFormState,
  setFieldState: function setFieldState() {
    return void 0;
  },
  setFieldValue: function setFieldValue() {
    return void 0;
  },
  dispatch: function dispatch() {
    return void 0;
  }
});
var FormProvider = FormContext.Provider;
var FormConsumer = FormContext.Consumer;
FormContext.displayName = 'FormContext';
function useFormContext() {
  return React.useContext(FormContext);
}

var ArkField = function ArkField(props) {
  var _formState$fieldsData;

  var formContext = useFormContext();
  var formState = formContext.state;
  var fieldState = (_formState$fieldsData = formState.fieldsData.get(props.name)) != null ? _formState$fieldsData : initializeFieldState(props, formState.configuration);
  return React.useMemo(function () {
    return React__default.createElement(_ArkField, Object.assign({}, props, {
      formContext: formContext,
      state: fieldState
    }));
  }, [// list all state props manually, since form context generates new state obj each time(immutable)
  formState.blurred, formState.submitted, formState.valid, formState.dirty, formState.changed, formState.fieldsData, // <Field> must only concern about its initialValue, validate props change,
  // there's no value in changing other 'configurational' props and event handlers, such as 'name', 'validateOnChange', etc...
  props.initialValue, props.validate, //
  fieldState == null ? void 0 : fieldState.changed, fieldState == null ? void 0 : fieldState.validity, fieldState == null ? void 0 : fieldState.blurred, fieldState == null ? void 0 : fieldState.dirty, fieldState == null ? void 0 : fieldState.pristine, fieldState == null ? void 0 : fieldState.filled]);
};
var defaultValidity = {
  valid: true
};

var getValidity = function getValidity() {
  return defaultValidity;
};

var initializeFieldState = function initializeFieldState(fieldProps, formConfiguration) {
  var _fieldProps$initialVa, _fieldProps$initialVa2, _ref, _fieldProps$validateO, _formConfiguration$va, _fieldProps$validate;

  var value = (_fieldProps$initialVa = (_fieldProps$initialVa2 = fieldProps.initialValue) == null ? void 0 : _fieldProps$initialVa2.toString()) != null ? _fieldProps$initialVa : '';

  var newState = _extends({}, defaultFieldState, {
    value: value,
    filled: !!value,
    configuration: {
      validateOnChange: (_ref = (_fieldProps$validateO = fieldProps.validateOnChange) != null ? _fieldProps$validateO : formConfiguration.validateOnChange) != null ? _ref : true,
      validateOnBlur: (_formConfiguration$va = formConfiguration.validateOnBlur) != null ? _formConfiguration$va : false,
      validate: (_fieldProps$validate = fieldProps.validate) != null ? _fieldProps$validate : getValidity,
      name: fieldProps.name
    }
  });

  return newState;
};

var _ArkField = function _ArkField(props) {
  var initialValue = props.initialValue,
      _props$onChange = props.onChange,
      onChange = _props$onChange === void 0 ? function () {
    return void 0;
  } : _props$onChange,
      _props$onFocus = props.onFocus,
      onFocus = _props$onFocus === void 0 ? function () {
    return void 0;
  } : _props$onFocus,
      _props$onBlur = props.onBlur,
      onBlur = _props$onBlur === void 0 ? function () {
    return void 0;
  } : _props$onBlur,
      children = props.children,
      formContext = props.formContext,
      state = props.state;
  var dispatch = formContext.dispatch;
  var inputRef = React.useRef();
  var didMountRef = React.useRef(false);
  React.useEffect(function () {
    var _initialValue$toStrin;

    if (!didMountRef.current) return;

    var _initialValue = (_initialValue$toStrin = initialValue == null ? void 0 : initialValue.toString()) != null ? _initialValue$toStrin : '';

    dispatch({
      type: 'change',
      fieldState: fieldReducer(state, {
        value: _initialValue,
        type: 'change',
        configuration: {
          validateOnChange: true
        }
      })
    });
  }, [initialValue]);
  React.useEffect(function () {
    // must be in  the latest effect
    didMountRef.current = true;
    dispatch({
      type: 'registerField',
      fieldState: fieldReducer(state, {
        type: 'validate'
      })
    });
    return function () {
      dispatch({
        type: 'unregisterField',
        fieldState: state
      });
    };
  }, []);

  var _onChange = function _onChange(event) {
    var value = inputRef.current.value;
    dispatch({
      type: 'change',
      fieldState: fieldReducer(state, {
        value: value,
        type: 'change'
      })
    });
    onChange(event, value);
  };

  var _onBlur = function _onBlur(event) {
    onBlur(event);
    dispatch({
      type: 'blur',
      fieldState: fieldReducer(state, {
        type: 'blur'
      })
    });
  };

  var _onFocus = function _onFocus(event) {
    onFocus(event);
  };

  var fieldProps = {
    value: state.value,
    ref: inputRef,
    onChange: _onChange,
    onBlur: _onBlur,
    onFocus: _onFocus
  }; // if ("development" !== 'production') {
  //    console.log('field', name, value, fieldState, formState);
  // }

  return children({
    fieldProps: fieldProps,
    fieldState: state,
    formContext: formContext
  });
};

var ArkForm = function ArkForm(_ref) {
  var name = _ref.name,
      onSubmit = _ref.onSubmit,
      children = _ref.children,
      _ref$validateOnChange = _ref.validateOnChange,
      validateOnChange = _ref$validateOnChange === void 0 ? false : _ref$validateOnChange,
      _ref$validateOnBlur = _ref.validateOnBlur,
      validateOnBlur = _ref$validateOnBlur === void 0 ? true : _ref$validateOnBlur,
      formContextRef = _ref.formContextRef;

  var _useReducer = React.useReducer(formReducer, defaultFormState, function (state) {
    state.fieldsData = new Map();
    state.configuration = {
      validateOnChange: validateOnChange,
      validateOnBlur: validateOnBlur,
      name: name
    };
    return state;
  }),
      state = _useReducer[0],
      dispatch = _useReducer[1];

  var getFieldState = function getFieldState(name) {
    var fieldState = state.fieldsData.get(name);
    if (!fieldState) throw 'field name is incorrect';
    return fieldState;
  };

  var setFieldState = function setFieldState(name, setNewState) {
    var newState = setNewState(getFieldState(name));
    var mergedNewState = mergeState(getFieldState(name), newState);
    var validatedState = fieldReducer(mergedNewState, {
      type: 'validate'
    });
    dispatch({
      type: 'setField',
      fieldState: validatedState
    });
  };

  var setFieldValue = function setFieldValue(name, value, configuration) {
    var state = getFieldState(name);
    var newFieldState = fieldReducer(state, {
      value: value,
      type: 'change',
      configuration: _extends({}, state.configuration, configuration, {
        validateOnChange: true
      })
    });
    dispatch({
      type: 'change',
      fieldState: newFieldState
    });
  };

  var _onSubmit = function _onSubmit(event) {
    event.preventDefault();
    dispatch({
      type: 'submit'
    });
    if (state.valid) onSubmit(event, state.fieldsData);
  };

  var formProps = {
    name: name,
    onSubmit: _onSubmit
  };
  var formContext = {
    state: state,
    setFieldState: setFieldState,
    setFieldValue: setFieldValue,
    dispatch: dispatch
  };
  if (formContextRef) formContextRef.current = formContext;
  return React__default.createElement(FormProvider, {
    value: formContext
  }, children({
    formContext: formContext,
    formProps: formProps
  }));
};

exports.ArkField = ArkField;
exports.ArkForm = ArkForm;
exports.FormConsumer = FormConsumer;
exports.FormContext = FormContext;
exports.FormProvider = FormProvider;
exports.defaultFieldState = defaultFieldState;
exports.defaultFormState = defaultFormState;
exports.fieldReducer = fieldReducer;
exports.formReducer = formReducer;
exports.mergeState = mergeState;
exports.useFormContext = useFormContext;
//# sourceMappingURL=ark-forms.cjs.development.js.map
