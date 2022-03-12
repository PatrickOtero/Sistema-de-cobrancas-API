const knex = require("../connection");

const customerStatusValidator = async (customersArray, chargesArray) => {
    for (customer of customersArray) {
        const statusDefault = 'Em dia'
    
        await knex('customers')
          .update({ status: statusDefault })
          .where('id', customer.id)
      }
    
      if (chargesArray.length) {
        for (charge of chargesArray) {
          await knex('customers').where('id', charge.customerid)
    
          if (charge.duedate < new Date()) {
            const statusDebtor = 'Inadimplente'
    
            await knex('customers')
              .update({ status: statusDebtor })
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
    upToDateCustomerValidator,
    yupErrorsObtainer,
    customerStatusValidator,
}
