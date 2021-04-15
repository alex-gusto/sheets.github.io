import merge from 'lodash/merge'
import set from 'lodash/set'
import deepClone from '../../helpers/deep-clone'

const convertValue = value => {
  if (value === '') return value
  
  if (value === '0') return 0
  
  return +value || value
}

class DataListManager {
  // symbol vars for ignoring JSON.stringify
  static parent = Symbol('parent')
  
  static next = Symbol('next')
  
  static prev = Symbol('prev')
  
  static indexWithinParent = Symbol('indexWithinParent')
  
  #list
  
  #data
  
  nestedKey = ''
  
  constructor(data, nestedKey) {
    const dataClone = deepClone(data)
    this.nestedKey = nestedKey
    
    // TODO: fix flatting for more than one well. Now it works just for two levels
    // nextParent is defined wrong.
    function flatArrById(arr, list, parent = null, nextParent = null) {
      let i = 0
      while (i < arr.length) {
        const item = arr[i++]
        const hasChildren = nestedKey && item[nestedKey] && item[nestedKey].length > 0
        
        if (hasChildren) {
          // eslint-disable-next-line prefer-destructuring
          item[DataListManager.next] = item[nestedKey][0] // get first child
        } else {
          item[DataListManager.next] = arr[i] ? arr[i] : nextParent // get sibling item or next parent
        }
        
        item[DataListManager.parent] = parent
        item[DataListManager.prev] = arr[i - 2] ? arr[i - 2] : parent
        item[DataListManager.indexWithinParent] = i - 1
        list.set(item.id, item)
        
        if (hasChildren) {
          flatArrById(item[nestedKey], list, item, arr[i])
        }
      }
      
      return list
    }
    
    this.#data = dataClone
    this.#list = flatArrById(dataClone, new Map())
  }
  
  get data() {
    return deepClone(this.#data)
  }
  
  /**
   * Get future index for inserting item. choose between nextIndex or prevIndex
   * @param nextId - uid
   * @param prevId - uid
   * @returns {number}
   * @private
   */
  _getFutureIndex(nextId, prevId) {
    const next = this.getItem(nextId)
    const prev = this.getItem(prevId)
    
    if (next) {
      return next[DataListManager.indexWithinParent]
    }
    
    if (prev) {
      return prev[DataListManager.indexWithinParent] + 1
    }
    
    return 0
  }
  
  /**
   * Returns parent's array for child item
   * @param parent
   * @returns {Array}
   * @private
   */
  _getParentArr(parent) {
    if (parent) {
      parent[this.nestedKey] = parent[this.nestedKey] || []
      return parent[this.nestedKey]
    }
    
    return this.#data
  }
  
  /**
   * Add child to array and update their index
   * @param parent
   * @param index
   * @param item
   * @private
   */
  _setChildToParent(parent, index, item) {
    const arr = this._getParentArr(parent)
    
    arr.splice(index, 0, item)
    this._updateIndexWithinParent(arr)
  }
  
  _updateIndexWithinParent(arr) {
    let i = 0
    while (i < arr.length) {
      const item = this.#list.get(arr[i++].id)
      item[DataListManager.indexWithinParent] = i - 1
    }
  }
  
  getItem(id) {
    return this.#list.get(id)
  }
  
  hasItem(id) {
    return this.#list.has(id)
  }
  
  /**
   * Remove item from parent or from parent & list
   * @param id
   * @param isTotally{Boolean}
   */
  removeItem(id, isTotally = true) {
    if (!this.hasItem(id)) {
      return
    }
    
    const item = this.getItem(id)
    const parent = item[DataListManager.parent]
    const index = item[DataListManager.indexWithinParent]
    
    // remove item from list
    if (isTotally) this.#list.delete(id)
    
    const arr = this._getParentArr(parent)
    
    arr.splice(index, 1)
    this._updateIndexWithinParent(arr)
  }
  
  addItem(id, parentId, nextId, prevId, item) {
    if (this.hasItem(id)) {
      this.moveItem(id, parentId, nextId, prevId)
      return
    }
    
    const parent = this.getItem(parentId)
    const index = this._getFutureIndex(nextId, prevId)
    const convertedItem = DataListManager.convertItemKeys(item)
    // update list
    this.#list.set(id, convertedItem)
    
    // set parent
    convertedItem[DataListManager.parent] = parent
    
    this._setChildToParent(parent, index, convertedItem)
  }
  
  moveItem(id, parentId, nextId, prevId) {
    const item = this.getItem(id)
    const parent = this.getItem(parentId)
    const index = this._getFutureIndex(nextId, prevId)
    
    // remove item from old parent
    this.removeItem(id, false)
    
    // change parent
    item[DataListManager.parent] = parent
    
    this._setChildToParent(parent, index, item)
  }
  
  updateItem(id, data) {
    if (!this.hasItem(id)) {
      return
    }
    
    const item = this.getItem(id)
    const convertedData = DataListManager.convertItemKeys(data)
    merge(item, convertedData)
  }
  
  static convertItemKeys(item) {
    // TODO: change after model structure concern
    return Object.entries(item).reduce((acc, [key, value]) => {
      if (/^_|^f_|^[A-Z]_|Click|Error/.test(key) && !/Span$/.test(key)) return acc // ignore temp keys
      
      value = convertValue(value) // TODO: replace to TReeGrid config. convert to number.
      
      set(acc, key, value)
      return acc
    }, {})
  }
}

export { DataListManager, DataListManager as default }
