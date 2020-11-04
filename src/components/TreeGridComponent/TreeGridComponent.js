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

Grids.Test = (grid, target, test) => {
    console.log(grid.id)
    return true
}

Grids.OnCustomAjax = (G, IO, data, func) => {
    if (IO.Url) {
        import(`./${IO.Url}`).then(({ default: res }) => func(0, res))
    } else {
        G.OnDataChanged(G, JSON.parse(data), func)
    }

    return true;
}

// add custom id generator
Grids.OnGenerateId = () => uuid()

const propTypes = {
    id: PropTypes.string.isRequired,

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
    #gridBody = this.prepareBody(this.props.body)
    #dataManager = new Worker("/sheets.github.io/ManageData.worker.js")

    componentDidMount() {
        this.initGrid()
        this.subscribeGridEvents()
    }

    componentWillUnmount() {
        this.#dataManager.terminate()

        if (!this.grid) return
        this.grid.Dispose()
    }

    initGrid() {
        const Data = merge({}, this.props.layout)

        this.grid = TreeGrid(
            {
                Debug: 'Problem',
                id: this.props.id,
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
        this.grid.OnDataChanged = (G, { Changes }, func) => {
            const { body, nestedKey } = this.props

            const onDataManagerMessage = (...args) => {
                this.onDataManagerMessage(...args)

                func(0, { IO: {}, Changes: [] })

                this.#dataManager.removeEventListener('message', onDataManagerMessage)
            }

            this.#dataManager.addEventListener('message', onDataManagerMessage)
            this.#dataManager.postMessage(['update', { changes: Changes, data: body, nestedKey }])
        }
    }

    onDataManagerMessage = (e) => {
        if (!Array.isArray(e.data)) return

        const [event, data] = e.data

        switch (event) {
            case 'updated':
                this.props.onDataChanged(data.data)
                break
            case 'error':
                console.error('Worker error: ', data.data)
                break
            default:
                console.debug('Worker: event not found!')
        }
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
