import React, { Component, createRef } from 'react';
import './wijmo.css'
import '@grapecity/wijmo.styles/wijmo.css';
import { FlexGrid, FlexGridColumn } from "@grapecity/wijmo.react.grid";
// import * as wjCore from '@grapecity/wijmo';
import { FlexGridXlsxConverter } from '@grapecity/wijmo.grid.xlsx';
import * as wjGrid from '@grapecity/wijmo.grid';
import { Menu, MenuItem, MenuSeparator } from '@grapecity/wijmo.react.input';

import dataService from '../db/dataService'

function isGroupRow(row) {
    return row instanceof wjGrid.GroupRow
}

function getRowLevel(row) {
    return isGroupRow(row) ? row.level : -1
}

function getParentNode(row) {
    let parentRow = null
    const rowLevel = getRowLevel(row);
    if (rowLevel === -1) return

    let i = row.index
    do {
        i--
        parentRow = row.grid.rows[i]
    } while (getRowLevel(parentRow) >= rowLevel)

    return parentRow
}


class CostTableView extends Component {
    gridRef = createRef()
    state = {
        costs: dataService.getCosts(),
        filter: '',
        time: 0
    }

    constructor(props) {
        super(props)
        this._ts = window.performance.now()
    }

    componentDidMount() {
        this.updateGridStyles()

        this.workerGrid.collapseGroupsToLevel(0)
        this.workerGrid.rowAdded.addHandler(() => {
            this.updateGridStyles()
        })

        this.workerGrid.deletedRow.addHandler((grid, e) => {
            this.updateGridStyles()
        })

        this.workerGrid.deletingRow.addHandler((grid, e) => {
            // this.updateGridStyles()
        })
    }

    initialWorkerGrid = (grid) => {
        this.workerGrid = grid;
        // grid.columnFooters.rows.push(new wjGrid.GroupRow());
        // grid.bottomLeftCells.setCellData(0, 0, 'Σ');
        grid.formatItem.addHandler((grid, e) => {
            if (e.panel !== grid.cells) {
                return
            }

            const { row, col } = e
            const rowData = grid.rows[row]
            const colData = grid.columns[col]

            // if (colData.binding === 'rate' && rowData.hasChildren) {
            //     e.cell.textContent = wjCore.getAggregate(1, item.__children, 'rate')
            // }

            if (/days/.test(colData.binding) && !rowData.hasChildren) {
                // e.cell.textContent = get(item, colData.binding, get(item, colData.binding.replace('days', 'populatedDays')))
            }
        });

        grid.itemFormatter = (panel, r, c, cell) => {
            if (panel.cellType === wjGrid.CellType.ColumnHeader) {
            }
        }

        const te = window.performance.now()
        const time = (te - this._ts).toFixed(2)
        this.setState({ time })
    }

    onCellEditEnding = (grid, e) => {
        console.log('edited')
    }

    updateGridStyles = () => {
        this.workerGrid.rows.forEach((row) => {
            if (!row.hasChildren) {
                row.cssClass = 'wj-group--bg-white'
            }
            row.isReadOnly = row.hasChildren;
        });
    }

    onFilter = ({ target: { value } }) => {
        this.setState(() => {
            const filter = value.toLowerCase()
            const costs = dataService.getCosts()

            return {
                costs: this.filter(filter, costs),
                filter
            }
        }, () => {
            this.updateGridStyles()
        })
    }

    filter(filterString, costs) {
        if (filterString === '') return costs;
        const keysToSearch = ['name', 'code'];

        const search = cost => {
            const values = keysToSearch.map(key => cost[key]).filter(v => v);
            if (values.some(v => v.toLowerCase().includes(filterString))) {
                return cost;
            }

            if (cost.__children && cost.__children.length) {
                const costCopy = Object.assign({}, cost);
                const children = cost.__children.reduce(collectResults, []);

                if (children.length) {
                    costCopy.__children = children;
                    return costCopy;
                }
            }

            return null;
        };

        function collectResults(acc, cost) {
            const res = search(cost);
            if (res) acc.push(res);

            return acc;
        }

        return costs.reduce(collectResults, []);
    }

    onMenuItemClicked = ({ selectedValue }) => {
        const cmd = this[selectedValue]
        if (typeof cmd !== 'function') {
            console.log('Context Menu: no cmd found ', selectedValue)
            return
        }

        cmd()
    }

    addRow = () => {
        const { row: rowIndex } = this.workerGrid.selection
        const { rows } = this.workerGrid
        const rowData = rows[rowIndex].dataItem

        this.setState(({ costs }) => {
            if (!rowData.__children) {
                rowData.__children = []
            }

            rowData.__children.push({ name: '', code: '', days: {}, populatedDays: {} })

            const newCosts = [...costs]
            return { costs: newCosts }
        }, () => {
            this.workerGrid.refresh()
            this.updateGridStyles()
        })
    }

