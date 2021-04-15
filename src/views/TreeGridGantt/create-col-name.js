const createColName = (id, prefix = '') => `${prefix}_${id}`

export const GANTT_COL_NAME = 'G'

export default {
  nameColName: (item) => createColName(item.id, 'name'),
  startColName: (item) => createColName(item.id, 'start'),
  endColName: (item) => createColName(item.id, 'end'),
  getColNameWithIndex: (col, index) => `${GANTT_COL_NAME}${col}${index || ''}`
}
