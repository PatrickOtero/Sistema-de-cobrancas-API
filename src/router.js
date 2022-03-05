const express = require('express')
const {
  listAllCustomers,
  detailCustomer,
  registerCustomer,
  editCustomer,
  summarizeCustomers,
  listCustomerCharges,
} = require('./Controllers/customers')
const { userLogin } = require('./Controllers/userLogin')
const { registerUser, editUser } = require('./Controllers/users')
const {
  registerCharge,
  listCharges,
  summarizeCharges,
  editCharges,
  deleteCharges,
} = require('./Controllers/charges')
const loginVerification = require('./Middlewares/loginVerification')
const { chargesFilters, customersFilters } = require("./Controllers/filters");

const routes = express()

// Login de usuários
routes.post('/userLogin', userLogin)

// Crud de usuários
routes.post('/users', registerUser)

// middleware de autenticação de rotas:
routes.use(loginVerification)
// Rotas com autenticação:

// Crud de usuários (autenticado)
routes.put('/users', editUser)

// Crud de clientes
routes.get('/customers', listAllCustomers)
routes.get('/customers/:idParam', detailCustomer)
routes.post('/customers', registerCustomer)
routes.put('/customers/:idParam', editCustomer)
routes.get('/customers/summary/all', summarizeCustomers)
routes.get('/customers/charges/:idParam', listCustomerCharges)

// Crud de cobranças
routes.post('/charges/:idParam', registerCharge)
routes.get('/charges', listCharges)
routes.get('/charges/summary', summarizeCharges)
routes.put('/charges/:idParam', editCharges)
routes.delete('/charges/:idParam', deleteCharges)

// Filtros de cobranças
routes.get("/charges/filters/all", chargesFilters);

// Filtros de clientes
routes.get("/customers/filters/all", customersFilters);

module.exports = routes
