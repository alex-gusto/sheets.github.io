import dataService from '../../db/dataService'

const CLASSES = ['Aqua', 'Blue', 'Fuchsia', 'Gray', 'Green', 'Lime', 'Maroon', 'Navy', 'Olive', 'Orange', 'Purple', 'Red', 'Silver', 'Teal', 'White', 'Yellow']

const WELL_LEVEL = 0
const PHASE_LEVEL = 1
const EVENT_LEVEL = 2

const create = (deepArr, settings = {}) => {
  let prevEvent = null
  const collector = (item, level = 0) => {
    const newItem = {
      id: item.id,
      name: item.name,
      Class: CLASSES[level],
      ...settings
    }
    
    if (item.Items) {
      newItem.Def = level ? 'Phase' : 'Well'
      newItem.Items = item.Items.map(item => collector(item, ++level))
    } else {
      newItem.start = item.start
      newItem.end = item.end
      if (prevEvent) {
        prevEvent.descendants = newItem.id
      }
      newItem.ancestors = prevEvent?.id
      prevEvent = newItem
    }
    
    return newItem
  }
  
  
  return deepArr.map(item => collector(item))
}

export default () => {
  return create(dataService.getPhases())
}
