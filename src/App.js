import React, { Component } from 'react';
import './App.css'
import NavBar from './components/NavBar'
import Handsontable from './views/Handsontable'
import SpreadJS from './views/SpreadJS'
import ZingGrid from './views/ZingGrid'
import { HashRouter, Route, Switch } from 'react-router-dom'


class Sample extends Component {
    render() {
        return (
            <div className='app-container'>
                <Header/>
                <HashRouter>
                    <NavBar/>
                    <div className="views-container">
                        <Switch>
                            <Route exact path="/">
                                <Handsontable/>
                            </Route>
                            <Route path="/spread-js">
                                <SpreadJS/>
                            </Route>
                            <Route path="/zing-grid">
                                <ZingGrid/>
                            </Route>
                        </Switch>
                    </div>
                </HashRouter>
                <Footer/>
            </div>
        )
    }
}

class Header extends Component {
    render() {
        return (
            <div className="app-header">
                <span className="header-text">Sheets test</span>
            </div>
        )
    }
}

class Footer extends Component {
    render() {
        return (
            <div className="app-footer">
            </div>
        )
    }
}

export default Sample
