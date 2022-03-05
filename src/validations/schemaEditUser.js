const yup = require('./configurations')

const schemaEditUsers = yup.object().shape({
  name_user: yup
    .string()
    .required('O Nome é obrigatório! Preencha-o, por favor.')
    .trim(),
  email: yup
    .string()
    .email('Por favor, insira um email válido')
    .required('O Email é obrigatório! Preencha-o, por favor.')
    .trim(),
  cpf: yup
    .string()
    .trim(),
});

module.exports = {
  schemaEditUsers,
}
