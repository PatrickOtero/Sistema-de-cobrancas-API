const nodemailer = require("nodemailer");
const handlebars = require("nodemailer-express-handlebars");

const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    secure: false,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD,
    },
});

transporter.use(
    "compile",
    handlebars({
        viewEngine: {
            extname: ".handlebars",
            defaultLayout: false,
        },
        viewPath: "./src/views/",
    })
);

module.exports = transporter;