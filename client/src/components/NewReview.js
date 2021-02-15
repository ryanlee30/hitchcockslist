import '../App.css';
import { React, useLayoutEffect, useState } from 'react';
import SignOutFirstModal from './SignOutFirstModal';
import { useHistory, useLocation } from 'react-router-dom';
import { Form, Row, Col } from 'react-bootstrap';
import new_review from '../imgs/new_review.png';
import Quill from 'quill';

export default function NewReview() {
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

    var toolbarOptions = [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      [{ 'font': [] }],
      ['bold', 'italic', 'underline'],
      [{ 'align': [] }],
      [{ 'indent': '+1' }, { 'indent': '-1'}],
      ['blockquote'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['clean']
    ];

    var options = {
      theme: "snow",
      modules: {
        toolbar: toolbarOptions
      }
    };
  
    var editor = new Quill("#text-editor", options);
  }, [location])

    return (
    <div>
      <div className="banner">
        <div className="artwork-label">
          Poster | Artwork
        </div>
        <input type="file" id="uploadFilmArtwork" onChange={e => setFilmArtwork(e.target.value)} hidden/>
        <label for="uploadFilmArtwork" className="uploadFilmArtworkLabel">
          <img src={new_review} className="now-showing"></img>
          <div style={{width: "185px", height: "232px", backgroundColor: 'blue', position: "absolute", zIndex: 10, marginLeft: "11px", marginTop: "10px"}} hidden></div>
        </label>
        <div className="account-menu">
          <div className="account-name">Place Holder</div>
        </div>
      </div>
      <div className="review-body">
        <div className="review-console">
          <div className="review-console-header-container">
            <h5>About your review</h5>
            <div className="review-console-film-info">
              <Form.Group controlId="formFilmInfo">
                <Row>
                  <Col>
                    <Form.Control type="text" placeholder="Film title" onChange={e => setFilmTitle(e.target.value)}/>
                  </Col>
                  <Col>
                    <Form.Control type="text" placeholder="Director" onChange={e => setFilmDirector(e.target.value)}/>
                  </Col>
                </Row>
              </Form.Group>
            </div>
          </div>
          <div id="text-editor">
          </div>
        </div>
      </div>
      <SignOutFirstModal show={modalShow} onHide={() => {setModalShow(false)}}/>
    </div>
    )
}