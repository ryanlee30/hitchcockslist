const express = require("express");
const cors = require("cors");
const authorization = require("./authorization");
const getUserData = require("./firestore");

const app = express();
app.use(cors());

app.use("/", authorization);

app.get("/user-info", (request, response) => {
    getUserData(response.locals.uid).then(result => {
        response.send(result);
    });
})

app.listen(4000, () => console.log("The server is running at PORT 4000"));