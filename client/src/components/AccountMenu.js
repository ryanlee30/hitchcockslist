import '../App.css'
import { Component } from 'react';
import { auth } from '../firebase';
import expand_icon from '../imgs/account_menu_expand.png'
import onClickOutside from 'react-onclickoutside';
import EditProfileModal from './EditProfileModal';

class AccountMenu extends Component {
    constructor() {
        super();
        this.state = {
            expandAccountMenu: false,
            showEditProfile: false,
        }
        this.switchAccountMenuState = this.switchAccountMenuState.bind(this);
        this.switchEditProfileModalState = this.switchEditProfileModalState.bind(this);
        this.handleLogOut = this.handleLogOut.bind(this);
    }

    switchAccountMenuState() {
        this.setState({ expandAccountMenu: !this.state.expandAccountMenu });
    }

    switchEditProfileModalState() {
        this.setState({ showEditProfile: !this.state.showEditProfile });
    }

    handleClickOutside = () => {
        if (this.state.expandAccountMenu) {
            this.switchAccountMenuState();
        }
        if (this.state.showEditProfile) {
            this.switchEditProfileModalState();
        }
    };

    handleLogOut = () => {
        auth.signOut().then(() => {
            let history = this.props.history;
            localStorage.removeItem("@token");
            setTimeout(() => {
                history.push("/login");
            }, 500);
        }).catch((error) => {
            console.log(error);
        });
    }

    render() {
        return (
            <div>
                { this.state.showEditProfile ?
                    <div className="edit-profile-modal">
                        <EditProfileModal firstName={this.props.firstName} lastName={this.props.lastName} email={this.props.email} uid={this.props.uid} history={this.props.history}/>
                    </div>
                : null }
                { this.state.expandAccountMenu ?
                    <div className="account-menu-opened">
                        <div className="account-name">
                            {this.props.firstName} {this.props.lastName}&nbsp;
                            <img className="account-menu-expand" src={expand_icon} alt="account-menu-expand"/>
                        </div>
                        <div className="account-menu-options">
                            <p style={{cursor: "pointer", width: "80px"}} onClick={this.switchEditProfileModalState}>Edit Profile</p>
                            <p style={{cursor: "pointer", width: "60px"}} onClick={this.handleLogOut}>Log out</p>
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