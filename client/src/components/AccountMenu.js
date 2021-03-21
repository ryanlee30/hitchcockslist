import '../App.css'
import { Component } from 'react';
import expand_icon from '../imgs/account_menu_expand.png'
import onClickOutside from 'react-onclickoutside';
import EditProfileModal from './EditProfileModal';

class AccountMenu extends Component {
    constructor() {
        super();
        this.state = {
            showAccountMenu: false,
            showEditProfile: false,
        }
        this.switchAccountMenuState = this.switchAccountMenuState.bind(this);
        this.switchEditProfileModalState = this.switchEditProfileModalState.bind(this);
    }

    switchAccountMenuState() {
        this.setState({ showAccountMenu: !this.state.showAccountMenu });
    }

    switchEditProfileModalState() {
        this.setState({ showEditProfile: !this.state.showEditProfile });
    }

    handleClickOutside = () => {
        if (this.state.showAccountMenu) {
            this.switchAccountMenuState();
        }
        if (this.state.showEditProfile) {
            this.switchEditProfileModalState();
        }
    };

    render() {
        return (
            <div>
                { this.state.showEditProfile ?
                    <div className="edit-profile-modal">
                        <EditProfileModal uid={this.props.uid}/>
                    </div>
                : null}
                { this.state.showAccountMenu ?
                    <div className="account-menu-opened">
                        <div className="account-name">
                            {this.props.firstName} {this.props.lastName}&nbsp;
                            <img className="account-menu-expand" src={expand_icon} alt="account-menu-expand"/>
                        </div>
                        <div className="account-menu-options">
                            <p style={{cursor: "pointer", width: "80px"}} onClick={this.switchEditProfileModalState}>Edit Profile</p>
                        </div>
                    </div>:
                    <div className="account-menu">
                        <div className="account-name" onClick={this.switchAccountMenuState}>
                            {this.props.firstName} {this.props.lastName}&nbsp;
                            <img className="account-menu-expand" src={expand_icon} alt="account-menu-expand"/>
                        </div>
                    </div>
                }
            </div>
        )
    }
}

export default onClickOutside(AccountMenu);