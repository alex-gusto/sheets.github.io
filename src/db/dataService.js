import data from './data.json';
import moment from 'moment'

const STORAGE_KEY = 'data'

class DataService {
  data = this.getFromLS() || data
  
  constructor() {
    if (DataService.instance) {
      return DataService.instance
    }
    
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
    return this.data.Phases
  }
  
  getPhasesAux() {
    return this.data.PhasesAux
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
