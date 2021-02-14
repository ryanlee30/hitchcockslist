import '../App.css';
import { React, useLayoutEffect, useState } from 'react';
import SignOutFirstModal from './SignOutFirstModal';
import { useHistory, useLocation, Link } from 'react-router-dom';
import new_review from '../imgs/new_review.png'

export default function Home() {
  const history = useHistory();
  const location = useLocation();
  const [modalShow, setModalShow] = useState(false);

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
        <div className="account-menu">
          <div className="account-name">Place Holder</div>
        </div>
      </div>
      <div className="top-banner">
        <Link to="/review"><img className="new-review" src={new_review} alt="New review"/></Link>
      </div>
      <div className="catalogue">
        <div className="movie">
          1
        </div>
      </div>
      <SignOutFirstModal show={modalShow} onHide={() => {setModalShow(false)}}/>
    </div>
    )
}