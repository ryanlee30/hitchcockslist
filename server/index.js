const express = require("express");
const cors = require("cors");
const authorization = require("./authorization");
const { getUserInfo, getReview } = require("./firestore");

const app = express();
app.use(cors());

// app.use("/", authorization);

app.get("/user-info", (request, response) => {
    getUserInfo(response.locals.uid).then(result => {
        response.send(result);
    });
})

app.get("/fetch-review", (request, response) => {
    getReview(request.query.uid, request.query.filmTitle).then(result => {
        response.send(result);
    })
})

app.listen(4000, () => console.log("The server is running at PORT 4000"));