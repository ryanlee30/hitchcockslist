import '../App.css';
import 'filepond/dist/filepond.min.css'

import { React, useLayoutEffect, useState } from 'react';
import SignOutFirstModal from './SignOutFirstModal';
import { useHistory, useLocation, Link } from 'react-router-dom';
import { Form, Row, Col } from 'react-bootstrap';
import Quill from 'quill';
import { FilePond, registerPlugin } from 'react-filepond';

import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation'
import FilePondPluginImagePreview from 'filepond-plugin-image-preview'
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css'

export default function NewReview() {
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

  function logContent() {
    var editor = reviewEditor;
    var contentString = JSON.stringify(editor.getContents());
    console.log(contentString);
  }

  registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

    return (
    <div>
      <div className="review-banner">
        <div className="artwork-label">
          Poster | Artwork
        </div>
        <FilePond
          className="artwork-upload"
          files={filmArtwork}
          onupdatefiles={setFilmArtwork}
          allowMultiple={false}
          labelIdle='Drag & drop or <span class="filepond--label-action">Browse</span>'
        />
        <div className="account-menu">
          <div className="account-name">Place Holder</div>
        </div>
      </div>
      <div className="review-body">
        <div className="review-console">
          <div className="review-console-header-container">
            <div className="review-console-header-head">
              <h5>About your review</h5>
              <Link to="#" className="redirect-btn-submit" style={{textDecoration: 'none', float: 'right'}} onClick={logContent}>Submit</Link>
            </div>
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