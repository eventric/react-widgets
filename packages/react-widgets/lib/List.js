"use strict";

exports.__esModule = true;
exports.default = void 0;

var _propTypes = _interopRequireDefault(require("prop-types"));

var _react = _interopRequireDefault(require("react"));

var _reactDom = require("react-dom");

var CustomPropTypes = _interopRequireWildcard(require("./util/PropTypes"));

var Props = _interopRequireWildcard(require("./util/Props"));

var _widgetHelpers = require("./util/widgetHelpers");

var _reduceToListState = require("./util/reduceToListState");

var _Listbox = _interopRequireDefault(require("./Listbox"));

var _ListOption = _interopRequireDefault(require("./ListOption"));

var _ListOptionGroup = _interopRequireDefault(require("./ListOptionGroup"));

var _messages = require("./messages");

var _jsxFileName = "src/List.js";

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

var EMPTY_DATA_STATE = {};
var propTypes = {
  data: _propTypes.default.array,
  dataState: _propTypes.default.shape({
    sortedKeys: _propTypes.default.array,
    groups: _propTypes.default.object,
    data: _propTypes.default.array,
    sequentialData: _propTypes.default.array
  }),
  valueAccessor: CustomPropTypes.accessor,
  textAccessor: CustomPropTypes.accessor,
  onSelect: _propTypes.default.func,
  onMove: _propTypes.default.func,
  activeId: _propTypes.default.string,
  itemComponent: CustomPropTypes.elementType,
  groupComponent: CustomPropTypes.elementType,
  optionComponent: CustomPropTypes.elementType,
  renderItem: _propTypes.default.func,
  renderGroup: _propTypes.default.func,
  focusedItem: _propTypes.default.any,
  selectedItem: _propTypes.default.any,
  searchTerm: _propTypes.default.string,
  isDisabled: _propTypes.default.func.isRequired,
  messages: _propTypes.default.shape({
    emptyList: _propTypes.default.func.isRequired
  })
};
var defaultProps = {
  onSelect: function onSelect() {},
  data: [],
  dataState: EMPTY_DATA_STATE,
  optionComponent: _ListOption.default
};

var List =
/*#__PURE__*/
function (_React$Component) {
  _inheritsLoose(List, _React$Component);

  function List() {
    var _temp, _this;

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return (_temp = _this = _React$Component.call.apply(_React$Component, [this].concat(args)) || this, _this.renderItem = function (_ref) {
      var item = _ref.item,
          rest = _objectWithoutProperties(_ref, ["item"]);

      var _this$props = _this.props,
          isDisabled = _this$props.isDisabled,
          renderItem = _this$props.renderItem,
          textAccessor = _this$props.textAccessor,
          valueAccessor = _this$props.valueAccessor;
      var Component = _this.props.itemComponent;

      if (renderItem) {
        return renderItem(_extends({
          item: item
        }, rest));
      } else if (Component) {
        return _react.default.createElement(Component, _extends({
          item: item,
          value: valueAccessor(item),
          text: textAccessor(item),
          disabled: isDisabled(item)
        }, rest, {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 100
          },
          __self: this
        }));
      }

      return textAccessor(item);
    }, _this.renderGroup = function (group) {
      var _this$props2 = _this.props,
          renderGroup = _this$props2.renderGroup,
          Component = _this$props2.groupComponent;

      if (renderGroup) {
        return renderGroup({
          group: group
        });
      } else if (Component) {
        return _react.default.createElement(Component, {
          item: group,
          __source: {
            fileName: _jsxFileName,
            lineNumber: 117
          },
          __self: this
        });
      }

      return group;
    }, _temp) || _assertThisInitialized(_this);
  }

  var _proto = List.prototype;

  _proto.componentDidMount = function componentDidMount() {
    this.move();
  };

  _proto.componentDidUpdate = function componentDidUpdate() {
    this.move();
  };

  _proto.mapItems = function mapItems(fn) {
    var _props = this.props,
        data = _props.data,
        dataState = _props.dataState;
    var sortedKeys = dataState.sortedKeys,
        groups = dataState.groups;
    if (!groups) return data.map(function (item, idx) {
      return fn(item, idx, false);
    });
    var idx = -1;
    return sortedKeys.reduce(function (items, key) {
      var group = groups[key];
      return items.concat(fn(key, idx, true), group.map(function (item) {
        return fn(item, ++idx, false);
      }));
    }, []);
  };

  _proto.move = function move() {
    var _props2 = this.props,
        focusedItem = _props2.focusedItem,
        onMove = _props2.onMove,
        data = _props2.data,
        dataState = _props2.dataState;
    var list = (0, _reactDom.findDOMNode)(this);
    var idx = renderedIndexOf(focusedItem, list, data, dataState);
    var selectedItem = list.children[idx];
    if (selectedItem) (0, _widgetHelpers.notify)(onMove, [selectedItem, list, focusedItem]);
  };

  _proto.renderOption = function renderOption(item, index) {
    var _props3 = this.props,
        activeId = _props3.activeId,
        focusedItem = _props3.focusedItem,
        selectedItem = _props3.selectedItem,
        onSelect = _props3.onSelect,
        isDisabled = _props3.isDisabled,
        searchTerm = _props3.searchTerm,
        Option = _props3.optionComponent;
    var isFocused = focusedItem === item;
    return _react.default.createElement(Option, {
      dataItem: item,
      key: 'item_' + index,
      index: index,
      activeId: activeId,
      focused: isFocused,
      onSelect: onSelect,
      disabled: isDisabled(item),
      selected: selectedItem === item,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 136
      },
      __self: this
    }, this.renderItem({
      item: item,
      index: index,
      searchTerm: searchTerm
    }));
  };

  _proto.render = function render() {
    var _this2 = this;

    var _props4 = this.props,
        className = _props4.className,
        messages = _props4.messages;
    var elementProps = Props.pickElementProps(this);

    var _getMessages = (0, _messages.getMessages)(messages),
        emptyList = _getMessages.emptyList;

    return _react.default.createElement(_Listbox.default, _extends({}, elementProps, {
      className: className,
      emptyListMessage: emptyList(this.props),
      __source: {
        fileName: _jsxFileName,
        lineNumber: 158
      },
      __self: this
    }), this.mapItems(function (item, idx, isHeader) {
      return isHeader ? _react.default.createElement(_ListOptionGroup.default, {
        key: 'group_' + item,
        group: item,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 165
        },
        __self: this
      }, _this2.renderGroup(item)) : _this2.renderOption(item, idx);
    }));
  };

  return List;
}(_react.default.Component);

List.getDataState = _reduceToListState.defaultGetDataState;

function renderedIndexOf(item, list, data, dataState) {
  var groups = dataState.groups,
      sortedKeys = dataState.sortedKeys;
  if (!groups) return data.indexOf(item);
  var runningIdx = -1;
  var idx = -1;
  sortedKeys.some(function (group) {
    var itemIdx = groups[group].indexOf(item);
    runningIdx++;

    if (itemIdx !== -1) {
      idx = runningIdx + itemIdx + 1;
      return true;
    }

    runningIdx += groups[group].length;
  });
  return idx;
}

List.propTypes = propTypes;
List.defaultProps = defaultProps;
var _default = List;
exports.default = _default;
module.exports = exports["default"];