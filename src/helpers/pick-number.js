import isNumber from 'lodash/isNumber'
import isNaN from 'lodash/isNaN'

export default function pickNumber(...args) {
    return args.find(n => isNumber(n) && !isNaN(n));
};
