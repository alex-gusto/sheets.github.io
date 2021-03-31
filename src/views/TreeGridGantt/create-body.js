import dataService from '../../db/dataService'
import moment from 'moment'

const CLASSES = ['Aqua', 'Blue', 'Fuchsia', 'Gray', 'Green', 'Lime', 'Maroon', 'Navy', 'Olive', 'Orange', 'Purple', 'Red', 'Silver', 'Teal', 'White', 'Yellow']

export default () => {
  const start = dataService.getStartTime()
  
  const collectEvents = (arr, settings = { Type: 'box' }) => {
    let prevEvent = null
    
    const collector = (acc, item) => {
      if (item.Items) {
        item.Items.reduce((acc, item) => collector(acc, item), acc)
      } else {
        const event = {
          Text: item.name,
          Id: item.id,
          Class: CLASSES[acc.length],
          ...settings
        }
        event.start = item.start ? item.start : prevEvent ? prevEvent.end : start
        event.end = event.start + (item.hours * 60 * 60 * 1000)
        event.Start = moment(event.start).format('MM/DD/YYYY HH:mm:ss')
        event.End = moment(event.end).format('MM/DD/YYYY HH:mm:ss')
        
        prevEvent = event
        acc.push(event)
      }
      
      return acc
    }
    
    return arr.reduce(collector, [])
  }
  
  
  const eventsMain = collectEvents(dataService.getPhases(), { Type: 'Fixed' })
  const eventsAux = collectEvents(dataService.getPhasesAux())
  console.log(eventsMain, eventsAux)
  return [
    {
      id: '64029a29010',
      name: 'Main',
      CanEdit: 0,
      Tip: 'Phase 1',
      events: eventsMain
    },
    {
      id: '63029a29010',
      name: 'Aux',
      Tip: 'Phase 1',
      events: eventsAux
    }
  ]
}
