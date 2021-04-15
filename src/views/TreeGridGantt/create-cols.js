import dataService from '../../db/dataService'
import createColNames from './create-col-name'

export default () => {
  const cols = []
  
  // dataService.getOnlyEvents().forEach((event,i) => {
  //   cols.push({
  //       Name: createColNames.getColNameWithIndex('GanttStart', i),
  //       Format: 'yyyy-M-d H:mm',
  //       Type: 'Date',
  //       Width: 80
  //     },
  //     {
  //       Name: createColNames.getColNameWithIndex('GanttEnd', i),
  //       Format: 'yyyy-M-d H:mm',
  //       Type: 'Date',
  //       Width: 80
  //     })
  // })
  
  return cols
}
