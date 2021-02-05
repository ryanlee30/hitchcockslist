import '../App.css'
import { Component } from 'react';

export default class Unprotected extends Component {
    render() {
        return (
            <div>
                <div className="left-panel">
                    <h1 className="frontPageTitle">Hitchcock's List</h1>
                </div>
                <div className="right-panel">
                    {this.props.children}
                </div>
            </div>
        )
    }
}