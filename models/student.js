const Sequelize = require('sequelize')
const config = require('./../config')

// Creating the Student model

const Student = config.define('student', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  section: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  gpa: {
    type: Sequelize.FLOAT,
    allowNull: false
  },
  nationality: {
    type: Sequelize.STRING,
    allowNull: true
  }
}, { timestamps: false })

module.exports = Student // Exports the student model
