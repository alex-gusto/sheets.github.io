import dataService from '../../db/dataService'
import createColNames from './create-col-name'
import moment from 'moment'

const CLASSES = ['Aqua', 'Blue', 'Fuchsia', 'Gray', 'Green', 'Lime', 'Maroon', 'Navy', 'Olive', 'Orange', 'Purple', 'Red', 'Silver', 'Teal', 'White', 'Yellow']

const createMainBars = (arr) => {
  return arr.reduce((acc, item, i) => {
    acc[createColNames.getColNameWithIndex('GanttHtml', i)] = item.name
    acc[createColNames.getColNameWithIndex('GanttClass', i)] = CLASSES[i]
    acc[createColNames.getColNameWithIndex('GanttStart', i)] = item.start
    acc[createColNames.getColNameWithIndex('GanttEnd', i)] = item.end
    
    return acc
  }, {})
}

const createRunBars = (arr) => {
  return arr.map((event, i) => {
    return {
      Id: event.id,
      Start: event.start, // moment(event.start).format('MM/DD/YYYY HH:mm:ss'),
      // End: moment(event.end).format('MM/DD/YYYY HH:mm:ss'),
      Duration: event.hours,
      Class: CLASSES[i],
      Text: event.name
    }
  })
}

export default () => {
  const mainBarEvents = createMainBars(dataService.getOnlyEvents())
  const mainBarEventsForAux = createMainBars(dataService.getOnlyEventsAux())
  const runBarEventsForAux = createRunBars(dataService.getOnlyEventsAux())
  
  console.log(runBarEventsForAux)
  return [
    // {
    //   id: '64029a29010',
    //   name: 'Main phases',
    //   CanEdit: 0,
    //   events: 'phasesMain'
    // },
    {
      id: '24029a29010',
      title: 'Main events',
      CanEdit: 0,
      ...mainBarEvents
    },
    // {
    //   id: '63029a29010',
    //   title: 'Aux events',
    //   ...mainBarEventsForAux
    // },
    // {
    //   id: '54029a29010'
    // },
    {
      id: 'TimeTrackerAux',
      title: 'Aux events',
      events: runBarEventsForAux
    }
  ]
}
