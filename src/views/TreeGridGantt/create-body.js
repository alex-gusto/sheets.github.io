import dataService from '../../db/dataService'
import moment from 'moment'

const CLASSES = ['Aqua', 'Blue', 'Fuchsia', 'Gray', 'Green', 'Lime', 'Maroon', 'Navy', 'Olive', 'Orange', 'Purple', 'Red', 'Silver', 'Teal', 'White', 'Yellow']

const WELL_LEVEL = 0
const PHASE_LEVEL = 1
const EVENT_LEVEL = 2

const collectItemsOnLevel = (deepArr, level = WELL_LEVEL, settings = {}) => {
  const collector = (acc, item, _level) => {
    const event = {
      Text: item.name,
      Id: item.id,
      Class: CLASSES[acc.length],
      Start: moment(item.start).format('MM/DD/YYYY HH:mm:ss'),
      End: moment(item.end).format('MM/DD/YYYY HH:mm:ss'),
      ...settings
    }
    
    if (level === _level) {
      acc.push(event)
      
      return acc
    }
    
    if (_level < level && item.Items) {
      item.Items.forEach(it => collector(acc, it, _level + 1))
    }
    
    return acc
  }
  
  
  return deepArr.reduce((acc, item) => collector(acc, item, 0), [])
}

export default () => {
  const phasesMain = collectItemsOnLevel(dataService.getPhases(), PHASE_LEVEL, { Type: 'Fixed' })
  const eventsMain = collectItemsOnLevel(dataService.getPhases(), EVENT_LEVEL, { Type: 'Fixed' })
  const phasesAux = collectItemsOnLevel(dataService.getPhasesAux(), PHASE_LEVEL)
  const eventsAux = collectItemsOnLevel(dataService.getPhasesAux(), EVENT_LEVEL)
  console.log(phasesMain)
  return [
    {
      id: '64029a29010',
      name: 'Main phases',
      CanEdit: 0,
      events: phasesMain
    },
    {
      id: '24029a29010',
      name: 'Main events',
      CanEdit: 0,
      events: eventsMain
    },
    {
      id: '61029a29010',
      name: 'Aux phases',
      CanEdit: 0,
      events: phasesAux
    },
    {
      id: '63029a29010',
      name: 'Aux events',
      events: eventsAux
    }
  ]
}
