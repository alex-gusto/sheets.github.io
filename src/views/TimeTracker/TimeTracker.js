import React, { Component } from 'react'
import deepClone from '../../helpers/deep-clone'
import TimeTrackerGrid from './TimeTrackerGrid'
import dataService from '../../db/dataService'

class TimeTracker extends Component {
    constructor(props) {
        super(props)
        let data = window.localStorage.getItem('phases')
        data = data ? JSON.parse(data) : dataService.getPhases()

        this.state = {
            DerrickType: 0,
            Wells: this.prepareState(data),
            OperationStartDate: +new Date()
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

    onDataChanged = (newData) => {
        this.setState(
            { Wells: newData },
            () => {
                // window.localStorage.setItem('phases', JSON.stringify(newData))
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
        const { DerrickType, Wells, WellsAux, OperationStartDate } = this.state

        return (
            <div className="time-grid-view">
                <div id="timeGridTopBar" className="time-grid-view__top-bar"/>

                <div className="time-grid-view__grids">
                    <TimeTrackerGrid
                        id="TimeTrackerMain"
                        body={Wells}
                        DerrickType={DerrickType}
                        OperationStartDate={OperationStartDate}
                        handleDerrickTypeChange={this.handleDerrickTypeChange}
                        handleOperationStartDateChange={this.handleOperationStartDateChange}
                        onDataChanged={(data) => this.onDataChanged(data, 'Wells')}
                    />

                    {DerrickType ? <TimeTrackerGrid
                        id="TimeTrackerAux"
                        isAux={true}
                        body={WellsAux}
                        DerrickType={DerrickType}
                        OperationStartDate={OperationStartDate}
                        onDataChanged={(data) => this.onDataChanged(data, 'WellsAux')}
                    /> : ''}
                </div>


            </div>
        )
    }
}

export default TimeTracker
