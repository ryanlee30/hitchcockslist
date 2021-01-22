const express = require("express");
const cors = require("cors");
const authentication = require("./authentication");

const app = express();
app.use(cors());

app.use("/", authentication);

app.listen(4000, () => console.log("The server is running at PORT 4000"));