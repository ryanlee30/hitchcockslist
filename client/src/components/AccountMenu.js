import '../App.css'
import { Component } from 'react';
import expand_icon from '../imgs/account_menu_expand.png'
import onClickOutside from "react-onclickoutside";

class AccountMenu extends Component {
    constructor() {
        super();
        this.state = {
            accountMenuOpened: false,
        }
        this.switchAccountMenuState = this.switchAccountMenuState.bind(this);
    }

    switchAccountMenuState() {
        this.setState({ accountMenuOpened: !this.state.accountMenuOpened });
    }

    handleClickOutside = () => {
        if (this.state.accountMenuOpened) {
            this.switchAccountMenuState();
        }
    };

    render() {
        return (
            <div>
                { !this.state.accountMenuOpened ?
                    <div className="account-menu">
                        <div className="account-name">
                            {this.props.firstName} {this.props.lastName}&nbsp;
                            <img className="account-menu-expand" src={expand_icon} alt="account-menu-expand" onClick={this.switchAccountMenuState}/>
                        </div>
                    </div>:
                    <div className="account-menu-opened">
                        <div className="account-name">
                            {this.props.firstName} {this.props.lastName}&nbsp;
                            <img className="account-menu-expand" src={expand_icon} alt="account-menu-expand" onClick={this.switchAccountMenuState}/>
                        </div>
                        <div className="account-menu-options">
                            <p>Change Profile Picture</p>
                            <p>Change Name</p>
                            <p>Update Email</p>
                            <p>Update Password</p>
                        </div>
                    </div>
                }
            </div>
        )
    }
}

export default onClickOutside(AccountMenu);