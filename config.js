const Sequelize = require('sequelize')

const config = new Sequelize('studentsDB', 'root', '', { dialect: 'mariadb' })

module.exports = config
