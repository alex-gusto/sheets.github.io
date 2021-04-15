import dataService from '../../db/dataService'
import createColNames from './create-col-name'

export default () => {
  const events = dataService.getOnlyEventsAux()
  const mainHeader = {
    id: 'Header',
    Spanned: 1
  }
  
  const upHeader = {
    Kind: 'Header'
  }
  
  events.forEach((event, i) => {
    const colName = createColNames.startColName(event)
    Object.assign(mainHeader, {
      [colName]: event.name,
      [`${colName}Span`]: 2
    })
    
    Object.assign(upHeader, {
      [createColNames.startColName(event)]: 'Start',
      [createColNames.endColName(event)]: 'End'
    })
  })
  
  return [mainHeader, upHeader]
}
