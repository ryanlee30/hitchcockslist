import '../App.css';
import 'filepond/dist/filepond.min.css'

import { React, useLayoutEffect, useState } from 'react';
import { useHistory, useLocation, Link } from 'react-router-dom';
import { Alert } from 'react-bootstrap';
import needle from 'needle';
import { firebase } from '../firebase';
import Reviews from '../controllers/Reviews';
import add_review from '../imgs/add_review.png'
import Quill from 'quill';

export default function ViewReview() {
  const history = useHistory();
  const location = useLocation();
  const [filmTitle, setFilmTitle] = useState("");
  const [filmDirector, setFilmDirector] = useState("");
  const [filmArtwork, setFilmArtwork] = useState("");
  const [filmReviews, setFilmReviews] = useState([]);
  const [filmReviewsRaw, setFilmReviewsRaw] = useState("");
  const [showEditor, setShowEditor] = useState(false);
  const [reviewEditor, setReviewEditor] = useState({});
  const [showAddBtn, setShowAddBtn] = useState(true);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [showError, setShowError] = useState(false);

  useLayoutEffect(() => {
    if (!location.state) {
      // create a bad request page
      history.push("/home");
    } else {
      setFirstName(location.state.firstName);
      setLastName(location.state.lastName);
  
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
            setFilmReviewsRaw(reviewData.reviews);
            setFilmReviews(new Reviews(reviewData.reviews).getReviews());
          }
        });
      }
      fetchReviews();
  
      if (showEditor) {
        let toolbarOptions = [
          [{ 'header': [3, 4, 5, 6, false] }],
          ['bold', 'italic', 'underline'],
          [{ 'align': [] }],
          [{ 'list': 'ordered'}, { 'list': 'bullet' }]
        ];
    
        let options = {
          theme: "snow",
          modules: {
            toolbar: toolbarOptions
          }
        };
        
        let editor = new Quill("#add-review-editor", options);
        setReviewEditor(editor);
      }
    }
  }, [showEditor])

  // called by both add and remove review fn
  function persistContent() {
    let editor = reviewEditor;
    let updateReviews = new Reviews(filmReviewsRaw);
    const db = firebase.firestore();
    db.collection('films').doc(location.state.filmId).update({
      reviews: updateReviews.addReview(editor.getContents())
    }).then(() => {
      setShowEditor(false);
      setShowAddBtn(true);
    });
  }

  function displayEditor() {
    setShowEditor(true);
    setShowAddBtn(false);
  }

  function hideEditor() {
    setShowEditor(false);
    setShowAddBtn(true);
  }

  function validate() {
    let validationErrorMsg = "";
    if (reviewEditor.getContents().ops.length === 1) {
      if (reviewEditor.getContents().ops[0].insert.trim() === "") {
        validationErrorMsg += "Review is empty"
      }
    }

    if (!validationErrorMsg) {
      persistContent();
      setShowError(false);
    } else {
      setErrorMsg(validationErrorMsg);
      setShowError(true);
    }
  }

    return (
    <div>
      <div className="logo-banner">
        <Link className="logo-btn" to="/home">Hitchcock's <br></br> List</Link>
      </div>
      <div className="review-banner">
        <div className="artwork-label">
          Poster | Artwork
          <br/>
          <img className="artwork-content" src={filmArtwork}/>
          {showError ?
            <Alert className="validation-error-msg" variant="danger" onClose={() => setShowError(false)} dismissible>
              {errorMsg}
            </Alert>
            : null}
        </div>
        <div className="account-menu">
          <div className="account-name">{firstName} {lastName}</div>
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
          { showEditor ?
            <div className ="text-editor-container">
              <div id="add-review-editor"></div>
              <div className="add-review-editor-btn-container">
                <div className="add-review-editor-btn" onClick={hideEditor}>Cancel</div>&nbsp;&nbsp;&nbsp;&nbsp;
                <div className="add-review-editor-btn" onClick={validate}>Submit</div>
              </div>
            </div>
            : null }
          { showAddBtn ?
            <div className="review-add-review" onClick={displayEditor}>
              <img className="plus-sign" src={add_review} alt="add_review"/>
            </div>
            : null}
        </div>
      </div>
    </div>
    )
}