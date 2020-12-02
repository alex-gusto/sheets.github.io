/**
 * TreeGrid component
 * http://www.treegrid.com/TreeGrid5_6/Doc/TreeGridFAQ.htm
 *
 */
import React, { Component, createRef } from 'react'
import noop from 'lodash/noop'
import PropTypes from 'prop-types'
import { deepClone } from 'core/util/deep-clone'
import merge from 'lodash/merge'
import convertObjectToFlatKeys from './utils/convert-object-to-flat-keys'
import helpers from './utils/global-helpers'

const { TreeGrid, Grids } = window

Grids.OnCustomAjax = (G, IO, data, func) => {
    if (IO.Url) {
        import(`./config/${IO.Url}`)
            .then(({ default: res }) => func(0, res))
            .catch(err => err)
    } else {
        G.OnDataChanged(G, JSON.parse(G.GetChanges()), func) // TODO: data doesn't match with changes list
    }

    return true
}

const propTypes = {
    id: PropTypes.string.isRequired,

    // events
    onDataChanged: PropTypes.func,

    // data
    body: PropTypes.arrayOf(PropTypes.object),
    layout: PropTypes.shape({
        Cfg: PropTypes.objectOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number]))
    }).isRequired,
    nestedKey: PropTypes.string,

    // rows defaults http://www.treegrid.com/Doc/RowDefaults.htm
    Def: PropTypes.string,
    DefEmpty: PropTypes.string,
    DefParent: PropTypes.string,
    Validator: PropTypes.func
}

const defaultProps = {
    onDataChanged: noop,
    nestedKey: '__children',
    body: [],
    Def: 'R',
    DefEmpty: 'R',
    DefParent: 'R',
    Validator: null
}

class TreeGridComponent extends Component {
    static propTypes = propTypes

    static defaultProps = defaultProps

    $el = createRef()

    grid = null

    // eslint-disable-next-line react/destructuring-assignment
    gridBody = this.prepareBody(this.props.body)

    dataManager = new Worker('/sheets.github.io/ManageData.worker.js')

    componentDidMount() {
        this.initGrid()
        this.subscribeGridEvents()
    }

    componentWillUnmount() {
        this.dataManager.terminate()

        if (!this.grid) return
        this.grid.Dispose()
    }

    subscribeGridEvents = () => {
        this.grid.OnDataChanged = (G, { Changes }, func) => {
            const { body, nestedKey, Validator } = this.props
            let validChanges = []
            let errors = []

            if (Validator) {
                const validator = new Validator(G)
                ;[validChanges, errors] = validator.validate(Changes)
            }

            const hasErrors = errors.length
            func(0, {
                IO: {
                    Result: hasErrors ? -1 : 0
                },
                Changes: hasErrors ? errors : validChanges
            })

            if (hasErrors) return
            G.AcceptChanges()

            const onDataManagerMessage = (...args) => {
                this.onDataManagerMessage(...args)

                this.dataManager.removeEventListener('message', onDataManagerMessage)
            }

            this.dataManager.addEventListener('message', onDataManagerMessage)
            this.dataManager.postMessage(['update', { changes: Changes, data: body, nestedKey }])
        }
    }

    onDataManagerMessage = e => {
        if (!Array.isArray(e.data)) return

        const { onDataChanged } = this.props
        const [event, data] = e.data

        switch (event) {
            case 'updated':
                onDataChanged(data.data)
                break
            case 'error':
                // eslint-disable-next-line no-console
                console.error('Worker error: ', data.data)
                break
            default:
                // eslint-disable-next-line no-console
                console.debug('Worker: event not found!')
        }
    }

    initGrid() {
        const { layout, id } = this.props
        const Data = merge({}, layout)

        this.grid = TreeGrid(
            {
                Debug: process.env.NODE_ENV !== 'production' ? 'Problem' : 0,
                id,
                Layout: {
                    Data
                },
                Upload: {
                    Format: 'JSON',
                    Flags: 'Spanned',
                    Type: 'Changes,Span',
                    Tag: 'grid'
                },
                Data: {
                    Data: {
                        Body: [this.gridBody]
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
        )
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
        return (
            <div
                ref={this.$el}
                style={{
                    height: '100%',
                    width: '100%'
                }}
            />
        )
    }
}

export default TreeGridComponent