    removeRow = () => {
        const { row: rowIndex } = this.workerGrid.selection
        const { rows } = this.workerGrid
        const row = rows[rowIndex]
        const parentRow = getParentNode(row)

        if (parentRow) {
            this.setState(({ costs }) => {
                const parentRowData = parentRow.dataItem
                const rowData = row.dataItem
                const childIndex = parentRowData.__children.findIndex(child => child === rowData)

                if (childIndex >= 0) {
                    parentRowData.__children.splice(childIndex, 1)
                }

                return { costs: [...costs] }
            }, () => {
                this.workerGrid.refresh()
                this.updateGridStyles()
            })
        }
    }

    collapseAll = () => {
        this.workerGrid.collapseGroupsToLevel(0)
    }

    expandAll = () => {
        this.workerGrid.collapseGroupsToLevel(this.workerGrid.rows.maxGroupLevel + 1)
    }


    onDraggedRow = (grid, e) => {
        console.log(e)
    }

    exportExcel = () => {
        const book = FlexGridXlsxConverter.save(this.workerGrid, {
            includeColumnHeaders: true,
            includeRowHeaders: true
        })

        book.sheets[0].name = 'FlexGrid Data';
        book.saveAsync('FlexGrid-Export.xlsx');
    }

    render() {
        const { costs, filter, time } = this.state
        const columns = ['days.2015-06-22', 'days.2015-06-27', 'days.2015-07-05', 'days.2015-07-11'].map((key) =>
            <FlexGridColumn
                binding={key}
                header={key.replace('days.', '')}
                key={key}
                allowResizing={false}></FlexGridColumn>)


        return (
            <div className="cost-view">
                <h3>Wijmo Grid render performance: <span style={{ color: 'tomato' }}>{time}ms</span></h3>

                <input type="text" value={filter}
                       placeholder="Filter"
                       className="form-control" style={{ marginBottom: '20px' }}
                       onChange={this.onFilter}/>
                <FlexGrid
                    ref={this.gridRef}
                    itemsSource={costs}
                    selectionMode="Row"
                    autoGenerateColumns={false}
                    childItemsPath="__children"
                    frozenColumns={7}
                    isReadOnly={false}
                    allowSorting={false}
                    allowDragging="Rows"
                    allowAddNew={true}
                    // allowDelete={true}
                    initialized={this.initialWorkerGrid}
                    cellEditEnding={this.onCellEditEnding}
                    draggedRow={this.onDraggedRow}
                >
                    <FlexGridColumn binding="name" header="Name" width="2*" minWidth={200}
                                    isReadOnly={false}></FlexGridColumn>
                    <FlexGridColumn binding="code" header="Code"></FlexGridColumn>
                    <FlexGridColumn binding="type" header="Type"
                                    dataMap={['tangible', 'intangible', 'consumable']}></FlexGridColumn>
                    <FlexGridColumn binding="unit" header="Unit"
                                    dataMap={['day rate', 'lump sum', 'unit cost', 'depth based']}></FlexGridColumn>
                    <FlexGridColumn binding="rate" header="Rate"></FlexGridColumn>
                    <FlexGridColumn binding="currency" header="Currency"
                                    dataMap={["AUD", "EUR", "GBP", "NOK", "USD"]}></FlexGridColumn>
                    <FlexGridColumn binding="populateDaily" header="Populate Daily" format="n*"></FlexGridColumn>
                    <FlexGridColumn binding="prior" header="Before onhire"></FlexGridColumn>
                    {columns}
                    <FlexGridColumn binding="afterOffhire" header="After offhire"></FlexGridColumn>
                </FlexGrid>

                <Menu contextMenuOf={this.gridRef}
                      header="Context Menu"
                      selectedValuePath="cmd"
                      dropDownCssClass="ctx-menu"
                      itemClicked={this.onMenuItemClicked}
                >
                    <MenuItem cmd="addRow">
                        Add row
                    </MenuItem>
                    <MenuItem cmd="removeRow">
                        Remove row
                    </MenuItem>
                    <MenuSeparator></MenuSeparator>
                    <MenuItem cmd="collapseAll">
                        Collapse all
                    </MenuItem>
                    <MenuItem cmd="expandAll">Expand all</MenuItem>
                    <MenuSeparator></MenuSeparator>
                    <MenuItem cmd="exportExcel">Export Excel</MenuItem>
                </Menu>
            </div>
        )
    }
}

export default CostTableView
