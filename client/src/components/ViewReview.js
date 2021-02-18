import '../App.css';
import 'filepond/dist/filepond.min.css'

import { React, useLayoutEffect, useState } from 'react';
import SignOutFirstModal from './SignOutFirstModal';
import { useHistory, useLocation, Link } from 'react-router-dom';
import { Form } from 'react-bootstrap';
import Quill from 'quill';

export default function ViewReview() {
  const history = useHistory();
  const location = useLocation();
  const [modalShow, setModalShow] = useState(false);
  const [filmTitle, setFilmTitle] = useState("");
  const [filmDirector, setFilmDirector] = useState("");
  const [filmArtwork, setFilmArtwork] = useState("");
  const [reviewContent, setReviewContent] = useState({});
  const [reviewEditor, setReviewEditor] = useState({});

  useLayoutEffect(() => {
    if (location.state !== undefined) {
      setModalShow(location.state.modalShow);
    } else {
      setModalShow(false);
    }

    var toolbarOptions = [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline'],
      [{ 'align': [] }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }]
    ];

    var options = {
      theme: "snow",
      modules: {
        toolbar: toolbarOptions
      }
    };
    
    var editor = new Quill("#text-editor", options);
    setReviewEditor(editor);
  }, [location])

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
              <h5>by {filmDirector}</h5>
            </div>
            <div className="review-console-film-info">
            </div>
          </div>
        </div>
      </div>
      <SignOutFirstModal show={modalShow} onHide={() => {setModalShow(false)}}/>
    </div>
    )
}