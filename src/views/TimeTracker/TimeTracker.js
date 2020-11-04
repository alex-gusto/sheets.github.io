import React, { Component } from 'react'
import TreeGridComponent from '../../components/TreeGridComponent'
import deepClone from '../../helpers/deep-clone'
import TimeTrackerGrid from './TimeTrackerGrid'
import migrateData from './migrate-data'
import dataService from '../../db/dataService'

const version = 'phases-v2'

const { Grids } = window

class TimeTracker extends Component {
    model = {
        attrs: {},
        set(key, v) {
            this.attrs[key] = v
            this.save()
        },
        get(key) {
            return this.attrs[key]
        },
        load(v) {
            this.attrs = v
        },
        save() {
            window.localStorage.setItem(version, this.toJSON())
        },
        toJSON() {
            return JSON.stringify(this.attrs)
        }
    }

    constructor(props) {
        super(props)

        const attrs = window.localStorage.getItem(version)
        if (attrs) {
            this.model.load(JSON.parse(attrs))
        } else {
            const [Phases, PhasesAux] = migrateData(dataService.getPhases())
            const Wells = [{
                name: 'Main well',
                Items: Phases
            }]

            const WellsAux = [{
                name: 'Aux well',
                Items: PhasesAux
            }]
            this.model.load({ Wells, WellsAux })
        }

        this.state = {
            DerrickType: this.model.get('DerrickType') || 0,
            Wells: this.prepareState('Wells'),
            WellsAux: this.prepareState('WellsAux'),
            OperationStartDate: this.getStartOperationDate()
        }
    }

    prepareState(key) {
        const wells = deepClone(this.model.get(key) || [])
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
