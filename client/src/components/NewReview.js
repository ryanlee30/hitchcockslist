import '../App.css';
import 'filepond/dist/filepond.min.css'
import { React, useEffect, useState } from 'react';
import { useHistory, useLocation, Link } from 'react-router-dom';
import { Form, Alert } from 'react-bootstrap';
import { auth } from '../firebase';
import Quill from 'quill';
import { FilePond, registerPlugin } from 'react-filepond';
import { firebase } from '../firebase';
import AccountMenu from './AccountMenu';
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import FilePondPluginFileEncode from 'filepond-plugin-file-encode';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import needle from 'needle';
const DEFAULT_ARTWORK = "https://i.imgur.com/TO6CEXb.png";

registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview, FilePondPluginFileEncode);

export default function NewReview() {
  const history = useHistory();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [uid, setUid] = useState("");
  const [imageFile, setImageFile] = useState([]);
  const [reviewEditor, setReviewEditor] = useState({});
  const [errorMsg, setErrorMsg] = useState("");
  const [showError, setShowError] = useState(false);
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({film_title: "", film_director: ""});
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    async function loadUserData(idToken) {
      let token = localStorage.getItem("@token");
      if (idToken) {
        token = idToken;
      }
      const options = {
        headers: {
          Authorization: "Bearer " + token,
        }
      }
      needle.get("https://us-west2-hitchcockslist.cloudfunctions.net/app/user-info", options, function(error, response) {
        if (!error && response.statusCode === 200) {
          const userData = response.body;
          if (userData.firstName) {
            if (userData.firstName.length > 12) {
              setFirstName(userData.firstName.charAt(0).concat("."));
            } else {
              setFirstName(userData.firstName);
            }
          }
          if (userData.lastName) {
            setLastName(userData.lastName.charAt(0).concat("."));
          }
          setShowAccountMenu(true);
          setUserEmail(userData.email);
          setUid(userData.uid);
        }
      });
    }

    function isAuthorized() {
      const options = {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("@token"),
        }
      }
      needle.get("https://us-west2-hitchcockslist.cloudfunctions.net/app/is-authorized", options, function(error, response) {
        if (error || response.statusCode === 401) {
          auth.onAuthStateChanged(function(user) {
            if (user) {
              auth.currentUser.getIdToken(true).then((idToken) => {
                if (idToken) {
                  loadUserData(idToken);
                  localStorage.setItem("@token", idToken)
                } else {
                  console.log("Firebase: Id Token not returned.")
                }
              });
            } else {
              console.log("Firebase: User cannot be found.")
            }
          });
        } else if (response.statusCode === 200) {
          loadUserData();
        }
      });
    }

    isAuthorized();

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
    
    let editor = new Quill("#text-editor", options);
    setReviewEditor(editor);
  }, [])

  function persistContent() {
    let editor = reviewEditor;
    let contents = {
      reviews: [
        { review: editor.getContents(),
          date: firebase.firestore.Timestamp.now().toDate().toString()
        }
      ]
    }

    let artworkUrl = DEFAULT_ARTWORK;

    if (imageFile[0]) {
      const data = {
        "image": imageFile[0].getFileEncodeBase64String()
      }
      const headers = {
        "Authorization": "Client-ID 2c37087269a1a68"
      }
      needle.post("https://api.imgur.com/3/image", data, { headers: headers, multipart: true }, function(err, resp, body) {
        if (body.status === 200) {
          artworkUrl = (body.data.link);
          const db = firebase.firestore();
          db.collection('films').add({
            title: form.film_title,
            director: form.film_director,
            artwork: artworkUrl,
            reviews: JSON.stringify(contents),
            uid: uid
          }).then(() => {
            history.push("/home");
          });
        } else {
          console.log(resp);
        }
      });
    } else {
      const db = firebase.firestore();
      db.collection('films').add({
        title: form.film_title,
        director: form.film_director,
        artwork: artworkUrl,
        reviews: JSON.stringify(contents),
        uid: uid
      }).then(() => {
        history.push("/home");
      });
    }
  }

  const setField = (field, value) => {
    setForm({
      ...form,
      [field]: value
    })
    if (!!errors[field]) {
      setErrors({
        ...errors,
        [field]: null
      })
    }
  }

  function validate() {
    const errs = {};
    if (!form.film_title.trim()) {
      errs.film_title = "A film title is required."
    }
    if (!form.film_director.trim()) {
      errs.film_director = "Put some respect on their name."
    }
    return errs;
  }

  function onSubmit() {
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
    }
    let validationErrorMsg = "";
    if (reviewEditor.getContents().ops.length === 1) {
      if (reviewEditor.getContents().ops[0].insert.trim() === "") {
        validationErrorMsg += "A review without a review? Try again."
      }
    }
    if (!form.film_title.trim() || !form.film_director.trim()) {
      if (!validationErrorMsg) {
        validationErrorMsg += "Check your fields and try again."
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
      { showAccountMenu ?
        <AccountMenu firstName={firstName} lastName={lastName} email={userEmail} uid={uid} history={history}/>
      : null }
      <div className="review-banner">
        <div className="artwork-label">
          Poster | Artwork
        </div>
        <FilePond
          className="artwork-upload"
          files={imageFile}
          onupdatefiles={setImageFile}
          allowMultiple={false}
          allowPaste={false}
          labelIdle='Drag & drop or <span class="filepond--label-action">Browse</span>'
        />
        {showError ?
          <Alert className="validation-error-msg" variant="danger" onClose={() => setShowError(false)}>
            {errorMsg}
          </Alert>
          : null}
      </div>
      <div className="review-body">
        <div className="review-console">
          <div className="review-console-header-container">
            <div className="review-console-header-head">
              <h5>About your review</h5>
              <Link to="#" className="redirect-btn-submit" style={{textDecoration: 'none', float: 'right'}} onClick={onSubmit}>Submit</Link>
            </div>
            <Form className="review-console-film-info">
              <Form.Group controlId="formFilmTitle">
                  <Form.Control type="text" placeholder="Film title" autoComplete="off" spellCheck="false" onChange={e => setField("film_title", e.target.value)} onKeyPress={validate} isInvalid={ !!errors.film_title }/>
                  <Form.Control.Feedback type="invalid">
                    { errors.film_title }
                  </Form.Control.Feedback>
              </Form.Group>
              <Form.Group controlId="formFilmDirector">
                  <Form.Control type="text" placeholder="Director" autoComplete="off" spellCheck="false" onChange={e => setField("film_director", e.target.value)} onKeyPress={validate} isInvalid={ !!errors.film_director }/>
                  <Form.Control.Feedback type="invalid">
                  { errors.film_director }
                  </Form.Control.Feedback>
              </Form.Group>
            </Form>
          </div>
          <div className="text-editor-container">
            <div id="text-editor">
            </div>
          </div>
        </div>
      </div>
    </div>
    )
}