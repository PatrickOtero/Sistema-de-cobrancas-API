const yup = require("./configurations");

const schemaLoginVerification = yup.object().shape({
  authorization: yup.string().required("Não autorizado")
});

module.exports = schemaLoginVerification;
