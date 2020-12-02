class ChangesHolder {
  _changes = {}

  static getErrorKey(key) {
    return `${key}Error`
  }

  static getMessages(change, key) {
    return change[ChangesHolder.getErrorKey(key)] || []
  }

  getChange(id) {
    const row = this._changes[id]
    if (!row) {
      this._changes[id] = { id }
    }

    return this._changes[id]
  }

  addError(id, key, message) {
    const change = this.getChange(id)

    const messages = ChangesHolder.getMessages(change, key)
    messages.push(message)

    change[ChangesHolder.getErrorKey(key)] = messages
  }

  removeError(id, key) {
    this.addError(id, key, '')
  }

  getChanges() {
    return Object.values(this._changes).reduce((acc, errors) => {
      const change = {}

      Object.entries(errors).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          change[key] = value.find(m => m) || ''
        } else {
          change[key] = value
        }
      })

      return [...acc, change]
    }, [])
  }
}

export default ChangesHolder
