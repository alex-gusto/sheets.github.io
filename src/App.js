import React, { Component } from 'react';
import './App.css'
// import NavBar from './components/NavBar'
import Handsontable from './views/Handsontable'
import SpreadJS from './views/SpreadJS'
import ZingGrid from './views/ZingGrid'
import WijmoGrid from './views/WijmoGrid'
import TimeTracker from './views/TimeTracker'
import { HashRouter, Route, Switch } from 'react-router-dom'


class Sample extends Component {
    render() {
        return (
            <HashRouter>
                {/*<NavBar/>*/}
                <div className="views-container">
                    <Switch>
                        <Route path="/">
                            <TimeTracker/>
                        </Route>

                        <Route exact path="/handsontable">
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
                    </Switch>
                </div>
            </HashRouter>
        )
    }
}

export default Sample
