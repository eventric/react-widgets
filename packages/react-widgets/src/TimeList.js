import React from 'react'
import polyfillLifecycles from 'react-lifecycles-compat'
import PropTypes from 'prop-types'
import moment from 'moment-timezone'

import List from './List'
import dates from './util/dates'

import reduceToListState from './util/reduceToListState'
import { date as dateLocalizer } from './util/localizers'
import * as CustomPropTypes from './util/PropTypes'

const format = props => dateLocalizer.getFormat('time', props.format)

const accessors = {
  text: item => item.label,
  value: item => item.date,
}

const find = (arr, fn) => {
  for (let i = 0; i < arr.length; i++) if (fn(arr[i])) return arr[i]
  return null
}

function getBounds({ min, max, currentDate, timeZone, value }) {
  // console.warn("GET BOUNDS")
  // console.warn(value)
  // console.warn(timeZone)
  const date = value || new Date(new Date().setHours(0, 0, 0, 0))
  let start = moment.utc(date).tz(timeZone).startOf('day').toDate()
  let end =  moment(start).add(1, 'days').toDate()
  // console.warn(date)

  // date parts are equal
  return {
    min: min && dates.eq(date, min, 'day')
      ? min
      : start,
    max: max && dates.eq(date, max, 'day')
      ? max
      : end,
  }
}

function getDates({ step, culture, ...props }) {
  let times = []
  let { min, max } = getBounds(props)
  // console.warn("getDates min", min)
  // console.warn("getDates max", max)
  while (dates.lt(min, max)) {
    times.push({
      // date: moment.utc(min).tz(props.timeZone, true).toDate(),
      date: moment.utc(min).toDate(),
      label: moment.utc(min).tz(props.timeZone).format('LT')
      // label: moment.utc(min).tz(props.timeZone, true).format('LT')
      // label: moment(min).format('LT')
    })
    // min = moment.utc(min).tz(props.timeZone, true).add(step || 30, 'minutes').toDate()
    min = moment.utc(min).add(step || 30, 'minutes').toDate()
  }

  return times
}

@polyfillLifecycles
class TimeList extends React.Component {
  static defaultProps = {
    step: 30,
    currentDate: new Date(),
    min: new Date(1900, 0, 1),
    max: new Date(2099, 11, 31),
    preserveDate: true,
  }

  static propTypes = {
    value: PropTypes.instanceOf(Date),
    step: PropTypes.number,
    min: PropTypes.instanceOf(Date),
    max: PropTypes.instanceOf(Date),
    currentDate: PropTypes.instanceOf(Date),

    itemComponent: CustomPropTypes.elementType,
    listProps: PropTypes.object,

    format: CustomPropTypes.dateFormat,
    onSelect: PropTypes.func,
    preserveDate: PropTypes.bool,
    culture: PropTypes.string,
  }

  state = {}

  static getDerivedStateFromProps(nextProps, prevState) {
    let { value, currentDate, step } = nextProps
    let data = getDates(nextProps)
    let currentValue = value || currentDate

    const list = reduceToListState(data, prevState.list, {
      nextProps,
    })

    let selectedItem = find(data, t =>
      dates.eq(t.date, currentValue, 'minutes')
    )
    let closestDate = find(
      data,
      t => Math.abs(dates.diff(t.date, currentValue, 'minutes')) < step
    )

    return {
      data,
      list,
      selectedItem: list.nextEnabled(selectedItem),
      focusedItem: list.nextEnabled(selectedItem || closestDate || data[0]),
    }
  }

  componentWillUnmount() {
    this.unmounted = true
  }

  handleKeyDown = e => {
    let { key } = e
    let { focusedItem, list } = this.state

    if (key === 'End') {
      e.preventDefault()
      this.setState({ focusedItem: list.last() })
    } else if (key === 'Home') {
      e.preventDefault()
      this.setState({ focusedItem: list.first() })
    } else if (key === 'Enter') {
      this.props.onSelect(focusedItem)
    } else if (key === 'ArrowDown') {
      e.preventDefault()
      this.setState({ focusedItem: list.next(focusedItem) })
    } else if (key === 'ArrowUp') {
      e.preventDefault()
      this.setState({ focusedItem: list.prev(focusedItem) })
    }
  }

  render() {
    let { listProps, ...props } = this.props
    let { data, list, focusedItem, selectedItem } = this.state

    delete props.currentDate
    delete props.min
    delete props.max
    delete props.step
    delete props.format
    delete props.culture
    delete props.preserveDate
    delete props.value

    return (
      <List
        {...props}
        {...listProps}
        data={data}
        dataState={list.dataState}
        isDisabled={list.isDisabled}
        textAccessor={accessors.text}
        valueAccessor={accessors.value}
        selectedItem={selectedItem}
        focusedItem={focusedItem}
      />
    )
  }
}

export default TimeList
