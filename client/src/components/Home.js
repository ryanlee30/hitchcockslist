import '../App.css';
import { React, useLayoutEffect, useState } from 'react';
import { auth } from '../firebase';
import SignOutFirstModal from './SignOutFirstModal';
import { useHistory, useLocation, Link } from 'react-router-dom';
import new_review from '../imgs/new_review.png'
import needle from 'needle';
import AccountMenu from './AccountMenu';
import ProfilePicBuilder from './ProfilePicBuilder';

export default function Home() {
  const history = useHistory();
  const location = useLocation();
  const [modalShow, setModalShow] = useState(false);
  const [films, setFilms] = useState([]);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [uid, setUid] = useState("");

  useLayoutEffect(() => {
    if (location.state) {
      if (location.state.modalShow) {
        setModalShow(true);
      }
    }

    function loadUserData(idToken) {
      let token = localStorage.getItem("@token");
      if (idToken) {
        token = idToken;
      }
      const options = {
        headers: {
          Authorization: "Bearer " + token,
        }
      }
      needle.get("http://localhost:4000/user-info", options, function(error, response) {
        if (!error && response.statusCode === 200) {
          const userData = response.body;
          setFirstName(userData.firstName);
          if (userData.lastName) {
            setLastName(userData.lastName.charAt(0).concat("."));
          }
          setUid(userData.uid);
        }
      });
    }

    function fetchFilms(idToken) {
      let token = localStorage.getItem("@token");
      if (idToken) {
        token = idToken;
      }
      const options = {
        headers: {
          Authorization: "Bearer " + token,
        }
      }
      needle.get("http://localhost:4000/fetch-films", options, function(error, response) { 
        if (!error && response.statusCode === 200) {
          const filmsData = response.body;
          if (filmsData) {
            setFilms(filmsData.films);
          }
        }
      });
    }

    function isAuthorized() {
      const options = {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("@token"),
        }
      }
      needle.get("http://localhost:4000/is-authorized", options, function(error, response) {
        if (error || response.statusCode === 401) {
          auth.onAuthStateChanged(function(user) {
            if (user) {
              auth.currentUser.getIdToken(true).then((idToken) => {
                if (idToken) {
                  loadUserData(idToken);
                  fetchFilms(idToken);
                  localStorage.setItem("@token", idToken);
                } else {
                  console.log("Firebase: Id Token not returned.")
                }
              });
            } else {
              console.log("Firebase: User cannot be found.")
            }
          });
        } else if (response.statusCode === 200) {
          loadUserData();
          fetchFilms();
        }
      });
    }

    isAuthorized();
  }, [])

  function goToViewReview(filmId) {
    history.push("/review/v", { filmId: filmId, firstName: firstName, lastName: lastName });
  }

  return (
    <div>
      <div className="logo-banner">
        <div className="logo-btn-home">Hitchcock's <br></br> List</div>
      </div>
      <AccountMenu firstName={firstName} lastName={lastName} uid={uid}/>
      <div className="top-banner">
        <Link to="/review"><img className="new-review" src={new_review} alt="New review"/></Link>
      </div>
      <div className="catalogue">
        {films ?
          films.map((film, i) => (
            <div className="film" key={i} onClick={() => {goToViewReview(film.filmId)}}>
                <div className="filmTitle"><p>{film.filmTitle}</p></div>
                <img className="filmArtwork" src={film.filmArtwork}/>
                <div className="filmDirector"><p>{film.filmDirector}</p></div>
            </div>))
          : null
        }
      </div>
      <SignOutFirstModal show={modalShow} onHide={() => {setModalShow(false); history.replace("/home", { modalShow: false })}}/>
    </div>
    )
}