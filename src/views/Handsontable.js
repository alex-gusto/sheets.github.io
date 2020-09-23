import React, { Component, createRef, Fragment } from 'react';
import dataService from '../db/dataService'
import Handsontable from 'handsontable'
import performance from '../helpers/perfomance'
import 'handsontable/dist/handsontable.full.css';
import './handsotable.css'

class SpreadSheetsCon extends Component {

    constructor(props) {
        super(props);

        this.tableRef = createRef()
        this.state = {
            time: 0
        }
    }

    componentDidMount() {
        const time = performance(this.initTable)
        this.setState({ time })
        const lis = document.querySelector('#hot-display-license-info')
        if (lis) lis.remove()
    }

    componentWillUnmount() {
        const lis = document.querySelector('#hot-display-license-info')
        if (lis) lis.remove()
    }

    initTable = () => {
        this.hot = new Handsontable(this.tableRef.current, {
            data: dataService.getPhases(),
            nestedRows: true,
            colHeaders: true,
            rowHeaders: true,
            autoRowSize: true,
            stretchH: "all",
            height: '500px',
            width: '100%',
            persistentState: true,
            nestedHeaders: [
                [
                    {
                        label: 'Identification',
                        colspan: 2
                    },
                    {
                        label: 'Duration [h]',
                        colspan: 7
                    },
                    {
                        label: 'End Depth [mMD]',
                        colspan: 2
                    },
                    {
                        label: 'Timing',
                        colspan: 3
                    },
                    {
                        label: 'Annotation',
                        colspan: 2
                    }
                ],
                [
                    'Code',
                    'Name',
                    'AFE',
                    'Target',
                    'DSV',
                    'Actual',
                    'NPT',
                    'WOW',
                    'TFT',
                    'Planned',
                    'Actual',
                    'Start',
                    'End',
                    'Days -ahead/+behind',
                    'Contractor',
                    'Comment'
                ]
            ],
            columns: [
                { data: 'code' },
                { data: 'name' },
                {
                    data: 'afeHours',
                    type: 'numeric',
                    numericFormat: {
                        pattern: '0,0.00'
                    },
                    allowEmpty: true,
                    width: 80
                },
                {
                    data: 'targetHours',
                    type: 'numeric',
                    numericFormat: {
                        pattern: '0,0.00'
                    },
                    allowEmpty: true,
                    width: 80
                },
                {
                    data: 'dsvHours',
                    type: 'numeric',
                    numericFormat: {
                        pattern: '0,0.00'
                    },
                    allowEmpty: true,
                    width: 80
                },
                {
                    data: 'actualHours',
                    type: 'numeric',
                    numericFormat: {
                        pattern: '0,0.00'
                    },
                    allowEmpty: true,
                    width: 80
                },
                {
                    data: 'nptHours',
                    type: 'numeric',
                    numericFormat: {
                        pattern: '0,0.00'
                    },
                    allowEmpty: true,
                    width: 80
                },
                {
                    data: 'wowHours',
                    type: 'numeric',
                    numericFormat: {
                        pattern: '0,0.00'
                    },
                    allowEmpty: true,
                    width: 80
                },
                {
                    data: 'tftHours',
                    type: 'numeric',
                    numericFormat: {
                        pattern: '0,0.00'
                    },
                    allowEmpty: true,
                    width: 80
                },
                {
                    data: 'plannedDepth',
                    type: 'numeric',
                    numericFormat: {
                        pattern: '0,0.00'
                    },
                    allowEmpty: true,
                    width: 80
                },
                {
                    data: 'actualDepth',
                    type: 'numeric',
                    numericFormat: {
                        pattern: '0,0.00'
                    },
                    allowEmpty: true,
                    width: 80
                },
                {
                    data: 'start',
                    type: 'date',
                    correctFormat: true,
                    allowEmpty: true
                },
                {
                    data: 'end',
                    type: 'date',
                    correctFormat: true,
                    allowEmpty: true
                },
                {
                    data: 'behindHours',
                    type: 'numeric',
                    allowEmpty: true,
                    width: 80
                },
                {
                    data: 'contractor',
                    type: 'numeric',
                    allowEmpty: true,
                    width: 80
                },
                { data: 'comments' }

            ],
            contextMenu: true,
            bindRowsWithHeaders: 'strict',
            manualRowMove: true
        })

        this.hot.updateSettings({
            cells(row, col, prop) {
                const cellProperties = this;
                const classes = [];
                let readOnly = false;

                const isTotal = this.instance.getDataAtRowProp(this.visualRow, 'isTotal');
                const isGroup = this.instance.getDataAtRowProp(this.visualRow, 'group');

                if (isGroup) {
                    readOnly = true;
                    // add style for group rows
                    classes.push('group-cell');
                } else if (isTotal) {
                    readOnly = true;
                    // add style for total row
                    classes.push('total-cell');
                } else {
                    classes.push('leaf-cell');
                }

                if (readOnly) {
                    classes.push('locked-cell');
                }

                // Lock date styles
                if (!isTotal) {
                    const start = this.instance.getDataAtRowProp(this.visualRow, 'start');
                    const overriddenStart = this.instance.getDataAtRowProp(this.visualRow, 'overriddenStart');
                    const lockTimestamp = +new Date();

                    if (+new Date(start) < lockTimestamp || +new Date(overriddenStart) < lockTimestamp) {
                        // readOnly = true;
                        classes.push('parked-cell');
                    }
                }

                cellProperties.readOnly = readOnly;
                cellProperties.className = classes.join(' ')
                return cellProperties;
            }
        });
    }

    render() {
        return (
            <Fragment>
                <h3>Handsontable render performance: <span style={{ color: 'tomato' }}>{this.state.time}ms</span></h3>

                <div ref={this.tableRef}
                     style={{ overflow: 'hidden', flex: '1 1 auto', fontSize: '11px' }}
                />
            </Fragment>
        )
    }
}

export default SpreadSheetsCon
