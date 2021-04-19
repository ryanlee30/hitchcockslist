import '../App.css'
import { Component } from 'react';

export default class Unprotected extends Component {
    render() {
        return (
            <div>
                <div className="logo-banner">
                    <div className="logo-btn-front-page">Hitchcock's <br></br> List</div>
                </div>
                <div className="background-panel"></div>
                <div className="center-panel">
                    {this.props.children}
                </div>
            </div>
        )
    }
}