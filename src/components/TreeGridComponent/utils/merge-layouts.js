import mergeWith from 'lodash/mergeWith'

export default function (...args) {
    return mergeWith(
        {
            Actions: {
                OnDel: '!StartEditEmpty' // prevent delete rows on del button pressing
            },
            Lang: {
                Format: {
                    GroupSeparator: ' '
                }
            }
        },
        ...args,
        function (objValue, srcValue) {
            if (Array.isArray(objValue)) {
                return srcValue.concat(objValue)
            }
        }
    )
}
