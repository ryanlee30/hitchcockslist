import { Modal, Button } from 'react-bootstrap';

export default function SignOutFirstModal(props) {
    return (
      <Modal
        {...props}
        size="sm"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Error
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p style={{textAlign: 'center'}}>
            Oops, you're already logged in. Please sign out first.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={props.onHide}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
  }