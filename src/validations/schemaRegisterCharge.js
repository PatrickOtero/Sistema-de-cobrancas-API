const yup = require('./configurations')

const schemaRegisterCharge = yup.object().shape({
  name_customer: yup
    .string()
    .required('O nome é obrigatório! Preencha-o, por favor.')
    .trim(),
  description: yup
    .string()
    .required('A descrição é obrigatória! Preencha-a, por favor.')
    .trim(),
  status: yup
    .string()
    .required('O status é obrigatório! Preencha-o, por favor.')
    .trim(),
  value: yup
    .number()
    .integer()
    .required('O valor é obrigatório! Preencha-o, por favor.'),
  duedate: yup
    .string()
    .required('O vencimento é obrigatório! Preencha-o, por favor.'),
})

module.exports = { schemaRegisterCharge }
