import React, { Component } from 'react'
import deepClone from '../../helpers/deep-clone'
import TimeTrackerGrid from './TimeTrackerGrid'
import dataService from '../../db/dataService'
import TreeGridGantt from '../TreeGridGantt'

const { TGSetEvent } = window

const convertValue = value => {
  if (value === '') return value
  
  if (value === '0') return 0
  
  return +value || value
}

const keysMap = {
  start: ['Start', (v) => v],
  hours: ['Duration', (v) => v * 60 * 60 * 1000],
  name: ['Text', (v) => v]
}

class TimeTracker extends Component {
  constructor(props) {
    super(props)
    
    this.state = {
      DerrickType: 1,
      Phases: this.prepareState(dataService.data.Phases),
      PhasesAux: this.prepareState(dataService.data.PhasesAux),
      OperationStartDate: dataService.getStartTime()
    }
    
    TGSetEvent('OnSave', 'TimeTrackerAux', (grid) => {
      const { Changes } = JSON.parse(grid.GetChanges())
      const ganttGrid = window.Grids.GANTT
      const row = ganttGrid.GetRowById('TimeTrackerAux')
      
      Changes.forEach(change => {
        const box = ganttGrid.GetGanttRunBox(row, 'G', change.id)
        
        Object.entries(change).forEach(([key, value]) => {
          const mapper = keysMap[key]
          if (!mapper) return
          const [boxKey, fn] = mapper
          
          box[boxKey] = fn(value)
        })
        box.End = null
        console.log(ganttGrid.SetGanttRunBox(box, 'Resize'))
      })
    })
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
        <TreeGridGantt/>
        
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
