import React, { Component, Fragment, createRef } from 'react';
import dataService from '../db/dataService'
import ZingGrid from 'zinggrid';
import './zing-grid.css'
import createFlatter from '../helpers/flat-data'


window.assignDataToNestedGrid = (index, cellRef, recordRef) => {
    if (cellRef) {
        cellRef.querySelector('zing-grid').setData(JSON.stringify(index))
    }
}
export default class ZingGridView extends Component {
    constructor(props) {
        super(props)
        this.tabelEl = createRef()
        this.state = {
            time: 0
        }
    }

    componentDidMount() {
        this.initTable()
    }

    initTable = () => {
        const ts = window.performance.now()
        const flatData = createFlatter()
        const { data } = flatData(dataService.getPhases())
        const grid = new ZingGrid(this.tabelEl.current, {
            data,
            columns: [
                {
                    index: 'code',
                    width: 80
                },
                {
                    index: 'name'
                },
                {
                    index: 'afeHours',
                    type: 'number',
                    header: 'AFE',
                    width: 80
                },
                {
                    index: 'targetHours',
                    type: 'number',
                    header: 'Target',
                    width: 80
                },
                {
                    index: 'dsvHours',
                    type: 'number',
                    header: 'DSV',
                    width: 80
                },
                {
                    index: 'nptHours',
                    type: 'number',
                    header: 'NPT',
                    width: 80
                },
                {
                    index: 'wowHours',
                    type: 'number',
                    header: 'WOW',
                    width: 80
                },
                {
                    index: 'tftHours',
                    type: 'number',
                    header: 'TFT',
                    width: 80
                },
                {
                    index: 'plannedDepth',
                    type: 'number',
                    header: 'Planned',
                    width: 80
                },
                {
                    index: 'actualDepth',
                    type: 'number',
                    header: 'Actual',
                    width: 80
                }
            ],
            editor: true,
            layout: 'row',
            loading: true,
            height: '600px',
            loadByScroll: true
        });

        grid.addEventListener('grid:ready', (e) => {
            const te = window.performance.now()
            const time = (te - ts).toFixed(2)
            this.setState({ time })
        })
    }

    render() {
        return (
            <Fragment>
                <h3>Zing grid render performance: <span style={{ color: 'tomato' }}>{this.state.time}ms</span></h3>
                <div ref={this.tabelEl}/>
            </Fragment>
        )
    }
}
