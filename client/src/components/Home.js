import '../App.css';
import { React, useLayoutEffect, useState } from 'react';
import SignOutFirstModal from './SignOutFirstModal';
import { useHistory, useLocation, Link } from 'react-router-dom';
import new_review from '../imgs/new_review.png'
import needle from 'needle';

export default function Home() {
  const history = useHistory();
  const location = useLocation();
  const [modalShow, setModalShow] = useState(false);
  const [films, setFilms] = useState([]);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  useLayoutEffect(() => {
    if (location.state) {
      if (location.state.modalShow) {
        setModalShow(true);
      }
    }

    async function loadUserData() {
      const options = {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("@token"),
        }
      }
      needle.get("http://localhost:4000/user-info", options, function(error, response) {
        if (!error && response.statusCode === 200) {
          const userData = response.body;
          setFirstName(userData.firstName);
          if (userData.lastName) {
            setLastName(userData.lastName.charAt(0).concat("."));
          }
        }
      });
    }
    loadUserData();

    async function fetchFilms() {
      const options = {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("@token"),
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

    fetchFilms();
  }, [])

  function goToViewReview(filmId) {
    history.push("/review/v", { filmId: filmId, firstName: firstName, lastName: lastName });
  }

  return (
    <div>
      <div className="logo-banner">
        <div className="logo-btn-home">Hitchcock's <br></br> List</div>
      </div>
      <div className="home-banner">
        <div className="account-menu">
          <div className="account-name">{firstName} {lastName}</div>
        </div>
      </div>
      <div className="top-banner">
        <Link to="/review"><img className="new-review" src={new_review} alt="New review"/></Link>
      </div>
      <div className="catalogue">
        {films.map((film, i) => (
          <div className="film" key={i} onClick={() => {goToViewReview(film.filmId)}}>
              <div className="filmTitle"><p>{film.filmTitle}</p></div>
              <img className="filmArtwork" src={film.filmArtwork}/>
              <div className="filmDirector"><p>{film.filmDirector}</p></div>
          </div>))}
      </div>
      <SignOutFirstModal show={modalShow} onHide={() => {setModalShow(false); history.replace("/home", { modalShow: false })}}/>
    </div>
    )
}