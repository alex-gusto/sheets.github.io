// days_2020-02-01__1 => days.2020-02-01/1
// populatedDays_2020-02-01__1 => populatedDays.2020-02-01/1
export default (key, replaceFrom = '', replaceTo = '') => key
    .replace(replaceFrom, replaceTo)
    .replace(/__/g, '/')
    .replace(/_/g, '.')
