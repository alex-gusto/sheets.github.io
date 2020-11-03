import isPlainObject from 'lodash/isPlainObject'
import convertKey from './convert-key'

/**
 * Convert Object to one level paths. {test: {test:1}} => test_test: 1
 * @param item {Object}
 * @param keyAcc
 * @param acc
 * @returns {{}}
 */
export default function convertObjectToFlatKeys(item, keyAcc = '', acc = {}) {
    for (let key in item) {
        if (item.hasOwnProperty(key)) {
            let path = keyAcc ? `${keyAcc}_${convertKey(key)}` : convertKey(key)

            if (isPlainObject(item[key])) {
                convertObjectToFlatKeys(item[key], path, acc)
            } else {
                acc[path] = item[key]
            }
        }
    }

    return acc
}
