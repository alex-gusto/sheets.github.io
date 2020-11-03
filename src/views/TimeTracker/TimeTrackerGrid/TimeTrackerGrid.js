import React, { Component } from 'react';
import TreeGridComponent from '../../../components/TreeGridComponent'
import deepClone from '../../../helpers/deep-clone'

// Layout
import mergeLayouts from '../../../components/TreeGridComponent/utils/merge-layouts'
import staticLayout from '../static-layout'
import createColumns from '../create-columns'
import createLeftColumns from '../create-left-columns'
import createHead from '../create-head'
import createFoot from '../create-foot'
import createSolid from '../create-solid'
import createRowsDef from '../create-rows-def'

// Utils
import getNextEvent from './utils/get-next-event'
import getPrevEvent from './utils/get-prev-event'
import pickNumber from '../../../helpers/pick-number'
import isUndefined from 'lodash/isUndefined'

const { TGAddEvent, TGDelEvent } = window

// TODO: need revision
const validator = {
    actualHours(grid, row, col) {
        if (row.Def.Name !== 'Event') return

        const nextEvent = getNextEvent(grid, row)
        if (!nextEvent) return 0

        const nextNotEmpty = grid.Helpers.isNotEmpty(nextEvent[col])
        const currentEmpty = grid.Helpers.isEmpty(row[col])

        if (nextNotEmpty && currentEmpty) {
            return 1
        }

        return 0
    },
    _tftHours(grid, row, col) {
        if (row[col] < 0) {
            return 1
        }

        return 0
    }
}

class TimeTrackerGrid extends Component {
    static nestedKey = 'Items'
    layout = this.createLayout()

    state = {
        body: this.prepareBody()
    }

    componentDidMount() {
        TGAddEvent("OnValidate", "TimeTracker", this.onValidate);
    }

    componentWillUnmount() {
        TGDelEvent("OnValidate", "TimeTracker", this.onValidate);
    }

    createLayout() {
        const { model } = this.props
        const OperationStartDate = model.get('OperationStartDate')
        const dynamicLayout = {
            Cfg: {
                ExportName: `${model.get('Name')}.time-tracker`
            }
        }

        dynamicLayout.LeftCols = createLeftColumns()

        dynamicLayout.Cols = createColumns()

        dynamicLayout.Head = createHead()

        dynamicLayout.Foot = createFoot()

        dynamicLayout.Solid = createSolid({ OperationStartDate })

        dynamicLayout.Def = createRowsDef()

        return mergeLayouts(staticLayout, dynamicLayout)
    }

    getStartOperationDate() {
        const startDate = this.props.model.get('OperationStartDate')

        return +new Date(startDate) || +new Date()
    }

    prepareBody() {
        const { model } = this.props
        const wells = deepClone(model.get('Wells') || [])
        const defs = ['Well', 'Phase', 'Event']

        function addRowDefinitions(row, level = 0) {
            row.Def = defs[level]

            if (row.Items) {
                row.Items.forEach(row => addRowDefinitions(row, level + 1))
            }
        }

        wells.forEach(row => addRowDefinitions(row, 0))
        console.log(wells)
        return wells
    }

    onValidate = (grid, row, col, err, errors) => {
        if (validator[col]) {
            return validator[col](grid, row, col)
        }

        return 0
    }

    onDataChanged = (newData) => {
        this.setState(
            { body: newData },
            () => {
                this.props.model.set('Wells', newData)
            }
        )
    }

    getEventStart = (grid, row, get) => {
        const eventRow = getPrevEvent(grid, row)

        if (eventRow) {
            return get(eventRow, '_end')
        }

        return this.getStartOperationDate()
    }

    getEventEnd = (start, duration) => {
        if (start && typeof duration === 'number') {
            return start + duration
        }

        return ''
    }

    getEventDuration = (...args) => {
        const hours = pickNumber(...args)

        if (isUndefined(hours)) return ''

        return 60 * 60 * 1000 * hours // to milliseconds
    }

    getPlannedDepth = (grid, row, get, plannedDepth) => {
        if (grid.Helpers.isNotEmpty(plannedDepth)) return plannedDepth

        const eventRow = getPrevEvent(grid, row)
        if (eventRow) {
            return get(eventRow, '_plannedDepth')
        }

        return 0
    }

    getActualDepth = (grid, row, get, actualDepth) => {
        if (grid.Helpers.isNotEmpty(actualDepth)) return actualDepth

        if (!this.hasActual(grid, row)) return ''

        const eventRow = getPrevEvent(grid, row)
        if (eventRow) {
            return get(eventRow, '_actualDepth')
        }

        return 0
    }

    getBehindHours = (grid, row, get, delta) => {
        if (!this.hasActual(grid, row)) return ''

        const eventRow = getPrevEvent(grid, row)
        const prevDelta = eventRow ? get(eventRow, 'behindHours') : 0

        return prevDelta + delta
    }

    hasActual = (grid, row) => {
        return grid.Helpers.isNotEmpty(row.actualHours)
    }

    handleOperationStartDateChange = (grid, value) => {
        this.props.model.set('OperationStartDate', value)
    }

    render() {
        return <div className="time-grid-view">
            <TreeGridComponent
                layout={this.layout}
                body={this.state.body}
                nestedKey={TimeTrackerGrid.nestedKey}
                onDataChanged={this.onDataChanged}
                getBehindHours={this.getBehindHours}
                getActualDepth={this.getActualDepth}
                getPlannedDepth={this.getPlannedDepth}
                getEventEnd={this.getEventEnd}
                getEventStart={this.getEventStart}
                getEventDuration={this.getEventDuration}
                handleOperationStartDateChange={this.handleOperationStartDateChange}
                {...this.props}
            />
        </div>
    }
}

export default TimeTrackerGrid
