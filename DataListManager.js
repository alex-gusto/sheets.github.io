// importScripts('https://cdn.jsdelivr.net/combine/npm/lodash@4.17.20/set.min.js,npm/lodash@4.17.20/merge.min.js')
// import deConvertKey from './utils/deconvert-key'
// symbol vars for ignoring JSON.stringify

const _parent = Symbol('_parent')
const _indexWithinParent = Symbol('_indexWithinParent')

class DataListManager {
    #list
    #data
    #nestedKey = ''

    constructor(data, nestedKey) {
        this.#nestedKey = nestedKey

        function flatArrById(arr, list = new Map(), parent = null) {
            let i = 0
            while (i < arr.length) {
                const item = arr[i++]

                item[_parent] = parent
                item[_indexWithinParent] = i - 1
                list.set(item.id, item)

                if (nestedKey && item[nestedKey] && item[nestedKey].length > 0) {
                    flatArrById(item[nestedKey], list, item)
                }
            }

            return list
        }

        this.#data = data
        this.#list = flatArrById(data)
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
        return next ? next[_indexWithinParent] : prev ? prev[_indexWithinParent] + 1 : 0
    }

    /**
     * Returns parent's array for child item
     * @param parent
     * @returns {Array}
     * @private
     */
    _getParentArr(parent) {
        if (parent) {
            parent[this.#nestedKey] = parent[this.#nestedKey] || []
            return parent[this.#nestedKey]
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
            item[_indexWithinParent] = i - 1
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
            console.log('No item found: ', id)
            return
        }

        const item = this.getItem(id)
        const parent = item[_parent]
        const index = item[_indexWithinParent]

        // remove item from list
        if (isTotally) this.#list.delete(id)

        const arr = this._getParentArr(parent)

        arr.splice(index, 1)
        this._updateIndexWithinParent(arr)
    }

    addItem(id, parentId, nextId, prevId, item) {
        if (this.hasItem(id)) {
            return this.moveItem(id, parentId, nextId, prevId)
        }

        const parent = this.getItem(parentId)
        const index = this._getFutureIndex(nextId, prevId)
        const convertedItem = this.convertItemKeys(item)
        // update list
        this.#list.set(id, convertedItem)

        // set parent
        convertedItem[_parent] = parent

        this._setChildToParent(parent, index, convertedItem)
    }

    moveItem(id, parentId, nextId, prevId) {
        const item = this.getItem(id)
        const parent = this.getItem(parentId)
        const index = this._getFutureIndex(nextId, prevId)

        // remove item from old parent
        this.removeItem(id, false)

        // change parent
        item[_parent] = parent

        this._setChildToParent(parent, index, item)
    }

    updateItem(id, data) {
        const item = this.getItem(id)
        const convertedData = this.convertItemKeys(data)
        Object.assign(item, convertedData)
    }

    convertItemKeys(item) {
        // TODO: change after model structure concern
        return Object.entries(item).reduce((acc, [key, value]) => {
            if (/^_|^[A-Z]_/.test(key)) return acc // ignore temp key holders. _key, A_key, B_key

            value = +value || value // TODO: replace to TReeGrid config. convert to number.
            // key = deConvertKey(key)

            acc[key] = value
            return acc
        }, {})
    }
}
