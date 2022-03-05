const knex = require("../connection");
const jwt = require("jsonwebtoken");
const hashPass = require("../hashPass");
const schemaLoginVerification = require("../validations/schemaLoginVerification");

const loginVerification = async (req, res, next) => {
  const { authorization } = req.headers;

  try {
    await schemaLoginVerification.validate(req.headers);
    const token = authorization.replace("Bearer ", "").trim();

    const { id } = jwt.verify(token, hashPass);

    const verifyUser = await knex("users").where("id", "=", id);

    const userProfile = verifyUser[0];

    if (verifyUser.length === 0) {
      return res.status(404).json("Usuário não encontrado");
    }

    const { pass, ...user } = userProfile;

    req.user = user;

    next();
  } catch (error) {
    console.log(error)
    return res.status(400).json(error.message);
  }
};

module.exports = loginVerification;
