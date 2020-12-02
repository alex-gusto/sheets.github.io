import React, { Component } from 'react'
import deepClone from '../../helpers/deep-clone'
import TimeTrackerGrid from './TimeTrackerGrid'
import dataService from '../../db/dataService'

const version = 'phases-v2'

const { Grids } = window

class TimeTracker extends Component {
    constructor(props) {
        super(props)

        this.state = {
            DerrickType: 0,
            Wells: this.prepareState(dataService.getPhases()),
            OperationStartDate: this.getStartOperationDate()
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

    getStartOperationDate() {
        const startDate = this.model.get('OperationStartDate')

        return +new Date(startDate) || +new Date()
    }

    onDataChanged = (newData, key) => {
        console.log(key)
        this.setState(
            { body: newData },
            () => {
                this.model.set(key, newData)
            }
        )
    }

    handleOperationStartDateChange = (grid, value) => {
        this.setState(
            {
                OperationStartDate: value
            },
            () => {
                const auxGrid = Grids.TimeTrackerAux
                if (auxGrid) {
                    const row = auxGrid.GetRowById('topBarAux')
                    auxGrid.SetValue(row, 'OperationStartDate', value, 1)
                }

                this.model.set('OperationStartDate', value)
            }
        )
    }

    handleDerrickTypeChange = (grid, value) => {
        this.setState(
            {
                DerrickType: value
            },
            () => {
                this.model.set('DerrickType', value)
            }
        )
    }

    render() {
        const { DerrickType, Wells, WellsAux, OperationStartDate } = this.state

        return (
            <div className="time-grid-view">
                <div id="timeGridTopBar" className="time-grid-view__top-bar"/>

                <div className="time-grid-view__grids">
                    <div className="time-grid-view__col">
                        <TimeTrackerGrid
                            id="TimeTrackerMain"
                            body={Wells}
                            DerrickType={DerrickType}
                            OperationStartDate={OperationStartDate}
                            handleDerrickTypeChange={this.handleDerrickTypeChange}
                            handleOperationStartDateChange={this.handleOperationStartDateChange}
                            onDataChanged={(data) => this.onDataChanged(data, 'Wells')}
                        />
                    </div>

                    {DerrickType ? <div className="time-grid-view__col">
                        <TimeTrackerGrid
                            id="TimeTrackerAux"
                            isAux={true}
                            body={WellsAux}
                            DerrickType={DerrickType}
                            OperationStartDate={OperationStartDate}
                            onDataChanged={(data) => this.onDataChanged(data, 'WellsAux')}
                        />
                    </div> : ''}
                </div>


            </div>
        )
    }
}

export default TimeTracker
