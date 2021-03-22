import { COLS } from './constants'

export default (days) => {
  return days.map(day => {
    return COLS.map(col => ({
      Name: `${day}_${col}`,
      Width: 80
    }))
  }).flat()
}
