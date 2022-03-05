require('dotenv').config()
const express = require('express')
const cors = require('cors')
const router = require('./router')
const cron = require("node-cron");
const { defaulterCustomerValidator } = require('./Helpers/validators');
const app = express()

app.use(express.json())
app.use(cors())
app.use(router)
app.listen(process.env.PORT || 3001)

cron.schedule('* * * * * *', () => {
    defaulterCustomerValidator();
});