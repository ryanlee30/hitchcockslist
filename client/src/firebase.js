import firebase from "firebase/app";
import "firebase/auth";

const firebase_API_KEY = process.env.REACT_APP_FIREBASE_API_KEY;

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

var firebaseConfig = {
    apiKey: firebase_API_KEY,
    authDomain: "hitchcockslist.firebaseapp.com",
    projectId: "hitchcockslist",
    storageBucket: "hitchcockslist.appspot.com",
    messagingSenderId: "366682107863",
    appId: "1:366682107863:web:91f28d80312d0efbb1e592",
    measurementId: "G-9XSDCRWYTR"
};
  
firebase.initializeApp(firebaseConfig);

export default firebase;