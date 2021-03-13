import '../App.css';
import 'filepond/dist/filepond.min.css'
import { React, useLayoutEffect, useState } from 'react';
import { useHistory, useLocation, Link } from 'react-router-dom';
import { Form } from 'react-bootstrap';
import Quill from 'quill';
import { FilePond, registerPlugin } from 'react-filepond';
import { firebase } from '../firebase';
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import FilePondPluginFileEncode from 'filepond-plugin-file-encode';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import needle from 'needle';

registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview, FilePondPluginFileEncode);

export default function NewReview() {
  const history = useHistory();
  const location = useLocation();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [uid, setUid] = useState("");
  const [imageFile, setImageFile] = useState([]);
  const [filmTitle, setFilmTitle] = useState("");
  const [filmDirector, setFilmDirector] = useState("");
  const [filmArtwork, setFilmArtwork] = useState("");
  const [reviewEditor, setReviewEditor] = useState({});

  useLayoutEffect(() => {
    async function loadUserData() {
      const response = await fetch("http://localhost:4000/user-info", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("@token"),
        },
      });
      const userData = await response.json();
      setFirstName(userData.firstName);
      setLastName(userData.lastName);
      setUid(userData.uid);
    }
    loadUserData();

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

    // const data = {
    //   "image": imageFile[0].getFileEncodeBase64String()
    // }
    // const headers = {
    //   "Authorization": "Client-ID 2c37087269a1a68"
    // }
    // needle.post("https://api.imgur.com/3/image", data, { headers: headers, multipart: true }, function(err, resp, body) {
    //   if (body.status === 200) {
    //     setFilmArtwork(body.data.link);
    //   } else {
    //     console.log(resp);
    //   }
    // });

    const db = firebase.firestore();
    db.collection('films').add({
      title: filmTitle,
      director: filmDirector,
      artwork: filmArtwork,
      reviews: JSON.stringify(contents),
      uid: uid
    });
  }

    return (
    <div>
      <div className="review-banner">
        <div className="artwork-label">
          Poster | Artwork
        </div>
        <FilePond
          className="artwork-upload"
          files={imageFile}
          onupdatefiles={setImageFile}
          allowMultiple={false}
          labelIdle='Drag & drop or <span class="filepond--label-action">Browse</span>'
        />
        <div className="account-menu">
          <div className="account-name">{firstName} {lastName}</div>
        </div>
      </div>
      <div className="review-body">
        <div className="review-console">
          <div className="review-console-header-container">
            <div className="review-console-header-head">
              <h5>About your review</h5>
              <Link to="#" className="redirect-btn-submit" style={{textDecoration: 'none', float: 'right'}} onClick={persistContent}>Submit</Link>
            </div>
            <div className="review-console-film-info">
              <Form.Group controlId="formFilmTitle">
                  <Form.Control type="text" placeholder="Film title" onChange={e => setFilmTitle(e.target.value)}/>
              </Form.Group>
              <Form.Group controlId="formFilmDirector">
                  <Form.Control type="text" placeholder="Director" onChange={e => setFilmDirector(e.target.value)}/>
              </Form.Group>
            </div>
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