import { React, useLayoutEffect, useState } from 'react';
import SignOutFirstModal from './SignOutFirstModal';
import { useHistory, useLocation } from 'react-router-dom';

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
      <p>Home</p>
      <SignOutFirstModal show={modalShow} onHide={() => {setModalShow(false); history.replace("/home")}}/>
    </div>
    )
}