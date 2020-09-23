import React, { Component, Fragment, createRef } from 'react';
import './wijmo.css'
import '@grapecity/wijmo.styles/wijmo.css';
import { FlexGrid, FlexGridColumn } from "@grapecity/wijmo.react.grid";
import * as wjCore from '@grapecity/wijmo';
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
        filter: ''
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

    initTable() {
        const { model } = this.props
        const colHeaders = [
            'Name',
            'Code',
            'Type',
            'Unit',
            'Rate',
            'Currency',
            'Populate <br> Daily'
        ];
        const columns = [
            {
                data: 'name',
                type: 'text',
                width: 320
            },
            {
                data: 'code',
                type: 'text',
                width: 80
            },
            {
                data: 'type',
                type: 'dropdown',
                source: ['tangible', 'intangible', 'consumable'],
                width: 80
            },
            {
                data: 'unit',
                type: 'dropdown',
                source: [],
                width: 80
            },
            {
                data: 'rate',
                type: 'numeric'
            },
            {
                data: 'currency',
                type: 'dropdown',
                source: model.currencies,
                width: 80
            },
            {
                data: 'populateDaily',
                type: 'numeric'
            }
        ];

        const fixedColumnsLeft = columns.length;
        const lockDate = model.get('LockDate') ? new Date(model.get('LockDate')) : null;
        const priorCol = { data: model.beforeOnhire.key, type: 'numeric', width: 30 };
        const afterOffhireCol = { data: model.afterOffhire.key, type: 'numeric', width: 30 };

        if (lockDate) {
            priorCol.readOnly = true;
            afterOffhireCol.readOnly = true;
        }

        const columnsRight = [];
        columnsRight.push(priorCol);
        colHeaders.push(model.beforeOnhire.title);

        model.eachPhaseDay(({ day, key, phase, serial }) => {
            const date = new Date(day);
            const column = {
                data: key,
                type: 'numeric',
                width: 30,
                readOnly: lockDate >= date,
                renderer(instance, td, row, col, prop, value, cellProperties) {
                    if (!value) {
                        const placeholderKey = key.replace('days', 'populatedDays'); // key like populatedDays.2020-02-02
                        cellProperties.placeholder = instance.getDataAtRowProp(row, placeholderKey);
                    }
                }
            }
            columnsRight.push(column);
            colHeaders.push(day);
        });

        colHeaders.push(model.afterOffhire.title);
        columnsRight.push(afterOffhireCol);

        const grid = new FlexGrid(this.tableRef.current, {
            childItemsPath: '__children',
            autoGenerateColumns: false,
            selectionMode: 'Row',
            columns: [
                {
                    binding: 'name',
                    header: 'Name',
                    width: '*'
                },
                {
                    binding: 'code',
                    header: 'Code'
                },
                {
                    binding: 'type',
                    header: 'Type',
                    dataMap: ['tangible', 'intangible', 'consumable']
                },
                {
                    binding: 'unit',
                    header: 'Unit'
                },
                {
                    binding: 'rate',
                    header: 'Rate'
                },
                {
                    binding: 'currency',
                    header: 'Currency'
                },
                {
                    binding: 'populateDaily',
                    header: 'Populate Daily'
                },
                {
                    binding: 'days.2020-05-11',
                    header: '2020-05-11'
                }
            ],
            // allowAddNew: true,
            // allowDelete: true,
            itemsSource: model.get('Costs'),
            loadedRows: function (s, e) {
                console.log(s)
                s.rows.forEach(function (row) {
                    row.isReadOnly = false;
                });
            }
        })
        // const pruneObject = (key, cost) => {
        //     const obj = cost[key]
        //     if (!(obj instanceof Object) || !Object.keys(obj).length) {
        //         delete cost[key]
        //         return
        //     }
        //
        //     Object.entries(obj).forEach(([key1, value]) => {
        //         cost[`${key}_${key1}`] = value
        //     })
        //     delete cost[key]
        // }
        //
        // function createBody(costs) {
        //     return costs.map(cost => {
        //         if (cost.__children) {
        //             cost.Items = createBody(cost.__children)
        //             delete cost.__children
        //         }
        //
        //         ['days', 'populatedDays'].forEach((key) => pruneObject(key, cost))
        //
        //         return cost
        //     })
        // }
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
            const item = rowData.dataItem

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
        const { model } = this.props
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
