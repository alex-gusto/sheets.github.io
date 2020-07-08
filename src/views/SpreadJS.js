import React, { Component, createRef, Fragment } from 'react';
import dataService from '../db/dataService'
import performance from '../helpers/perfomance'
import createFlatter from '../helpers/flat-data'
import '@grapecity/spread-sheets/styles/gc.spread.sheets.excel2013white.css';
import GC from '@grapecity/spread-sheets/dist/gc.spread.sheets.all.min';

function columnToLetter(column) {
    let temp, letter = '';
    while (column > 0) {
        temp = (column - 1) % 26;
        letter = String.fromCharCode(temp + 65) + letter;
        column = (column - temp - 1) / 26;
    }
    return letter;
}

export default class SpreadJS extends Component {
    constructor(props) {
        super(props)

        this.tableRef = createRef()
        this.state = {
            time: 0
        }
    }

    componentDidMount() {
        setTimeout(() => {
            const time = performance(this.initSpread)
            this.setState({ time })
        })
    }

    initSpread = () => {
        const spread = new GC.Spread.Sheets.Workbook(this.tableRef.current, { sheetCount: 1 });
        spread.options.tabStripVisible = false
        spread.options.tabNavigationVisible = false
        spread.options.tabEditable = true
        spread.options.newTabVisible = false
        const sheet = spread.getActiveSheet()
        const spreadNS = GC.Spread.Sheets;

        sheet.suspendPaint()
        const flatData = createFlatter()
        const { data, groups } = flatData(dataService.getPhases())

        sheet.options.isProtected = true
        sheet.autoGenerateColumns = false
        sheet.setDataSource(data)

        sheet.setRowCount(2, spreadNS.SheetArea.colHeader);

        sheet.addSpan(0, 0, 1, 2, spreadNS.SheetArea.colHeader);
        sheet.setValue(0, 0, "Identification", spreadNS.SheetArea.colHeader);

        sheet.addSpan(0, 2, 1, 6, spreadNS.SheetArea.colHeader);
        sheet.setValue(0, 2, "Duration", spreadNS.SheetArea.colHeader);

        sheet.addSpan(0, 8, 1, 2, spreadNS.SheetArea.colHeader);
        sheet.setValue(0, 8, "End Depth", spreadNS.SheetArea.colHeader);

        sheet.addSpan(0, 10, 1, 3, spreadNS.SheetArea.colHeader);
        sheet.setValue(0, 10, "Timing", spreadNS.SheetArea.colHeader);

        sheet.addSpan(0, 13, 1, 2, spreadNS.SheetArea.colHeader);
        sheet.setValue(0, 13, "Annotation", spreadNS.SheetArea.colHeader);

        // columns
        sheet.bindColumn(0, { name: 'code', displayName: 'Code' })
        sheet.bindColumn(1, { name: 'name', displayName: 'Name' })
        sheet.bindColumn(2, { name: 'afeHours', displayName: 'AFE', formatter: '0.00', size: 80 })
        sheet.bindColumn(3, { name: 'targetHours', displayName: 'Target', formatter: '0.00', size: 80 })
        sheet.bindColumn(4, { name: 'dsvHours', displayName: 'DSV', formatter: '0.00', size: 80 })
        sheet.bindColumn(5, { name: 'actualHours', displayName: 'Actual', formatter: '0.00', size: 80 })
        sheet.bindColumn(6, { name: 'nptHours', displayName: 'NPT', formatter: '0.00', size: 80 })
        sheet.bindColumn(7, { name: 'tftHours', displayName: 'TFT', formatter: '0.00', size: 80 })
        sheet.bindColumn(8, { name: 'plannedDepth', displayName: 'Planned', formatter: '0.00', size: 80 })
        sheet.bindColumn(9, { name: 'actualDepth', displayName: 'Actual', formatter: '0.00', size: 80 })
        sheet.bindColumn(10, { name: 'start', displayName: 'Start', formatter: 'DD-MM-yyyy HH:mm' })
        sheet.bindColumn(11, { name: 'end', displayName: 'End', formatter: 'DD-MM-yyyy HH:mm' })
        sheet.bindColumn(12, { name: 'behindHours', displayName: 'Behind hours', formatter: '0.00', size: 100 })
        sheet.bindColumn(13, { name: 'contractor', displayName: 'Contractor', size: 200 })
        sheet.bindColumn(14, { name: 'comments', displayName: 'Comment', size: 200 })
        sheet.setColumnCount(15)

        const style = new spreadNS.Style()
        style.backColor = '#f6f6f6'
        style.cellPadding = '0 2'

        // Total row
        const totalRow = sheet.getRowCount()
        sheet.addRows(sheet.getRowCount(spreadNS.SheetArea.viewport), 1)
        sheet.setStyle(totalRow, 1, style, spreadNS.SheetArea.viewport)
        sheet.setValue(totalRow, 1, 'Total')

        const columnsCount = sheet.getColumnCount()
        const groupsIndex = groups.map(({ index }) => index + 1)

        function createTotal(letter) {
            return `${letter}${groupsIndex.join(`,${letter}`)}`
        }

        groups.forEach(({ index, count }) => {
            let i = columnsCount
            while (i >= 0) {
                sheet.setStyle(index, i, style, spreadNS.SheetArea.viewport)
                const cell = sheet.getCell(index, i, spreadNS.SheetArea.viewport)
                cell
                    .borderLeft(new spreadNS.LineBorder("#ccc", spreadNS.LineStyle.thin))
                    .borderRight(new spreadNS.LineBorder("#ccc", spreadNS.LineStyle.thin))
                    .borderTop(new spreadNS.LineBorder("#ccc", spreadNS.LineStyle.thin))
                    .borderBottom(new spreadNS.LineBorder("#ccc", spreadNS.LineStyle.thin))

                if (i > 1 && i < 8) {
                    const columnLetter = columnToLetter(i + 1)
                    const startRow = index + 2
                    const endRow = index + count + 1
                    const sumFormula = `=SUM(${columnLetter}${startRow}:${columnLetter}${endRow})`
                    sheet.setFormula(index, i, sumFormula)
                    sheet.setFormula(totalRow, i, `=SUM(${createTotal(columnLetter)})`)
                }
                i--
            }

            // Prevent lock events
            const row = new spreadNS.CellRange(sheet, index + 1, 0, count, columnsCount)
            row.locked(false)

            // group events to phases
            sheet.rowOutlines.group(index + 1, count)
            sheet.rowOutlines.expand(0, false)
            sheet.rowOutlines.direction(spreadNS.Outlines.OutlineDirection.backward);
        })


        // auto fit
        sheet.autoFitColumn(1)
        sheet.autoFitColumn(10)
        sheet.autoFitColumn(11)
        sheet.resumePaint()
    }

    render() {
        return (
            <Fragment>
                <h3>SpreadJS render performance: <span style={{ color: 'tomato' }}>{this.state.time}ms</span></h3>
                <div ref={this.tableRef} style={{ height: '100%', width: '100%' }}/>
            </Fragment>
        )
    }
}
