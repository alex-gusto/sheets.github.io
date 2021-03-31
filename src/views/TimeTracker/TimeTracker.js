import React, { Component } from 'react'
import deepClone from '../../helpers/deep-clone'
import TimeTrackerGrid from './TimeTrackerGrid'
import dataService from '../../db/dataService'

class TimeTracker extends Component {
  constructor(props) {
    super(props)
    
    this.state = {
      DerrickType: 1,
      Phases: this.prepareState(dataService.getPhases()),
      PhasesAux: this.prepareState(dataService.getPhasesAux()),
      OperationStartDate: dataService.getStartTime()
    }
  }
  
  prepareState(data) {
    const wells = deepClone(data)
    const defs = ['Well', 'Phase', 'Event']
    const reCalc = [3, 3, 256]
    
    function addRowDefinitions(row, level = 0) {
      row.Def = defs[level]
      row.Recalc = reCalc[level]
      
      if (row.Items) {
        row.Items.forEach(row => addRowDefinitions(row, level + 1))
      }
    }
    
    wells.forEach(row => addRowDefinitions(row, 0))
    return wells
  }
  
  onDataChanged = (newData, key) => {
    this.setState(
      { [key]: newData },
      () => {
        dataService.save(key, newData)
      }
    )
  }
  
  handleOperationStartDateChange = (grid, value) => {
    this.setState({ OperationStartDate: value })
  }
  
  handleDerrickTypeChange = (grid, value) => {
    this.setState({ DerrickType: value })
  }
  
  render() {
    const { DerrickType, Phases, PhasesAux, OperationStartDate } = this.state
    
    return (
      <div className="time-grid-view">
        <div id="timeGridTopBar" className="time-grid-view__top-bar"/>
        
        <div className="time-grid-view__grids">
          <TimeTrackerGrid
            id="TimeTrackerMain"
            body={Phases}
            DerrickType={DerrickType}
            OperationStartDate={OperationStartDate}
            handleDerrickTypeChange={this.handleDerrickTypeChange}
            handleOperationStartDateChange={this.handleOperationStartDateChange}
            onDataChanged={(data) => this.onDataChanged(data, 'Phases')}
          />
          
          {DerrickType ? <TimeTrackerGrid
            id="TimeTrackerAux"
            isAux={true}
            body={PhasesAux}
            DerrickType={DerrickType}
            OperationStartDate={OperationStartDate}
            onDataChanged={(data) => this.onDataChanged(data, 'PhasesAux')}
          /> : ''}
        </div>
      
      
      </div>
    )
  }
}

export default TimeTracker
