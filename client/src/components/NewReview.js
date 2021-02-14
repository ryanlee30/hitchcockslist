import '../App.css';
import { React, useLayoutEffect, useState } from 'react';
import SignOutFirstModal from './SignOutFirstModal';
import { useHistory, useLocation } from 'react-router-dom';
import { Form, Row, Col } from 'react-bootstrap'

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
  }, [location])

    return (
    <div>
      <div className="banner">
        <div style={{width: "185px", height: "232px", marginTop:"50px", border:"2px solid red"}}>
            1
        </div>
        <Form.File style={{width: "185px", marginTop:"10px"}} label="Film artwork" lang="en" onChange={e => setFilmArtwork(e.target.value)} custom/>
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
              <div className="text-editor">

              </div>
          </div>
      </div>
      <SignOutFirstModal show={modalShow} onHide={() => {setModalShow(false)}}/>
    </div>
    )
}