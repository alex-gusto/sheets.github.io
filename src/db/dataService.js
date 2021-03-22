import data from './data.json';
import moment from 'moment'

class DataService {
  data = data;
  days = this.getDays()
  
  constructor() {
    if (DataService.instance) {
      return DataService.instance
    }
    
    DataService.instance = this
  }
  
  getStartTime() {
    return this.data.OperationStartDate
  }
  
  getPhases() {
    return this.data.Phases
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
