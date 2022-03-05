const { format } = require("date-fns")

const dateFormatter = (array) => {
  let treatedDate = ''
  array.forEach((item) => {
    treatedDate = format(item.duedate, "dd/MM/yyyy")
    item.duedate = treatedDate
  })
}

const arrayPropertyValueFormatter = (array) => {
  array.forEach((item) => {
    item.value = `R$${item.value},00`
  })
}

const chargesSummaryTotalValueObtainerAndFormatter = (array) => {
  let totalValue = 0
  array.forEach((item) => (totalValue += item.value))

  return totalValue.toLocaleString('pt-BR');
}

module.exports = { dateFormatter, arrayPropertyValueFormatter, chargesSummaryTotalValueObtainerAndFormatter }
