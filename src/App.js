import React, { Component } from 'react';
import './App.css'
import NavBar from './components/NavBar'

import TimeTracker from './views/TimeTracker'
import Companies from './views/Companies'
import HighchartsGant from './views/HighchartGant'
import TreeGridGantt from './views/TreeGridGantt'
import { HashRouter, Route, Switch } from 'react-router-dom'


class Sample extends Component {
    render() {
        return (
            <HashRouter>
                <NavBar/>
                <div className="views-container">
                    <Switch>
                        <Route path="/" exact>
                            <TimeTracker/>
                        </Route>
    
                        <Route path="/companies">
                            <Companies/>
                        </Route>
    
                        <Route path="/highcharts-gant">
                            <HighchartsGant/>
                        </Route>
    
                        <Route path="/tree-grid-gant">
                            <TreeGridGantt/>
                        </Route>
                    </Switch>
                </div>
            </HashRouter>
        )
    }
}

export default Sample
