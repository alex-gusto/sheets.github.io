import BaseValidator from '@/components/TreeGridComponent/validator'
import getNextEvent from './utils/get-next-event'
import getPrevEvent from './utils/get-prev-event'

class Validator extends BaseValidator {
  rules = {
    start: this.validateStartDate,
    wowHours: this.validateWowHours,
    nptHours: this.validateNptHours,
    actualHours: this.validateActualHours
  }

  validateStartDate(change) {
    const { id } = change
    const row = this._getRow(id)
    const prevEvent = getPrevEvent(this.grid, row)
    if (!prevEvent) return

    if (row.start && row.start < prevEvent.f_end) {
      this.invalidChanges.addError(id, 'f_start', "Start date/time can't be before previous end date/time")
    } else {
      this.validChanges.removeError(id, 'f_start')
    }
  }

  validateTftHours(id) {
    const row = this._getRow(id)
    const isValid = row.f_tftHours >= 0

    if (isValid) {
      this.validChanges.removeError(id, 'wowHours')
      this.validChanges.removeError(id, 'nptHours')
      this.validChanges.removeError(id, 'actualHours')
    }

    return isValid
  }

  validateNptHours(change) {
    const { id } = change
    const isValid = this.validateTftHours(id)

    if (!isValid) {
      this.invalidChanges.addError(id, 'nptHours', 'NPT and WOW combined cannot be greater than Actual')
    }
  }

  validateWowHours(change) {
    const { id } = change
    const isValid = this.validateTftHours(id)

    if (!isValid) {
      this.invalidChanges.addError(id, 'wowHours', 'NPT and WOW combined cannot be greater than Actual')
    }
  }

  validateEmptyActualHoursIfNextFilled(row) {
    const isCurrentEmpty = row.actualHours === ''
    const nextEvent = getNextEvent(this.grid, row)
    if (!nextEvent) return true

    const isNextNotEmpty = nextEvent.actualHours !== ''

    if (isNextNotEmpty && isCurrentEmpty) {
      this.invalidChanges.addError(row.id, 'actualHours', "Actual hours can't be empty!")
      return false
    }

    this.validChanges.removeError(row.id, 'actualHours')

    return true
  }

  validatePrevActualHoursIfCurrentFilled = row => {
    const { grid, invalidChanges, validChanges } = this
    const isCurrentEmpty = row.actualHours === ''
    let isValid = true

    ;(function setErrorForPrevEvent(_row) {
      const prevEvent = getPrevEvent(grid, _row)
      if (!prevEvent) return

      const isPrevEmpty = prevEvent.actualHours === ''
      if (isPrevEmpty && !isCurrentEmpty) {
        invalidChanges.addError(prevEvent.id, 'actualHours', "Actual hours can't be empty!")
        isValid = false
      } else {
        validChanges.removeError(prevEvent.id, 'actualHours')
      }

      setErrorForPrevEvent(prevEvent)
    })(row)

    return isValid
  }

  validateActualHours(change) {
    const { id } = change
    const row = this._getRow(id)

    this.validateEmptyActualHoursIfNextFilled(row)

    this.validatePrevActualHoursIfCurrentFilled(row)

    if (!this.validateTftHours(id)) {
      this.invalidChanges.addError(id, 'actualHours', 'NPT and WOW combined cannot be greater than Actual')
    }
  }
}

export default Validator
