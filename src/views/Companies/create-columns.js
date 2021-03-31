import { COLS } from './constants'

export default (days) => {
  
  return [
    {
      Name: 'prior'
    },
    ...days.map(day => COLS.map(col => ({ Name: `${day}_${col}`, Width: 60 }))).flat()
  ]
}
