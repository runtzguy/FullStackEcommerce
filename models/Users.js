const Sequelize = require("sequelize");
const db = require("../database/db");

module.exports = db.sequelize.define(
    'Customer',
    {
        CUS_ID : {
            type: Sequelize.STRING,
            primaryKey : true,
            autoIncrement : false
        },
        CUS_FName : {
            type : Sequelize.STRING
        },
        CUS_LName : {
            type : Sequelize.STRING
        },
        CUS_Email : {
            type : Sequelize.STRING
        },
        CUS_PW : {
            type : Sequelize.STRING
        }
    },
    {
        timestamps: false
    }
);

