export default days => {
  const toComment = { Pos: 'To', Spanned: 1 }
  const fromComment = { Pos: 'From', Spanned: 1 }
  
  days.forEach(day => {
    const colName = `${day}_in`
    
    Object.assign(toComment, {
      [`${colName}Span`]: 3
    })
  
    Object.assign(fromComment, {
      [`${colName}Span`]: 3
    })
  })
  
  return [toComment, fromComment]
}
