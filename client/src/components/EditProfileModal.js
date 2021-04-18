import '../App.css'
import { Component } from 'react';
import ChangeProfile from './ChangeProfile';
import ChangeAccountSecurity from './ChangeAccountSecurity';

class EditProfileModal extends Component {
    constructor() {
        super();
        this.state = {
            selectedProfileOption: "profile",
        }
    }

    profileChangeContent() {
        switch (this.state.selectedProfileOption) {
            case "account-security":
                return <ChangeAccountSecurity />;
            default:
                return <ChangeProfile uid={this.props.uid} history={this.props.history} />;
        }
    }

    render() {
        return (
            <div>
                <div className="profile-change-options">
                <p style={{cursor: "pointer", width: "45px", fontSize: "17px", color: "#DEDEDE"}} onClick={() => this.setState({ selectedProfileOption: "profile" })}>Profile</p>
                <p style={{cursor: "pointer", width: "120px", fontSize: "17px", color: "#DEDEDE"}} onClick={() => this.setState({ selectedProfileOption: "account-security" })}>Account Security</p>
                </div>
                <div className="profile-change-user-info">
                    {this.props.firstName} {this.props.lastName}<br></br>
                    {this.props.email}
                </div>
                <div className="profile-change-content">
                    {this.profileChangeContent()}
                </div>
            </div>
        )
    }
}

export default EditProfileModal;