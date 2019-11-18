import PropTypes from 'prop-types'
import React from 'react'
import polyfillLifecycles from 'react-lifecycles-compat'
import { findDOMNode } from 'react-dom'
import moment from 'moment-timezone'

import Input from './Input'
import { date as dateLocalizer } from './util/localizers'
import * as CustomPropTypes from './util/PropTypes'
import * as Props from './util/Props'

@polyfillLifecycles
class DateTimePickerInput extends React.Component {
  static propTypes = {
    format: CustomPropTypes.dateFormat.isRequired,
    editing: PropTypes.bool,
    editFormat: CustomPropTypes.dateFormat,
    parse: PropTypes.func.isRequired,

    value: PropTypes.instanceOf(Date),
    onChange: PropTypes.func.isRequired,
    onBlur: PropTypes.func,
    culture: PropTypes.string,

    disabled: CustomPropTypes.disabled,
    readOnly: CustomPropTypes.disabled,

    timeZone: PropTypes.string,
    currentDate: PropTypes.instanceOf(Date)
  }

  state = {}

  static getDerivedStateFromProps(nextProps, nextState) {
    let { value, editing, editFormat, format, culture, timeZone } = nextProps
    let { textValue } = nextState
    // console.warn('DateTimePickerInput/getDerivedState value', value)
    // console.warn('DateTimePickerInput/getDerivedState editing', editing)
    // console.warn('DateTimePickerInput/getDerivedState editFormat', editFormat)
    // console.warn('DateTimePickerInput/getDerivedState textValue', textValue)

    // const text = textValue !== value ? textValue : null
    return {
      textValue: formatDate(
        value,
        editing && editFormat ? editFormat : format,
        culture,
        timeZone,
        editing,
        textValue
      ),
    }
  }


  componentDidUpdate(prevProps) {
    let { value, editing, editFormat, format, culture, timeZone } = this.props
    // console.warn("componentDidUpdate value", value)
    if (value && value !== prevProps.value) {
      this.setState({
        textValue: formatDate(
          value,
          editing && editFormat ? editFormat : format,
          culture,
          timeZone,
        ),
      })
    }
  }

  focus() {
    findDOMNode(this).focus()
  }

  handleBlur = event => {
    let { format, culture, parse, onChange, onBlur, timeZone, currentDate } = this.props
    // console.warn("DateTimePickerInput/handleBlur")
    // console.warn("DateTimePickerInput/handleBlur format", format)
    onBlur && onBlur(event)

    if (this._needsFlush) {
      // console.warn("FLUSHING")
      // console.warn("DateTimePickerInput/handleBlur target value", event.target.value)
      let date = parse(event.target.value)
      // console.warn("DateTimePickerInput/handleBlur parsed date", date)
      date = moment(date).tz(timeZone, true)
      // console.warn("DateTimePickerInput/handleBlur converted date", date)
      const momentCurrentDate = moment.utc(currentDate).tz(timeZone)
      // console.warn("handleBlur currentDate", momentCurrentDate.format())
      if (format === 'LT') {
        date.year(momentCurrentDate.year())
        date.month(momentCurrentDate.month())
        date.date(momentCurrentDate.date())
      }
      date = date.toDate()
      // console.warn("DateTimePickerInput/handleBlur final date", date)
      this._needsFlush = false
      onChange(date, formatDate(date, format, culture, timeZone))
    }
  }

  handleChange = ({ target: { value } }) => {
    // console.warn("DateTimePickerInput/handleChange value", value)
    this._needsFlush = true
    this.setState({ textValue: value }, () => {
      // console.warn("DateTimePickerInput/handleChange state", this.state.textValue)
      // console.warn("===========================================")
    })
  }

  render() {
    let { disabled, readOnly } = this.props
    let { textValue } = this.state
    // console.warn("textValue", textValue)
    let props = Props.omitOwn(this)

    return (
      <Input
        {...props}
        type="text"
        className="rw-widget-input"
        value={textValue}
        disabled={disabled}
        readOnly={readOnly}
        onChange={this.handleChange}
        onBlur={this.handleBlur}
      />
    )
  }
}

export default DateTimePickerInput

function isValid(d) {
  return !isNaN(d.getTime())
}

function formatDate(date, format, culture, timeZone, isEditing, textValue) {
  var val = ''

  // console.warn("DateTimePickerInput/formatDate date", date)
  // console.warn("DateTimePickerInput/formatDate timeZone", timeZone)
  // console.warn("DateTimePickerInput/formatDate isEditing", isEditing)
  // console.warn("DateTimePickerInput/formatDate textValue", textValue)

  if (isEditing){
    return textValue
  }
  if (date instanceof Date && isValid(date)) {
    // val = dateLocalizer.format(date, format, culture)
    val = moment(date).tz(timeZone).format(format)
  }
  return val
}
