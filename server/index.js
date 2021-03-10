const express = require("express");
const cors = require("cors");
const authorization = require("./authorization");
const { getUserInfo, getReviews, getFilms } = require("./firestore");

const app = express();
app.use(cors());

app.use("/", authorization);

app.get("/user-info", (request, response) => {
    getUserInfo(response.locals.uid).then(result => {
        response.send(result);
    });
});

app.get("/fetch-films", (request, response) => {
    getFilms(response.locals.uid).then(result => {
        response.send(result);
    })
});

app.get("/fetch-reviews", (request, response) => {
    getReviews(request.query.filmId).then(result => {
        response.send(result);
    })
});

app.listen(4000, () => console.log("The server is running at PORT 4000"));