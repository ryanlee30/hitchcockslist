import '../App.css';
import { React, useState, useLayoutEffect } from 'react';

export default function User() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  useLayoutEffect(() => {
    async function loadUserData() {
      const response = await fetch("https://us-central1-hitchcockslist.cloudfunctions.net/app/user-info", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("@token"),
        },
      });
      const userData = await response.json();
      setFirstName(userData.firstName);
      setLastName(userData.lastName);
    }
    loadUserData();
  }, []);

    return (
    <div>
      <div className="banner">
        <div className="account-menu">
          <div className="account-name">{firstName} {lastName}</div>
        </div>
      </div>
    </div>
    )
}