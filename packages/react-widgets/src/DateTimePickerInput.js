import PropTypes from 'prop-types'
import React from 'react'
import polyfillLifecycles from 'react-lifecycles-compat'
import { findDOMNode } from 'react-dom'
import moment from 'moment-timezone'

import Input from './Input'
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

    onBlur && onBlur(event)

    if (this._needsFlush) {
      let date = parse(event.target.value)
      date = moment(date).tz(timeZone, true)

      const momentCurrentDate = moment.utc(currentDate).tz(timeZone)

      if (format === 'LT') {
        date.year(momentCurrentDate.year())
        date.month(momentCurrentDate.month())
        date.date(momentCurrentDate.date())
      }
      date = date.toDate()

      this._needsFlush = false
      onChange(date, formatDate(date, format, culture, timeZone))
    }
  }

  handleChange = ({ target: { value } }) => {
    this._needsFlush = true
    this.setState({ textValue: value })
  }

  render() {
    let { disabled, readOnly } = this.props
    let { textValue } = this.state
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

  if (isEditing){
    return textValue
  }
  if (date instanceof Date && isValid(date)) {
    val = moment(date).tz(timeZone).format(format)
  }
  return val
}
