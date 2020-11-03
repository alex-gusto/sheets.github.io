/**
 * TreeGrid component
 * http://www.treegrid.com/TreeGrid5_6/Doc/TreeGridFAQ.htm
 *
 */
import React, { Component, createRef } from 'react';
import noop from 'lodash/noop'
import PropTypes from 'prop-types'
import deepClone from '../../helpers/deep-clone'
import { v4 as uuid } from 'uuid/wrapper.mjs'
import convertObjectToFlatKeys from './utils/convert-object-to-flat-keys'
import merge from 'lodash/merge'
import helpers from './utils/global-helpers'

const { TreeGrid, Grids } = window
const dataManager =  new Worker("/sheets.github.io/ManageData.worker.js")


const propTypes = {
    // events
    onDataChanged: PropTypes.func,

    // data
    body: PropTypes.array,
    layout: PropTypes.object,
    nestedKey: PropTypes.string,

    // rows defaults http://www.treegrid.com/Doc/RowDefaults.htm
    Def: PropTypes.string,
    DefEmpty: PropTypes.string,
    DefParent: PropTypes.string
}

const defaultProps = {
    onDataChanged: noop,
    nestedKey: '__children',
    body: [],
    Def: 'R',
    DefEmpty: 'R',
    DefParent: 'R'
}

class TreeGridComponent extends Component {
    static propTypes = propTypes
    static defaultProps = defaultProps

    $el = createRef()
    grid = null
    #TreeGridUpdatedCallback = noop
    #gridBody = this.prepareBody(this.props.body)

    componentDidMount() {
        this.subscribeDataManagerEvents()
        this.initGrid()
        this.subscribeGridEvents()
    }

    componentWillUnmount() {
        this.unsubscribeDataManagerEvents()

        if (!this.grid) return
        this.grid.Dispose()
    }

    initGrid() {
        const Data = merge({}, this.props.layout)

        this.grid = TreeGrid(
            {
                Debug: 'Problem',
                Layout: {
                    Data
                },
                Upload: {
                    Format: 'JSON',
                    Type: ['Changes'],
                    Tag: 'grid'
                },
                Data: {
                    Data: {
                        Body: [this.#gridBody]
                    }
                }
            },

            // root element
            this.$el.current,

            // inject to Grid
            {
                Component: this,
                Helpers: helpers
            }
        );
    }

    subscribeGridEvents = () => {
        Grids.OnCustomAjax = (G, IO, data, func) => {
            if (this.grid === G) {
                const { body, nestedKey } = this.props
                const { Changes } = JSON.parse(data)

                this.#TreeGridUpdatedCallback = func // TODO: weak place. need to rethink architecture of communication with TreeGrid
                dataManager.postMessage(['update', { changes: Changes, data: body, nestedKey }])
            }

            return true;
        }

        // add custom id generator
        Grids.OnGenerateId = () => uuid()
    }

    subscribeDataManagerEvents = () => {
        dataManager.addEventListener('message', this.onDataManagerMessage)
    }

    unsubscribeDataManagerEvents = () => {
        dataManager.removeEventListener('message', this.onDataManagerMessage)
    }

    onDataManagerMessage = (e) => {
        if (!Array.isArray(e.data)) return

        const [event, data] = e.data

        switch (event) {
            case 'updated':
                this.onDataUpdated(data.data)
                break
            case 'error':
                console.error('Worker error: ', data.data)
                break
            default:
                console.debug('Worker: event not found!')
        }
    }

    onDataUpdated(newData) {
        this.props.onDataChanged(newData)

        this.#TreeGridUpdatedCallback(0, {
            IO: {},
            Changes: []
        })
    }

    /**
     * Data  format http://www.treegrid.com/Doc/DataFormats.htm#JSONFormat
     * @param arr
     * @returns {{}[]}
     */
    prepareBody(arr) {
        const { nestedKey, Def, DefParent, DefEmpty } = this.props

        function traverse(item) {
            if (item[nestedKey] && item[nestedKey].length) {
                item.Def = item.Def || DefParent
                item.Items = item[nestedKey].map(traverse)
                if (nestedKey !== 'Items') delete item[nestedKey]
            } else {
                item.Def = item.Def || Def
            }

            item.DefParent = item.DefParent || DefParent
            item.DefEmpty = item.DefEmpty || DefEmpty

            return convertObjectToFlatKeys(item)
        }

        return deepClone(arr).map(traverse)
    }

    render() {
        return <div ref={this.$el} style={{ height: '100%' }}/>
    }
}

export default TreeGridComponent
