const admin = require("./firebase/admin");

function authorization(request, response, next) {
  const headerToken = request.headers.authorization;
  if (!headerToken) {
    return response.send({ message: "No token provided" }).status(401);
  }

  if (headerToken && headerToken.split(" ")[0] !== "Bearer") {
    response.send({ message: "Invalid token" }).status(401);
  }

  const token = headerToken.split(" ")[1];
  admin
    .auth()
    .verifyIdToken(token)
    .then((decodedToken) => {
      response.locals.uid = decodedToken.uid;
      next();
    })
    .catch(() => {
      response.status(401).send({ message: "Could not authorize" });
      console.log("Could not authorize");
    });
}

module.exports = authorization;