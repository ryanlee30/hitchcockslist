import '../App.css';
import 'filepond/dist/filepond.min.css'

import { React, useLayoutEffect, useState } from 'react';
import SignOutFirstModal from './SignOutFirstModal';
import { useHistory, useLocation, Link } from 'react-router-dom';
import { Form } from 'react-bootstrap';
import Quill from 'quill';
import needle from 'needle';
import { firebase } from '../firebase';
import date from 'date-and-time';

export default function ViewReview() {
  const history = useHistory();
  const location = useLocation();
  const [modalShow, setModalShow] = useState(false);
  const [filmTitle, setFilmTitle] = useState("");
  const [filmDirector, setFilmDirector] = useState("");
  const [filmArtwork, setFilmArtwork] = useState("");
  const [reviewDate, setReviewDate] = useState("");

  useLayoutEffect(() => {
    if (location.state !== undefined) {
      setModalShow(location.state.modalShow);
    } else {
      setModalShow(false);
    }

    var options = {
      theme: "snow",
      readOnly: true,
      modules: {
        toolbar: false
      }
    };
    
    var editor = new Quill("#review-content", options);

    async function fetchReviews() {
      needle.get("http://localhost:4000/fetch-review?uid=123456789&filmTitle=Parasite", function(error, response) {
        if (!error && response.statusCode === 200) {
          const reviewData = response.body;
          setFilmTitle(reviewData.filmTitle);
          setFilmDirector(reviewData.filmDirector);
          // here we're going to have a list of review class objects
          // get rid of setReviewDate when above is finished
          setReviewDate(date.format(new Date(reviewData.reviewDate), "MMMM DD, YYYY"));
          editor.setContents(JSON.parse(reviewData.content).ops);
        }
      });
    }

    fetchReviews();
  }, [])

    return (
    <div>
      <div className="review-banner">
        <div className="artwork-label">
          Poster | Artwork
        </div>
        <div className="account-menu">
          <div className="account-name">Place Holder</div>
        </div>
      </div>
      <div className="review-body">
        <div className="review-console">
          <div className="review-console-header-container">
            <div className="review-console-header-head">
              <h5>{filmTitle}</h5>
              <h5>by&nbsp;&nbsp;{filmDirector}</h5>
            </div>
          </div>
          <div className="review-reviews">
            <div id="review-content"></div>
            <div className="review-date"><p>{reviewDate}</p></div>
          </div>
        </div>
      </div>
      <SignOutFirstModal show={modalShow} onHide={() => {setModalShow(false)}}/>
    </div>
    )
}