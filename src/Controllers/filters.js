const knex = require("../connection");
const { dateFormatter, arrayPropertyValueFormatter } = require("../Helpers/formatters")

const chargesFilters = async (req, res) => {
    try {
        const orderById = await knex("charges").orderBy("id");
        const orderByIdDesc = await knex("charges").orderBy("id", "desc");
        const orderByName = await knex("charges").orderBy("name_customer");
        const orderByNameDesc = await knex("charges").orderBy("name_customer", "desc");

        dateFormatter(orderById)
        dateFormatter(orderByIdDesc)
        dateFormatter(orderByName)
        dateFormatter(orderByNameDesc)
        arrayPropertyValueFormatter(orderById)
        arrayPropertyValueFormatter(orderByIdDesc)
        arrayPropertyValueFormatter(orderByName)
        arrayPropertyValueFormatter(orderByNameDesc)

        return res.status(200).json({ orderById, orderByIdDesc, orderByName, orderByNameDesc });
    } catch (error) {
        return res.status(500).json(error);
    }
}

const customersFilters = async (req, res) => {
    try {
        const orderByName = await knex("customers").orderBy("name_customer");
        const orderByNameDesc = await knex("customers").orderBy("name_customer", "desc");
        return res.status(200).json({ orderByName, orderByNameDesc });
    } catch (error) {
        return res.status(500).json(error);
    }
}

module.exports = {
    chargesFilters,
    customersFilters
}