"use strict";

exports.__esModule = true;
exports.default = void 0;

var _propTypes = _interopRequireDefault(require("prop-types"));

var _react = _interopRequireDefault(require("react"));

var _reactLifecyclesCompat = _interopRequireDefault(require("react-lifecycles-compat"));

var _reactDom = require("react-dom");

var _Input = _interopRequireDefault(require("./Input"));

var _localizers = require("./util/localizers");

var CustomPropTypes = _interopRequireWildcard(require("./util/PropTypes"));

var Props = _interopRequireWildcard(require("./util/Props"));

var _class,
    _class2,
    _temp2,
    _jsxFileName = "src/DateTimePickerInput.js";

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

var DateTimePickerInput = (0, _reactLifecyclesCompat.default)(_class = (_temp2 = _class2 =
/*#__PURE__*/
function (_React$Component) {
  _inheritsLoose(DateTimePickerInput, _React$Component);

  function DateTimePickerInput() {
    var _temp, _this;

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return (_temp = _this = _React$Component.call.apply(_React$Component, [this].concat(args)) || this, _this.state = {}, _this.handleBlur = function (event) {
      var _this$props = _this.props,
          format = _this$props.format,
          culture = _this$props.culture,
          parse = _this$props.parse,
          onChange = _this$props.onChange,
          onBlur = _this$props.onBlur;
      onBlur && onBlur(event);

      if (_this._needsFlush) {
        var date = parse(event.target.value);
        _this._needsFlush = false;
        onChange(date, formatDate(date, format, culture));
      }
    }, _this.handleChange = function (_ref) {
      var value = _ref.target.value;
      _this._needsFlush = true;

      _this.setState({
        textValue: value
      });
    }, _temp) || _assertThisInitialized(_this);
  }

  DateTimePickerInput.getDerivedStateFromProps = function getDerivedStateFromProps(nextProps) {
    var value = nextProps.value,
        editing = nextProps.editing,
        editFormat = nextProps.editFormat,
        format = nextProps.format,
        culture = nextProps.culture;
    return {
      textValue: formatDate(value, editing && editFormat ? editFormat : format, culture)
    };
  };

  var _proto = DateTimePickerInput.prototype;

  _proto.focus = function focus() {
    (0, _reactDom.findDOMNode)(this).focus();
  };

  _proto.render = function render() {
    var _props = this.props,
        disabled = _props.disabled,
        readOnly = _props.readOnly;
    var textValue = this.state.textValue;
    var props = Props.omitOwn(this);
    return _react.default.createElement(_Input.default, _extends({}, props, {
      type: "text",
      className: "rw-widget-input",
      value: textValue,
      disabled: disabled,
      readOnly: readOnly,
      onChange: this.handleChange,
      onBlur: this.handleBlur,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 71
      },
      __self: this
    }));
  };

  return DateTimePickerInput;
}(_react.default.Component), _class2.propTypes = {
  format: CustomPropTypes.dateFormat.isRequired,
  editing: _propTypes.default.bool,
  editFormat: CustomPropTypes.dateFormat,
  parse: _propTypes.default.func.isRequired,
  value: _propTypes.default.instanceOf(Date),
  onChange: _propTypes.default.func.isRequired,
  onBlur: _propTypes.default.func,
  culture: _propTypes.default.string,
  disabled: CustomPropTypes.disabled,
  readOnly: CustomPropTypes.disabled
}, _temp2)) || _class;

var _default = DateTimePickerInput;
exports.default = _default;

function isValid(d) {
  return !isNaN(d.getTime());
}

function formatDate(date, format, culture) {
  var val = '';
  if (date instanceof Date && isValid(date)) val = _localizers.date.format(date, format, culture);
  return val;
}

module.exports = exports["default"];