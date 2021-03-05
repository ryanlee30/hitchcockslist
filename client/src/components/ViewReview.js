import '../App.css';
import 'filepond/dist/filepond.min.css'

import { React, useLayoutEffect, useState } from 'react';
import SignOutFirstModal from './SignOutFirstModal';
import { useHistory, useLocation, Link } from 'react-router-dom';
import { Form } from 'react-bootstrap';
import Quill from 'quill';
import needle from 'needle';

export default function ViewReview() {
  const history = useHistory();
  const location = useLocation();
  const [modalShow, setModalShow] = useState(false);
  const [filmTitle, setFilmTitle] = useState("");
  const [filmDirector, setFilmDirector] = useState("");
  const [filmArtwork, setFilmArtwork] = useState("");

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
    
    var editor = new Quill("#review-block", options);

    async function fetchReviews() {
      needle.get("http://localhost:4000/test-review?uid=123456789&filmTitle=Memento", function(error, response) {
        if (!error && response.statusCode === 200) {
          console.log(response.body);
          const reviewData = response.body;
          setFilmTitle(reviewData.filmTitle);
          setFilmDirector(reviewData.filmDirector);
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
          <div id="review-block"></div>
        </div>
      </div>
      <SignOutFirstModal show={modalShow} onHide={() => {setModalShow(false)}}/>
    </div>
    )
}