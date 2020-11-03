import React, { Component } from 'react'
import TimeTrackerGrid from './TimeTrackerGrid'
import migrateData from './migrate-data'
import dataService from '../../db/dataService'

const version = 'phases-v2'


class TimeTracker extends Component {
    model = {
        attrs: {},
        set(key, v) {
            this.attrs[key] = v
            this.save()
        },
        get(key) {
            return this.attrs[key]
        },
        load(v) {
            this.attrs = v
        },
        save() {
            window.localStorage.setItem(version, this.toJSON())
        },
        toJSON() {
            return JSON.stringify(this.attrs)
        }
    }

    constructor(props) {
        super(props)

        const attrs = window.localStorage.getItem(version)
        if (attrs) {
            this.model.load(JSON.parse(attrs))
        } else {
            const [Phases] = migrateData(dataService.getPhases())
            const Wells = [{
                name: 'Well #1',
                Items: Phases
            }]

            this.model.load({ Wells })
        }
    }

    render() {
        return <TimeTrackerGrid model={this.model}/>
    }
}

export default TimeTracker
