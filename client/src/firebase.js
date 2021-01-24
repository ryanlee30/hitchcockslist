import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

var firebaseConfig = {
    apiKey: "AIzaSyCLJAKp4OGwF7viAlxnX8i0cW7r8K9Pkww",
    authDomain: "hitchcockslist.firebaseapp.com",
    projectId: "hitchcockslist",
    storageBucket: "hitchcockslist.appspot.com",
    messagingSenderId: "366682107863",
    appId: "1:366682107863:web:91f28d80312d0efbb1e592",
    measurementId: "G-9XSDCRWYTR"
};
  
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();

export { auth, firebase };