import random from 'lodash/random';
import { loremIpsum } from 'lorem-ipsum'
import { COLS } from './constants'

export default (days) => {
  const daysHeader = {
    Kind: 'Header',
    Spanned: 1,
    
    name: 'Name',
    nameAlign: 'Center'
  }
  
  const companiesHeader = {
    Kind: 'Header'
  }
  
  const commentRow = {
    Def: 'Comment',
    Spanned: 1,
    name: 'Comments',
    nameAlign: 'Center',
    nameVertAlign: 'middle',
    nameRowSpan: 10
  }
  
  days.forEach(day => {
    const colName = `${day}_in`
    
    Object.assign(daysHeader, {
      [colName]: day.replaceAll('_', '-'),
      [`${colName}Span`]: 3,
      [`${colName}Align`]: 'Center'
    })
    
    COLS.forEach(col => Object.assign(companiesHeader, {
      [`${day}_${col}`]: col.toUpperCase(),
      [`${day}_${col}Align`]: 'Center'
    }))
    
    Object.assign(commentRow, {
      [`${colName}Span`]: 3
    })
  })
  
  const comments = Array.from({ length: 10 }).map(() => ({ ...commentRow }))
  
  days.forEach(day => {
    const rowIndex = random(0, 9)
    const row = comments[rowIndex]
    
    row[`${day}_in`] = 'hello1 hello2 hello3 hello4 hello5 hello6 hello7 hello8 hello9 hello10 hello11 hello12'
  })
  console.log(comments)
  return [{ ...daysHeader, id: 'Header' }, ...comments, daysHeader, companiesHeader]
}
