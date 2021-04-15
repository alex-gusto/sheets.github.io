import dataService from '../../db/dataService'
import { GANTT_COL_NAME } from './create-col-name'

export default (start) => {
  const ganttCol = {
    Name: GANTT_COL_NAME,
    Type: 'Gantt',
    GanttZoom: 'days',
    GanttDataUnits: 'h',
    
    // Main settings
    GanttCount: 10,
    
    // Run settings
    GanttRunSave: 2,
    GanttRun: 'events',
    GanttRunAdjust: 'Shrink'
  }
  
  return [
    ganttCol
  ]
}
