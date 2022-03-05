const knex = require("../connection");

const upToDateCustomerValidator = async (array1, array) => {
    let customerOk = true;
    for (date of array) {
        if (date.duedate < new Date())
            customerOk = false;
    }
    if (customerOk) {
        await knex("customers")
            .update({ status: "Em dia" })
            .where("id", array1.customerid);
    }
}

const yupErrorsObtainer = (err, object) => {
    const firstError = err.errors.find(error => error === "O Nome é obrigatório! Preencha-o, por favor.")
    if (firstError) object.requiredName = firstError

    const secondError = err.errors.find(error => error === "O Email é obrigatório! Preencha-o, por favor.")
    if (secondError) object.requiredEmail = secondError
}

// BIBLIOTECA CRON 

const defaulterCustomerValidator = async () => {
    const chargesList = await knex("charges").select("customerid", "duedate", "status");
    try {
        if (chargesList.length > 0) {
            for (charge of chargesList) {
                if (charge.duedate < new Date() && charge.status != "Paga") {
                    await knex('customers').where('id', charge.customerid)

                    await knex('customers')
                        .update({ status: "Inadimplente" })
                        .where('id', charge.customerid)
                }
            }
        }
    } catch (erro) {
        console.log(erro);
    }
}

module.exports = {
    upToDateCustomerValidator,
    defaulterCustomerValidator,
    yupErrorsObtainer
}
