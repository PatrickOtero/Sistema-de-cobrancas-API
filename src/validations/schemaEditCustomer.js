const yup = require("./configurations");

const schemaEditCustomer = yup.object().shape({
  name_customer: yup
    .string()
    .required("O Nome é obrigatório! Preencha-o, por favor.")
    .trim(),
  email: yup
    .string()
    .email("Por favor, insira um email válido")
    .required("O Email é obrigatório! Preencha-o, por favor.")
    .trim(),
  cpf: yup
    .string()
    .required("O CPF é obrigatório! Preencha-o, por favor.")
    .min(14, "Por favor, insira um CPF válido com 11 caracteres!")
    .max(14, "Por favor, insira um CPF válido com 11 caracteres!")
    .trim(),
  phone: yup
    .string()
    .required("O Telefone é obrigatório! Preencha-o, por favor.")
    .trim(),
  zip_code: yup
    .string()
    .trim(),
  address: yup
    .string()
    .trim(),
  complement: yup
    .string()
    .trim(),
  neighborhood: yup
    .string()
    .trim(),
  city: yup
    .string()
    .trim(),
  state: yup
    .string()
    .trim(),
});

module.exports = { schemaEditCustomer };
