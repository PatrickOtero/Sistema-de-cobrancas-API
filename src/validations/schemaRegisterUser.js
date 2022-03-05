const yup = require("./configurations");

const schemaRegisterUser = yup.object().shape({
  name_user: yup
    .string()
    .required("O Nome é obrigatório! Preencha-o, por favor.")
    .trim(),
  email: yup
    .string()
    .email()
    .required("O email é obrigatório! Preencha-o, por favor.")
    .trim(),
  pass: yup
    .string()
    .required("A senha é obrigatória! Preencha-a, por favor.")
    .trim(),
});

module.exports = schemaRegisterUser;
