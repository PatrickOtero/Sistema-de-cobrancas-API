const knex = require("../connection");

const customerStatusValidator = async (customersArray, chargesArray) => {
    for (customer of customersArray) {    
        await knex('customers')
          .update({ status: "Em dia" })
          .where('id', customer.id)
      }
    
      if (chargesArray.length > 0) {
        for (charge of chargesArray) {
          if (charge.duedate < new Date() && charge.status !== "Paga") {
            await knex('customers')
              .update({ status: 'Inadimplente' })
              .where('id', charge.customerid)
          }
        }
    }
}

const yupErrorsObtainer = (err, object) => {
    const firstError = err.errors.find(error => error === "O Nome é obrigatório! Preencha-o, por favor.")
    if (firstError) object.requiredName = firstError

    const secondError = err.errors.find(error => error === "O Email é obrigatório! Preencha-o, por favor.")
    if (secondError) object.requiredEmail = secondError
}

module.exports = {
    yupErrorsObtainer,
    customerStatusValidator,
}
