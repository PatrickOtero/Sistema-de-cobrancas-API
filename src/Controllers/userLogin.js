const knex = require("../connection");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const hashPass = require("../hashPass");
const schemaUserLogin = require("../validations/schemaUserLogin");

const userLogin = async (req, res) => {
  const { email, pass } = req.body;

  try {
    await schemaUserLogin.validate(req.body);
    const user = await knex("users").where({ email }).first();

    if (!user) {
      return res.status(404).json("O usuário não foi encontrado");
    }

    const correctPassword = await bcrypt.compare(pass, user.pass);

    if (!correctPassword) {
      return res.status(401).json("Email e senha não confere");
    }

    const token = jwt.sign({ id: user.id }, hashPass, { expiresIn: "8h" });

    const { pass: _, ...userData } = user;

    return res.status(200).json({
      user: userData,
      token,
    });
  } catch (error) {
    return res.status(400).json(error.message);
  }
};

module.exports = {
  userLogin,
};
