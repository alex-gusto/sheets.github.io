import React, { Component } from 'react';
import TreeGridComponent from '../../../components/TreeGridComponent'


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

    componentDidMount() {
        const { id } = this.props
        TGAddEvent("OnValidate", id, this.onValidate);
    }

    componentWillUnmount() {
        const { id } = this.props
        TGDelEvent("OnValidate", id, this.onValidate);
    }

    createLayout() {
        const { OperationStartDate, Name, isAux, DerrickType } = this.props
        const dynamicLayout = {
            Cfg: {
                ExportName: `${Name}.time-tracker`
            }
        }

        dynamicLayout.LeftCols = createLeftColumns()

        dynamicLayout.Cols = createColumns({ isAux })

        dynamicLayout.Head = createHead()

        dynamicLayout.Foot = createFoot()

        dynamicLayout.Solid = createSolid({ OperationStartDate, isAux, DerrickType })

        dynamicLayout.Def = createRowsDef()

        return mergeLayouts(staticLayout, dynamicLayout)
    }

    onValidate = (grid, row, col) => {
        if (validator[col]) {
            return validator[col](grid, row, col)
        }

        return 0
    }

    getEventStart = (grid, row, get) => {
        const eventRow = getPrevEvent(grid, row)

        if (eventRow) {
            return get(eventRow, '_end')
        }

        return this.props.OperationStartDate
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

    render() {
        return <TreeGridComponent
            layout={this.layout}
            nestedKey={TimeTrackerGrid.nestedKey}
            getBehindHours={this.getBehindHours}
            getActualDepth={this.getActualDepth}
            getPlannedDepth={this.getPlannedDepth}
            getEventEnd={this.getEventEnd}
            getEventStart={this.getEventStart}
            getEventDuration={this.getEventDuration}
            {...this.props}
        />
    }
}

export default TimeTrackerGrid
