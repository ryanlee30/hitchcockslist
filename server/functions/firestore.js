const admin = require("./firebase/admin");
const db = admin.firestore();

const getUserInfo = async (uid) => {
    const usersRef = db.collection("users");
    const userRef = await usersRef.where("uid", "==", uid).get();
    if (userRef.size !== 0) {
        return { firstName: userRef.docs[0].data().firstName, lastName: userRef.docs[0].data().lastName, email: userRef.docs[0].data().email, uid: userRef.docs[0].data().uid };
    } else {
        const result = await admin.auth().getUser(uid)
        .then((userRecord) => {
                let userInfo = {
                    firstName: userRecord.displayName.split(" ")[0],
                    lastName: userRecord.displayName.split(" ")[1],
                    email: userRecord.email,
                    profilePicture: "",
                    uid: uid,
                    created: userRecord.metadata.creationTime
                }
                admin.firestore().collection('users').doc(uid).set(userInfo);
                return { firstName: userInfo.firstName, lastName: userInfo.lastName, email: userInfo.email, uid: userInfo.uid };
            });
        return result;
    }
}

const getReviews = (filmId) => {
    const reviews = await db.collection("films").doc(filmId).get().then((result) => {
        if (result.data()) {
            return { filmTitle: result.data().title, filmDirector: result.data().director, reviews: result.data().reviews, filmArtwork: result.data().artwork };
        }
    }).catch((err) => {
        console.log(err);
    });

    if (reviews) {
        return reviews;
    } else {
        console.log("Could not find a review under that doc id");
    }
}

const getFilms = (uid) => {
    const filmsDBRef = db.collection("films");
    const filmsRef = await filmsDBRef.where("uid", "==", uid).get();
    if (filmsRef.size !== 0) {
        // include parser here to repackage reviewRef results to readable json object that is returned to FE
        return { films: parseFilms(filmsRef.docs) };
    } else {
        console.log("Cannot find review under that uid or user has not reviewed anything yet");
    }
}

const parseFilms = (films) => {
    let parsedFilms = [];
    for (let film of films) {
        parsedFilms.push({
            filmTitle: film.data().title,
            filmDirector: film.data().director,
            filmArtwork: film.data().artwork,
            filmId: film.id
        });
    }
    return parsedFilms;
}

module.exports = { getUserInfo, getReviews, getFilms };