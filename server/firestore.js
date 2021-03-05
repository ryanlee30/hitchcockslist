const admin = require("./firebase/admin");
const db = admin.firestore();

async function getUserInfo(uid) {
    const usersRef = db.collection("users");
    const userRef = await usersRef.where("uid", "==", uid).get();
    if (userRef.size !== 0) {
        return { firstName: userRef.docs[0].data().firstName, lastName: userRef.docs[0].data().lastName };
    } else {
        const result = await admin.auth().getUser(uid)
        .then((userRecord) => {
                let userInfo = {
                    firstName: userRecord.displayName.split(" ")[0],
                    lastName: userRecord.displayName.split(" ")[1],
                    uid: uid,
                    created: userRecord.metadata.creationTime
                }
                admin.firestore().collection('users').add(userInfo);
                return { firstName: userInfo.firstName, lastName: userInfo.lastName };
            });
        return result;
    }
}

async function getReview(uid, filmTitle) {
    const reviewsDBRef = db.collection("reviews");
    const reviewsRef = await reviewsDBRef.where("uid", "==", uid).where("title", "==", filmTitle).get();
    if (reviewsRef.size !== 0) {
        return { filmTitle: reviewsRef.docs[0].data().title, filmDirector: reviewsRef.docs[0].data().director, content: reviewsRef.docs[0].data().content, reviewDate: reviewsRef.docs[0].data().created };
    } else {
        console.log("Cannot find review under that uid or title");
    }
}

module.exports = { getUserInfo, getReview };