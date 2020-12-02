import React, { Component } from 'react';
import './NavBar.css'
import { Link, Route, Switch } from 'react-router-dom'

class NavBar extends Component {
    render() {
        return (
            <div className="navigationBar">
                <h3>Navigation</h3>
                <nav className="navigationBarList">
                    <Link to="/" className="navItem">Time tracker</Link>
                    {/*<Link to="/spread-js" className="navItem">Spread JS</Link>*/}
                    {/*<Link to="/zing-grid" className="navItem">Zing Grid</Link>*/}
                    {/*<Link to="/wijmo-grid" className="navItem">Wijmo Grid</Link>*/}
                    {/*<Link to="/tree-grid" className="navItem">Tree Grid</Link>*/}
                </nav>
            </div>
        )
    }
}

export default NavBar
