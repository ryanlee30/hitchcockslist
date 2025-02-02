import '../App.css';
import { React, useEffect, useState } from 'react';
import { auth } from '../firebase';
import SignOutFirstModal from './SignOutFirstModal';
import { useHistory, useLocation, Link } from 'react-router-dom';
import new_review from '../imgs/new_review.png'
import films_loading from '../imgs/films_loading.png';
import needle from 'needle';
import AccountMenu from './AccountMenu';

export default function Home() {
  const history = useHistory();
  const location = useLocation();
  const [modalShow, setModalShow] = useState(false);
  const [films, setFilms] = useState([]);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [uid, setUid] = useState("");
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const [showFilmsLoading, setShowFilmsLoading] = useState(true);
  const [showFilmsEmptyMsg, setShowFilmsEmptyMsg] = useState(false);

  useEffect(() => {
    if (location.state) {
      if (location.state.modalShow) {
        setModalShow(true);
      }
    }

    const loadUserData = (idToken) => {
      let token = localStorage.getItem("@token");
      if (idToken) {
        token = idToken;
      }
      const options = {
        headers: {
          Authorization: "Bearer " + token,
        }
      }
      needle.get("https://us-west2-hitchcockslist.cloudfunctions.net/app/user-info", options, (error, response) => {
        if (!error && response.statusCode === 200) {
          const userData = response.body;
          if (userData.firstName) {
            if (userData.firstName.length > 12) {
              setFirstName(userData.firstName.charAt(0).concat("."));
            } else {
              setFirstName(userData.firstName);
            }
          }
          if (userData.lastName) {
            setLastName(userData.lastName.charAt(0).concat("."));
          }
          setShowAccountMenu(true);
          setUserEmail(userData.email);
          setUid(userData.uid);
        }
      });
    }

    const fetchFilms = (idToken) => {
      let token = localStorage.getItem("@token");
      if (idToken) {
        token = idToken;
      }
      const options = {
        headers: {
          Authorization: "Bearer " + token,
        }
      }
      needle.get("https://us-west2-hitchcockslist.cloudfunctions.net/app/fetch-films", options, (error, response) => { 
        if (!error && response.statusCode === 200) {
          const filmsData = response.body;
          if (filmsData) {
            setShowFilmsLoading(false);
            setFilms(filmsData.films);
          } else {
            setShowFilmsLoading(false);
            setShowFilmsEmptyMsg(true);
          }
        }
      });
    }

    const isAuthorized = () => {
      const options = {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("@token"),
        }
      }
      needle.get("https://us-west2-hitchcockslist.cloudfunctions.net/app/is-authorized", options, (error, response) => {
        if (error || response.statusCode === 401) {
          auth.onAuthStateChanged((user) => {
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
  }, [location.state]);

  const goToViewReview = (filmId) => {
    history.push("/review/v", { filmId: filmId, firstName: firstName, lastName: lastName, email: userEmail, uid: uid });
  }

  return (
    <div>
      <div className="logo-banner">
        <div className="logo-btn-home">Hitchcock's <br></br> List</div>
      </div>
      { showAccountMenu ?
        <AccountMenu firstName={firstName} lastName={lastName} email={userEmail} uid={uid} history={history}/>
        : null }
      <div className="top-banner">
        <Link to="/review"><img className="new-review" src={new_review} alt="New review"/></Link>
      </div>
      { showFilmsLoading ?
        <div className="films-loading">
          <img style={{width: "135px"}} src={films_loading} alt="Film"/>
        </div> :
        <div className="catalogue">
          { showFilmsEmptyMsg ?
            <p className="film-empty" style={{color: "#8F8F8F"}}>No films have been reviewed so far...</p> :
            films.map((film, i) => (
              <div className="film" key={i} onClick={() => {goToViewReview(film.filmId)}}>
                  <div className="filmTitle"><p>{film.filmTitle}</p></div>
                  <img className="filmArtwork" src={film.filmArtwork} alt="Film artwork"/>
                  <div className="filmDirector"><p style={{margin: 0}}>{film.filmDirector}</p></div>
              </div>)) }
        </div>
      }
      <SignOutFirstModal show={modalShow} onHide={() => {setModalShow(false); history.replace("/home", { modalShow: false })}}/>
    </div>
    )
}