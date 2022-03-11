const knex = require("../connection");
const {
  schemaRegisterCustomer,
} = require("../validations/schemaRegisterCustomer");
const { schemaEditCustomer } = require("../validations/schemaEditCustomer");
const {
  dateFormatter,
  arrayPropertyValueFormatter,
} = require("../Helpers/formatters");
const { searchInCustomer } = require("../Controllers/search");

const listAllCustomers = async (req, res) => {
  const allCustomersList = await knex("customers").select(
    "id",
    "name_customer",
    "email",
    "phone",
    "cpf",
    "status"
  );

  const orderedList = allCustomersList.sort((a, b) => a < b);

  req.query.search
    ? searchInCustomer(req, res)
    : res.status(200).json(orderedList);
};

const detailCustomer = async (req, res) => {
  const { idParam } = req.params;
  const detailedCustomer = await knex("customers").where("id", idParam);

  if (!detailedCustomer.length)
    return res.status(404).json("O cliente não existe no banco de dados!");

  return res.status(200).json(detailedCustomer);
};

const registerCustomer = async (req, res) => {
  const { email, cpf } = req.body;

  try {
    await schemaRegisterCustomer.validate(req.body);

    const emailExists = await knex("customers").where({ email }).first();

    if (emailExists) {
      return res
        .status(401)
        .json("O email cadastrado pertence a outro cliente.");
    }

    const cpfExists = await knex("customers").where({ cpf }).first();

    if (cpfExists) {
      return res.status(401).json("O CPF cadastrado pertence a outro cliente.");
    }

    const customer = await knex("customers").insert([{ ...req.body }]);

    if (customer.length) {
      return res.status(400).json("O cliente não foi cadastrado.");
    }
    return res.status(200).json("Cliente cadastrado com sucesso!");
  } catch (error) {
    return res.status(400).json(error.message);
  }
};

const summarizeCustomers = async (req, res) => {
  const customersSummary = await knex("*")
    .from("customers")
    .distinctOn("name_customer");

  if (!customersSummary.length)
    return res.status(404).json("Nenhum cliente cadastrado");

  const defaulterCustomerFilter = customersSummary.filter(
    (customer) => customer.status === "Inadimplente"
  );
  const upToDateCustomerFilter = customersSummary.filter(
    (customer) => customer.status === "Em dia"
  );

  let emptyDefaulterList = "";
  let emptyUpToDateList = "";

  if (defaulterCustomerFilter.length === 0) {
    emptyDefaulterList = "Nenhum cliente inadimplente encontrado";
  }

  if (upToDateCustomerFilter.length === 0) {
    emptyUpToDateList = "Nenhum cliente em dia encontrado";
  }

  return res.status(200).json({
    defaulter: defaulterCustomerFilter,
    upToDate: upToDateCustomerFilter,
    emptyDefaulters: emptyDefaulterList,
    emptyUpToDate: emptyUpToDateList,
  });
};

const editCustomer = async (req, res) => {
  const { email, cpf } = req.body;
  const { idParam } = req.params;

  try {
    await schemaEditCustomer.validate(req.body);

    const customerToEdit = await knex("customers").where("id", idParam);

    if (!customerToEdit) return res.status(404).json("Cliente não encontrado!");

    const emailExists = await knex("customers")
      .whereNot("id", idParam)
      .where("email", email)
      .first();

    if (emailExists) {
      return res
        .status(401)
        .json("O email cadastrado pertence a outro cliente.");
    }

    const cpfExists = await knex("customers")
      .whereNot("id", idParam)
      .where("cpf", cpf)
      .first();

    if (cpfExists) {
      return res.status(401).json("O CPF cadastrado pertence a outro cliente.");
    }

    const tableCustomerUpdate = await knex("customers")
      .update({ ...req.body })
      .where("id", idParam);

    if (tableCustomerUpdate.length) {
      return res.status(400).json("O cliente não foi atualizado.");
    }
    return res.status(200).json("Cliente atualizado com sucesso!");
  } catch (error) {
    return res.status(400).json(error.message);
  }
};

const listCustomerCharges = async (req, res) => {
  const { idParam } = req.params;

  const userCharges = await knex("*")
    .from("charges", "customers")
    .leftJoin("customers", "charges.customerid", "customers.id")
    .select(
      "charges.id",
      "charges.customerid",
      "customers.name_customer",
      "charges.description",
      "charges.status",
      "charges.value",
      "charges.duedate"
    )
    .where("customerid", idParam);

  if (!userCharges.length)
    return res
      .status(404)
      .json("Não existe nenhuma cobrança vinculada a este usuário");

  dateFormatter(userCharges);
  arrayPropertyValueFormatter(userCharges);

  return res.status(200).json(userCharges);
};

module.exports = {
  listAllCustomers,
  detailCustomer,
  registerCustomer,
  editCustomer,
  summarizeCustomers,
  listCustomerCharges,
};
