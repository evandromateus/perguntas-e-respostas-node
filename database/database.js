const Sequelize = require('sequelize')

                                // base de dados, usuario, senha
const connection = new Sequelize('guiaperguntas', 'root', 'root', {
    host: 'localhost',
    dialect: 'mysql'
})

module.exports = connection