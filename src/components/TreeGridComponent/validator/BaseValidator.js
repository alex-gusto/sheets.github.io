import ChangesHolder from './ChangesHolder'

class BaseValidator {
  validChanges = null

  invalidChanges = null

  rules = {}

  constructor(grid) {
    if (!grid) {
      throw new Error('TreeGrid validator: Set related grid!')
    }

    this.grid = grid
  }

  _getRow(id) {
    return this.grid.GetRowById(id)
  }

  forEachRule(fn) {
    Object.entries(this.rules).forEach(([rule, cb]) => fn(rule, cb))
  }

  validate(changes) {
    this.validChanges = new ChangesHolder()
    this.invalidChanges = new ChangesHolder()

    changes.forEach(change => {
      this.forEachRule((key, fn) => {
        if (key in change) {
          fn.call(this, change)
        }
      })
    })

    return [this.validChanges.getChanges(), this.invalidChanges.getChanges()]
  }
}

export default BaseValidator
