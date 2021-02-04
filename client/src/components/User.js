import { React, useState, useEffect } from 'react';

export default function User() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  useEffect(() => {
    async function loadUserData() {
      const response = await fetch("http://localhost:4000/user-info", {
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
      <p>{firstName}</p>
      <p>{lastName}</p>
    </div>
    )
}