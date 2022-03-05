const yup = require('./configurations')

const schemaRegisterCustomer = yup.object().shape({
  name_customer: yup
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
    .required('O CPF é obrigatório! Preencha-o, por favor.')
    .min(14, 'Por favor, insira um CPF válido com 11 caracteres!')
    .max(14, 'Por favor, insira um CPF válido com 11 caracteres!')
    .trim(),
  phone: yup
    .string()
    .required('O Telefone é obrigatório! Preencha-o, por favor.')
    .trim(),
})

module.exports = { schemaRegisterCustomer }
