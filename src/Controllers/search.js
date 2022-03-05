const knex = require("../connection");
const { dateFormatter, arrayPropertyValueFormatter } = require("../Helpers/formatters")

const searchInCharges = async (req, res) => {
    try {
        const search = `%${req.query.search}%`;

        const chargesSearch = await knex('charges').whereRaw("cast(id as text) ilike ?", [search])
            .orWhere("name_customer", "ilike", search);

        if (chargesSearch.length === 0) return res.status(404).json("Nenhum resultado encontrado!");

        dateFormatter(chargesSearch)
        arrayPropertyValueFormatter(chargesSearch)

        return res.status(200).json(chargesSearch);
    } catch (error) {
        return res.status(400).json(error);
    }
}

const searchInCustomer = async (req, res) => {
    try {
        const search = `%${req.query.search}%`;

        const customersSearch = await knex("customers")
            .where("name_customer", "ilike", search)
            .orWhere("cpf", "ilike", search)
            .orWhere("email", "ilike", search);

        if (customersSearch.length === 0) return res.status(404).json("Nenhum resultado encontrado!");

        return res.status(200).json(customersSearch);
    } catch (error) {
        return res.status(400).json(error)
    }
}

module.exports = {
    searchInCharges,
    searchInCustomer
}