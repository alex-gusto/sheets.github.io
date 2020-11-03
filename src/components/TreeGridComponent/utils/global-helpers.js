export default {
    isEmpty: v => v === '',
    isNotEmpty: v => v !== '',
    isNumber: v => typeof v === 'number' && !isNaN(v)
}
