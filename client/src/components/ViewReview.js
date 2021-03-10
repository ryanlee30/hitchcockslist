import '../App.css';
import 'filepond/dist/filepond.min.css'

import { React, useLayoutEffect, useState } from 'react';
import { useHistory, useLocation, Link } from 'react-router-dom';
import needle from 'needle';
import { firebase } from '../firebase';
import Reviews from '../controllers/Reviews';

export default function ViewReview() {
  const history = useHistory();
  const location = useLocation();
  const [filmTitle, setFilmTitle] = useState("");
  const [filmDirector, setFilmDirector] = useState("");
  const [filmArtwork, setFilmArtwork] = useState("");
  const [filmReviews, setFilmReviews] = useState([]);
  const [filmId, setFilmId] = useState("");

  useLayoutEffect(() => {
    async function fetchReviews() {
      const options = {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("@token"),
        }
      }
      needle.get("http://localhost:4000/fetch-reviews?filmId="+ location.state.filmId, options, function(error, response) {
        if (!error && response.statusCode === 200) {
          const reviewData = response.body;
          setFilmTitle(reviewData.filmTitle);
          setFilmDirector(reviewData.filmDirector);
          setFilmArtwork(reviewData.filmArtwork);
          setFilmReviews(new Reviews(reviewData.reviews).getReviews());
        }
      });
    }

    if (location.state) {
      fetchReviews();
    }
  }, [])

  // called by both add and remove review fn
  function persistContent() {
    const db = firebase.firestore();
    db.collection('films').doc('PnzvUAvgdctHFouQjWfe').update({
      reviews: "some shit here"
    });
  }

    return (
    <div>
      <div className="review-banner">
        <div className="artwork-label">
          Poster | Artwork
          <br/>
          <img className="artwork-content" src={filmArtwork}/>
        </div>
        <div className="account-menu">
          <div className="account-name">Place Holder</div>
        </div>
      </div>
      <div className="review-body">
        <div className="review-console">
          <div className="review-console-header-container">
            <div className="review-console-header-head">
              <h4>{filmTitle}</h4>
              <h5>by&nbsp;&nbsp;{filmDirector}</h5>
            </div>
          </div>
          <div className="review-reviews">
            {filmReviews.map((review, i) => (
              <div className="review-review" key={i}>
                  <div className="content" dangerouslySetInnerHTML={{ __html: review.review }} />
                  <div className="date"><p>{review.date}</p></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
    )
}