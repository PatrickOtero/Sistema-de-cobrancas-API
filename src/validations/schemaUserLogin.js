const yup = require("./configurations");

const schemaUserLogin = yup.object().shape({
  email: yup
    .string()
    .required("O email é obrigatório! Preencha-o, por favor.")
    .trim(),
  pass: yup
    .string()
    .required("A senha é obrigatória! Preencha-a, por favor.")
    .trim(),
});

module.exports = schemaUserLogin;
