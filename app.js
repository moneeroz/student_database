const express = require('express')
const app = express()
const config = require('./config') // Imports our database configuration
const Student = require('./models/student') // Imports our Student model

const PORT = 8888

// Testing our Database conniction
config.authenticate()
  .then(function () {
    console.log('database is connected!')
  })
  .catch(function (err) {
    console.log(err)
  })

// Middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// Middleware to count the number of incoming requests and their type
let getCount = 0
let postCount = 0
let putCount = 0
let deleteCount = 0
app.use((req, res, next) => {
  if (req.method === 'GET') {
    console.log(`Request count: ${++getCount} and Method type: ${req.method}`)
  }
  if (req.method === 'POST') {
    console.log(`Request count: ${++postCount} and Method type: ${req.method}`)
  }
  if (req.method === 'PUT') {
    console.log(`Request count: ${++putCount} and Method type: ${req.method}`)
  }
  if (req.method === 'DELETE') {
    console.log(`Request count: ${++deleteCount} and Method type: ${req.method}`)
  }
  next()
})

// Adding (creating --POST method) a student to the database
app.post('/students', (req, res) => {
  const newStudent = req.body

  Student.create(newStudent)
    .then((result) => {
      res.status(200).send(result)
    })
    .catch((err) => {
      res.status(500).send(err)
    })
})

// retrieving (getting --GET method) all the students from the database
app.get('/students', (req, res) => {
  Student.findAll()
    .then((results) => {
      res.status(200).send(results)
    })
    .catch((err) => {
      res.status(500).send(err)
    })
})

// retrieving (getting --GET method) a specific student by their ID
app.get('/students/:id', (req, res) => {
  const studentId = parseInt(req.params.id)

  // Find the student by their Id
  Student.findByPk(studentId)
    .then((result) => {
      res.status(200).send(result)
    })
    .catch((err) => {
      res.send(500).send(err)
    })
})

// Create a dynamic filter
app.get('/students/filter/search', (req, res) => {
  const data = {
    where: { }
  }

  if (req.query.section !== undefined) {
    data.where.section = req.query.section
  }

  if (req.query.id !== undefined) {
    data.where.id = req.query.id
  }

  Student.findAll(data)
    .then((results) => {
      res.status(200).send(results)
    })
    .catch((err) => {
      res.status(500).send(err)
    })
})
// Updating (updating --PUT method) an existing student
app.put('/students/:id', (req, res) => {
  const studentId = parseInt(req.params.id)
  const studentUpdate = req.body

  // Find the student by their Id
  Student.findByPk(studentId)
    .then((result) => {
      if (!result) {
        res.status(404).send('Student not found')
      } else { // updating the student based on their Id
        result.name = studentUpdate.name
        result.section = studentUpdate.section
        result.gpa = studentUpdate.gpa
        result.nationality = studentUpdate.nationality

        // saving the changes to the database
        result.save()
          .then((result) => {
            res.status(200).send(result)
          })
          .catch((err) => {
            res.status(500).send(err)
          })
      }
    })
})

// Deleting (deleting / destroying --DELETE method) an existing student from the database
app.delete('/students/:id', (req, res) => {
  const studentId = parseInt(req.params.id)

  // Find the student by their Id
  Student.findByPk(studentId)
    .then((result) => {
      if (!result) {
        res.status(404).send('Student not found')
      } else { // deleting a student from the database based on their Id
        result.destroy()
          .then((result) => {
            res.status(200).send(result)
          })
          .catch((err) => {
            res.status(500).send(err)
          })
      }
    })
})

app.listen(PORT, console.log(`server is running on port ${PORT}..`))
