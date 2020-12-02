import React, { Component } from 'react';
import './App.css'
import NavBar from './components/NavBar'
import Handsontable from './views/Handsontable'
import SpreadJS from './views/SpreadJS'
import ZingGrid from './views/ZingGrid'
import WijmoGrid from './views/WijmoGrid'
import TreeGrid from './views/TreeGrid'
import TimeTracker from './views/TimeTracker'
import { HashRouter, Route, Switch } from 'react-router-dom'


class Sample extends Component {
    render() {
        return (
            <HashRouter>
                <NavBar/>
                <div className="views-container">
                    <Switch>
                        <Route path="/time-tracker">
                            <TimeTracker/>
                        </Route>

                        <Route exact path="/">
                            <Handsontable/>
                        </Route>
                        <Route path="/spread-js">
                            <SpreadJS/>
                        </Route>
                        <Route path="/zing-grid">
                            <ZingGrid/>
                        </Route>
                        <Route path="/wijmo-grid">
                            <WijmoGrid/>
                        </Route>

                        <Route path="/tree-grid">
                            <TreeGrid/>
                        </Route>
                    </Switch>
                </div>
            </HashRouter>
        )
    }
}

export default Sample
