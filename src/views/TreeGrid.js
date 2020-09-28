import React, { Component, createRef, Fragment } from 'react';
import layout from './TreeDef'
import dataService from '../db/dataService'
import uid from 'uid'


const LS_KEY = `data-2`

function migrateData(arr) {
    arr = arr || dataService.getCosts() || []

    function flat(item) {
        item.id = uid()
        if (item.__children && item.__children.length) {
            item.Def = 'CostGroup'
            item.Items = item.__children.map(flat)
        }

        const days = Object.entries(item.days)
        if (days.length) {
            days.forEach(([day, value]) => {
                item[`day-${day}`] = value
            })
        }

        if (item.populatedDays) {
            const populatedDays = Object.entries(item.populatedDays)
            if (populatedDays.length) {
                populatedDays.forEach(([day, value]) => {
                    item[`populatedDay-${day}`] = value
                })
            }
        }

        delete item.__children
        delete item.group
        delete item.days
        delete item.populatedDays

        return item
    }

    return arr.map(flat)
}

const getBody = () => {
    let data = window.localStorage.getItem(LS_KEY)
    if (data) return JSON.parse(data)

    data = migrateData()
    window.localStorage.setItem(LS_KEY, JSON.stringify(data))

    return data
}

class TreeGrid extends Component {
    Grid = null;
    tagRef = createRef()
    _body = getBody()
    _worker = new Worker("/sheets.github.io/worker.js")

    componentDidMount() {
        this._worker.addEventListener('message', (e) => {
            const [event, newData] = e.data

            switch (event) {
                case 'updated':
                    this.saveData(newData)
                    break
                case 'error':
                    console.error('Worker error: ', newData)
                    break
                default:
                    console.debug('Worker: event not found!')
            }
        })

        new Promise(resolve => {
            this.Grid = window.TreeGrid({
                Debug: '',
                Layout: {
                    Data: layout
                },
                Upload: {
                    Format: 'JSON',
                    Type: ['Changes'],
                    Tag: 'grid'
                },
                Data: {
                    Data: {
                        Body: [
                            this._body
                        ]
                    }
                }
            }, this.tagRef.current, { Component: this });

            window.Grids.OnAfterValueChanged = this.updateData
            window.Grids.OnSave = (grid, row, b) => {
                console.log(row, b)
            }
        })
    }

    componentWillUnmount() {
        this.Grid.Dispose()
    }

    populate = (Grid, Row, Value) => {
        ['2016-06-13', '2016-06-13/1', '2016-06-14'].forEach(key => {
            Grid.SetValue(Row, `populatedDay-${key}`, Value, 1)
        })
    }

    saveData = (newData) => {
        window.localStorage.setItem(LS_KEY, JSON.stringify(newData))
        this._body = newData
    }

    updateData = (grid, row, col) => {
        const newRowData = { id: row.id }
        newRowData[col] = row[col]
        this._worker.postMessage(['change', newRowData, this._body])
    }

    showCustomMenu = (row, col) => {
        var G = this.Grid;
        this.Grid.ShowMenu(row, col, {
            Items: [
                {
                    Name: row.Deleted ? "Undelete row" : "Delete row",
                    OnClick: function () {
                        G.DeleteRow(row, row.Deleted ? 3 : 1);
                    }
                },
                {
                    Name: row.Selected ? "Deselect row" : "Select row",
                    OnClick: function () {
                        G.SelectRow(row);
                    }
                },
                {
                    Name: "Copy row",
                    OnClick: function () {
                        G.CopyRow(row, null, row, 1, 0);
                    }
                },
                {
                    Name: "Add new row",
                    OnClick: function () {
                        G.AddRow(null, row, 1);
                    }
                }
            ]
        });
        return 1;
    }

    render() {
        return (
            <Fragment>
                <div ref={this.tagRef}/>
            </Fragment>
        )
    }
}

export default TreeGrid
