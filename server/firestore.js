const admin = require("./firebase/firebase");
const db = admin.firestore();

async function getUserData(uid) {
    const usersRef = db.collection("users");
    const userRef = await usersRef.where("uid", "==", uid).get();
    if (userRef.size !== 0) {
        return { firstName: userRef.docs[0].data().firstName, lastName: userRef.docs[0].data().lastName };
    } else {
        const result = await admin.auth().getUser(uid)
        .then((userRecord) => {
                let userData = {
                    firstName: userRecord.displayName.split(" ")[0],
                    lastName: userRecord.displayName.split(" ")[1],
                    uid: uid,
                    created: userRecord.metadata.creationTime
                }
                admin.firestore().collection('users').add(userData);
                return userData;
            });
        return result;
    }
}

module.exports = getUserData;