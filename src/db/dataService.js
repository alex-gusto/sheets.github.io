import data from './data.json';
import moment from 'moment'

const STORAGE_KEY = 'data'

function calculatePhases(phases, start) {
  let prevItem = null
  
  const calculate = (item, parent) => {
    const newItem = {
      name: item.name,
      id: item.id,
      hours: item.hours
    }
    
    if (item.Items) {
      newItem.Items = item.Items.map(k => calculate(k, newItem))
    } else {
      newItem.start = item.start ? item.start : prevItem ? prevItem.end : start
      newItem.end = newItem.start + (item.hours * 60 * 60 * 1000)
      prevItem = newItem
    }
    
    if (!parent) return newItem
    
    if (!parent.start) {
      parent.start = newItem.start
    }
    parent.end = newItem.end || parent.end
    
    return newItem
  }
  
  return phases.map(item => calculate(item))
}


const collectItemsOnLevel = (deepArr, level = 0) => {
  const collector = (acc, item, _level) => {
    if (level === _level) {
      acc.push(item)
      
      return acc
    }
    
    if (_level < level && item.Items) {
      item.Items.forEach(it => collector(acc, it, _level + 1))
    }
    
    return acc
  }
  
  
  return deepArr.reduce((acc, item) => collector(acc, item, 0), [])
}

class DataService {
  static WELL_LEVEL = 0
  static PHASE_LEVEL = 1
  static EVENT_LEVEL = 2
  
  data = this.getFromLS() || data
  
  constructor() {
    if (DataService.instance) {
      return DataService.instance
    }
    
    window.DataService = this
    
    DataService.instance = this
  }
  
  save(key, data) {
    if (!key) {
      throw new Error('No key at save method')
    }
    
    this.data[key] = data
    
    this.saveToLS()
  }
  
  saveToLS() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data))
  }
  
  getFromLS() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY))
    } catch (e) {
      return null
    }
  }
  
  getStartTime() {
    return this.data.OperationStartDate
  }
  
  getPhases() {
    return calculatePhases(this.data.Phases, this.getStartTime())
  }
  
  getPhasesAux() {
    return calculatePhases(this.data.PhasesAux, this.getStartTime())
  }
  
  getOnlyPhases() {
    return collectItemsOnLevel(this.getPhases(), DataService.PHASE_LEVEL)
  }
  
  getOnlyEvents() {
    return collectItemsOnLevel(this.getPhases(), DataService.EVENT_LEVEL)
  }
  
  getOnlyEventsAux() {
    return collectItemsOnLevel(this.getPhasesAux(), DataService.EVENT_LEVEL)
  }
  
  getCompanies() {
    return this.data.Companies
  }
  
  getCosts() {
    return this.data.Costs
  }
  
  getDays() {
    const sum = (arr) => arr.reduce((s, item) => {
      if (item.Items) {
        return s + sum(item.Items)
      }
      
      return s + (item.hours || 0)
    }, 0)
    
    let totalDuration = sum(this.data.Phases)
    const start = this.getStartTime()
    const days = []
    
    while (totalDuration > 0) {
      const date = moment(start + totalDuration * 60 * 60 * 1000)
      days.push(date.format('YYYY_MM_DD'))
      totalDuration -= 24
    }
    
    return days
  }
}

export default new DataService()
