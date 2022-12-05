import Auth from "../models/Auth.js";

const AuthMiddleware = (req, res, next) => {
  const token = Auth.readToken(req.headers.token);
  next();
  // token === null ? res.status(401).send({message: "invalid token"}) : req.session.userId === token.id ? next() : res.status(401).send({message: "invalid token"})
};

export default AuthMiddleware;
