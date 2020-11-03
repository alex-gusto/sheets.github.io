// days.2020-02-01/1 => day_2020-02-01__1
// populatedDays.2020-02-01/1 => populatedDay_2020-02-01__1
export default (key, replaceFrom = '', replaceTo = '') => key
    .replace(replaceFrom, replaceTo)
    .replace(/\//g, '__')
    .replace(/\./g, '_')
