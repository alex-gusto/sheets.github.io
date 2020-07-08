import React, { Component } from 'react';
import './NavBar.css'
import { Link, Route, Switch } from 'react-router-dom'

class NavBar extends Component {
    render() {
        return (
            <div className="navigationBar">
                <h3>Navigation</h3>
                <nav className="navigationBarList">
                    <Link to="/" className="navItem">Handsontable</Link>
                    <Link to="/spread-js" className="navItem">Spread JS</Link>
                    <Link to="/zing-grid" className="navItem">Zing Grid</Link>
                </nav>

                <div className="features">
                    <Switch>
                        <Route exact path="/">
                            <h4>Handsontable</h4>
                            <p className="features-content">
                                Supports most of the features. Customizable, open-source, good support community, and not bad DOCs.
                                Bad performance.
                            </p>

                            <ul className="features-list">
                                <li>Copy paste subtable from excel <span className="text-green">+</span></li>
                                <li>Nested rows <span className="text-green">+</span></li>
                                <li>Fixed columns rows <span className="text-green">+</span></li>
                                <li>Remember collapse expand state <span className="text-red">-</span></li>
                                <li>Styling, Read only <span className="text-green">+</span></li>
                                <li>Placeholders <span className="text-green">+</span></li>
                                <li>Tool tips <span className="text-green">+</span></li>
                                <li>PDF export <span className="text-blue">?</span></li>
                                <li>Excel export <span className="text-red">-</span></li>
                                <li>Filtering (eg. for user search, partial sums, pdf export) <span className="text-green">+</span></li>
                                <li>Rotated cells <span className="text-green">+</span></li>
                                <li>Spanned cells <span className="text-green">+</span></li>
                                <li>Validation <span className="text-green">+</span></li>
                                <li>Sums (light weight formulas) <span className="text-green">+</span></li>
                                <li>Sub table selection <span className="text-green">+</span></li>
                                <li>Customisable context menus <span className="text-green">+</span></li>
                                <li>Moving one ore several rows <span className="text-green">+</span></li>
                                <li>Copy cut delete operations <span className="text-green">+</span></li>
                            </ul>
                        </Route>
                        <Route path="/spread-js">
                            <h4>SpreadJS</h4>
                            <p className="features-content">
                                Many features need to be created from scratch. It is Excel in WEB and it works like real excel. Formulas work very well and fast. No need to change DataLayer from Handsontable. Good performance, wide API.
                            </p>

                            <ul className="features-list">
                                <li>Copy paste subtable from excel <span className="text-green">+</span></li>
                                <li>Nested rows <span className="text-green">+</span></li>
                                <li>Fixed columns rows <span className="text-green">+</span></li>
                                <li>Remember collapse expand state <span className="text-blue">?</span></li>
                                <li>Styling, Read only <span className="text-green">+</span></li>
                                <li>Placeholders <span className="text-red">-</span></li>
                                <li>Tool tips <span className="text-blue">?</span></li>
                                <li>PDF export <span className="text-blue">?</span></li>
                                <li>Excel export <span className="text-green">+</span></li>
                                <li>Filtering (eg. for user search, partial sums, pdf export) <span className="text-green">+</span></li>
                                <li>Rotated cells <span className="text-blue">?</span></li>
                                <li>Spanned cells <span className="text-green">+</span></li>
                                <li>Validation <span className="text-green">+</span></li>
                                <li>Sums (light weight formulas) <span className="text-green">+</span></li>
                                <li>Sub table selection <span className="text-green">+</span></li>
                                <li>Customisable context menus <span className="text-green">+</span></li>
                                <li>Moving one ore several rows <span className="text-green">+</span></li>
                                <li>Copy cut delete operations <span className="text-green">+</span></li>
                            </ul>
                        </Route>
                        <Route path="/zing-grid">
                            <h4>ZingGrid</h4>

                            <ul className="features-list">
                                <li>Copy paste subtable from excel <span className="text-red">-</span></li>
                                <li>Nested rows <span className="text-red">-</span></li>
                                <li>Fixed columns rows <span className="text-red">-</span></li>
                                <li>Remember collapse expand state <span className="text-blue">?</span></li>
                                <li>Styling, Read only <span className="text-green">+</span></li>
                                <li>Placeholders <span className="text-green">+</span></li>
                                <li>Tool tips <span className="text-blue">?</span></li>
                                <li>PDF export <span className="text-blue">?</span></li>
                                <li>Excel export <span className="text-green">+</span></li>
                                <li>Filtering (eg. for user search, partial sums, pdf export) <span className="text-green">+</span></li>
                                <li>Rotated cells <span className="text-blue">?</span></li>
                                <li>Spanned cells <span className="text-green">+</span></li>
                                <li>Validation <span className="text-red">-</span></li>
                                <li>Sums (light weight formulas) <span className="text-red">-</span></li>
                                <li>Sub table selection <span className="text-green">+</span></li>
                                <li>Customisable context menus <span className="text-green">+</span></li>
                                <li>Moving one ore several rows <span className="text-green">+</span></li>
                                <li>Copy cut delete operations <span className="text-red">-</span></li>
                            </ul>
                        </Route>
                    </Switch>
                </div>
            </div>
        )
    }
}

export default NavBar
