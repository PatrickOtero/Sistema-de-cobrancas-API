const knex = require("../connection");
const { schemaEditUsers } = require("../validations/schemaEditUser");
const schemaRegisterUser = require("../validations/schemaRegisterUser");
const bcrypt = require("bcrypt");
const { yupErrorsObtainer } = require("../Helpers/validators")

const registerUser = async (req, res) => {
  const { name_user, email, pass } = req.body;

  try {
    await schemaRegisterUser.validate(req.body);
    const emailExists = await knex("users").where("email", "=", email);

    if (emailExists.length > 0) {
      return res.status(401).json("O email já existe.");
    }

    const encryptedPass = await bcrypt.hash(pass, 10);

    const user = await knex("users").insert({
      name_user,
      email,
      pass: encryptedPass,
    });
    if (user.length === 0) {
      return res.status(400).json("Não foi possível fazer seu cadastro.");
    }

    return res.status(200).json("Usuário registrado com sucesso!");
  } catch (error) {
    return res.status(400).json(error.message);
  }
};

const editUser = async (req, res) => {
  const { name_user, email, cpf, phone, pass } = req.body;
  const { user } = req;

  try {
    let yupErrorsObject = {};

    await schemaEditUsers.validate(req.body, {abortEarly: false}).then(valid => {
      console.log(valid)
    }).catch(err => {      
      yupErrorsObtainer(err, yupErrorsObject);
    });

    if (Object.keys(yupErrorsObject).length > 0) {
      return res.status(400).json(yupErrorsObject);
    }

    const alreadyUsedDataObject = {};

    const emailExists = await knex("users")
      .whereNot("id", user.id) 
      .where("email", email)
      .first();

    if (emailExists) {
      alreadyUsedDataObject.emailExists = "O email cadastrado pertence a outro usuário.";
    }

    if (cpf) {
    
      if (cpf.indexOf("_") !== -1) {
        alreadyUsedDataObject.invalidCpf = "Por favor, insira um CPF válido com 11 caracteres!"
    }

      const cpfExists = await knex("users")
        .whereNot("id", user.id)
        .where("cpf", cpf)
        .first();

      if (cpfExists) {
        alreadyUsedDataObject.cpfExists = "O cpf cadastrado pertence a outro usuário.";
      }
    }
    
    if (Object.keys(alreadyUsedDataObject).length > 0) {
      return res.status(400).json(alreadyUsedDataObject);
    }

    if (pass) {
      const encryptedPass = await bcrypt.hash(pass, 10);


      const userUpdateWithPass = await knex("users")
        .where("id", user.id)
        .update({ name_user, email, pass: encryptedPass, cpf, phone });

      if (!userUpdateWithPass) {
        return res.status(400).json("O usuario não foi editado");
      }

      return res.status(200).json("Usuario editado com sucesso!");
    }

    const userUpdateWithoutPass = await knex("users")
      .where("id", user.id)
      .update({ name_user, email, cpf, phone });

    if (!userUpdateWithoutPass) {
      return res.status(400).json("O usuario não foi editado");
    }
    
    return res.status(200).json("Usuario editado com sucesso!");
  } catch (error) {
    return res.status(400).json(error.message);
  }
};

module.exports = {
  registerUser,
  editUser,
};
