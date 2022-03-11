const knex = require('../connection')
const { schemaRegisterCharge } = require('../validations/schemaRegisterCharge')
const { schemaEditCharge } = require("../validations/schemaEditCharge")
const {
  dateFormatter,
  arrayPropertyValueFormatter,
  chargesSummaryTotalValueObtainerAndFormatter,
} = require('../Helpers/formatters')

const { upToDateCustomerValidator } = require("../Helpers/validators")
const { searchInCharges } = require("../Controllers/search");

const registerCharge = async (req, res) => {
  const { name_customer, description, status, value, duedate } = req.body
  const { idParam } = req.params
  try {
    await schemaRegisterCharge.validate(req.body)

    const customerTable = await knex('customers')

    if (!customerTable.length)
      return res
        .status(401)
        .json('Registre um cliente para poder criar uma cobrança')

    const customerExists = await knex('customers').where('id', idParam)

    if (!customerExists.length)
      return res
        .status(404)
        .json('Não foi encontrado nenhum cliente com este id!')

    const splitedDate = duedate.split('-')
    const rightOrderDate = splitedDate[2] + splitedDate[1] + splitedDate[0]

    const charge = await knex('charges').insert({
      name_customer,
      description,
      status,
      value,
      duedate: rightOrderDate,
      customerid: idParam,
    })

    if (charge.length) {
      return res.status(400).json('A cobrança não foi cadastrada.')
    }

    return res.status(200).json('Cobrança cadastrada com sucesso!')
  } catch (error) {
    return res.status(400).json(error.message)
  }
}

const listCharges = async (req, res) => {
  const charges = await knex('charges')

  if (!charges.length)
    return res.status(404).json('Não há nenhuma cobrança registrada')

  dateFormatter(charges)
  arrayPropertyValueFormatter(charges)

  req.query.search ? searchInCharges(req, res) : res.status(200).json(charges);
}

const summarizeCharges = async (req, res) => {
  const chargesSummary = await knex('*')
    .from('charges')
    .leftJoin('customers', 'charges.customerid', 'customers.id')
    .select(
      'customers.name_customer',
      'charges.id',
      'charges.value',
      'charges.duedate',
      'charges.status',
      'charges.description'
    )

  if (!chargesSummary.length)
    return res.status(404).json('Nenhuma cobrança registrada')

  const expectedChargesFilter = chargesSummary.filter(
    (charge) => charge.duedate > new Date() && charge.status !== 'Paga',
  )
  const overdueChargesFilter = chargesSummary.filter(
    (charge) => charge.duedate < new Date() && charge.status !== 'Paga',
  )
  const paidChargesFilter = chargesSummary.filter(
    (charge) => charge.status === 'Paga',
  )

  dateFormatter(chargesSummary);

  const expectedTotalValue = chargesSummaryTotalValueObtainerAndFormatter(expectedChargesFilter)
  const overdueTotalValue = chargesSummaryTotalValueObtainerAndFormatter(overdueChargesFilter)
  const paidTotalValue = chargesSummaryTotalValueObtainerAndFormatter(paidChargesFilter)

  arrayPropertyValueFormatter(expectedChargesFilter)
  arrayPropertyValueFormatter(overdueChargesFilter)
  arrayPropertyValueFormatter(paidChargesFilter)

  let emptyExpectedList = ""
  let emptyOverdueList = ""
  let emptyPaidList = ""

  if (!expectedChargesFilter.length) {
    emptyExpectedList = 'Nenhuma cobrança prevista registrada'
  }

  if (!overdueChargesFilter.length) {
    emptyOverdueList = 'Nenhuma cobrança vencida registrada'
  }

  if (!paidChargesFilter.length) {
    emptyPaidList = 'Nenhuma cobrança paga registrada'
  }


  return res.status(200).json({
    expected: expectedChargesFilter,
    overdue: overdueChargesFilter,
    paid: paidChargesFilter,
    totalExpectedValue: `R$ ${expectedTotalValue}`,
    totalOverdueValue: `R$ ${overdueTotalValue}`,
    totalPaidValue: `R$ ${paidTotalValue}`,
    emptyExpected: emptyExpectedList,
    emptyOverdue: emptyOverdueList,
    emptyPaid: emptyPaidList,
  })
}

const editCharges = async (req, res) => {
  const { idParam } = req.params

  try {
    await schemaEditCharge.validate(req.body);

    const chargeExists = await knex('charges').where('id', idParam).first()

    if (!chargeExists) return res.status(404).json('A cobrança não existe!')

    const tableChargesUpdate = await knex('charges')
      .update({...req.body})
      .where('id', idParam)

    if (tableChargesUpdate.length) {
      return res.status(400).json('A cobrança não foi atualizada.')
    }
    return res.status(200).json('Cobrança atualizada com sucesso!')
  } catch (error) {
    return res.status(400).json(error.message)
  }
}

const deleteCharges = async (req, res) => {
  const { idParam } = req.params

  try {
    const chargeExists = await knex('charges').select("customerid", "status").where('id', idParam).first();

    if (!chargeExists) return res.status(404).json('A cobrança não existe!');

    if (chargeExists.status == "Paga") return res.status(401).json("Cobranças pagas não podem ser excluídas");
    if (chargeExists.duedate < new Date()) return res.status(401).json("Cobranças vencidas não podem ser excluídas");

    const chargeToRemove = await knex('charges').where('id', idParam).del()

    const dueDates = await knex("charges").select("duedate").where("customerid", chargeExists.customerid);

    upToDateCustomerValidator(chargeExists, dueDates);

    if (chargeToRemove.length) {
      res.status(400).json('A cobrança não foi excluída.')
    }
    res.status(200).json('Cobrança excluída com sucesso!')
  } catch (error) {
    res.status(400).json(error.message)
  }
}

module.exports = {
  registerCharge,
  listCharges,
  summarizeCharges,
  editCharges,
  deleteCharges,
}
