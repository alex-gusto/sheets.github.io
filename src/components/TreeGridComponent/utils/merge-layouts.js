import mergeWith from 'lodash/mergeWith'
import defaultLayout from '../config/default-layout'

export default function (...args) {
    return mergeWith(
        {},
        defaultLayout,
        ...args,
        function (objValue, srcValue) {
            if (Array.isArray(objValue)) {
                return srcValue.concat(objValue)
            }
        }
    )
}
