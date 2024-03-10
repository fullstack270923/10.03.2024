
const knex = require('knex')
const port = 3000
const express = require('express')
const body_parser = require('body-parser')
const path = require('path')

const app = express() // creates my server
app.use(body_parser.json()) // will help to get the body of the request 

app.use(express.static(path.join('.', '/static/'))) // allows browsing to my static folder

app.get('/api/employees', async (request, response) => {
    const employees = await data_base.raw("select * from company")
    employees.rows = employees.rows.map(e => {
        e.address = e.address.trimEnd();
        return e;
    })
    response.status(200).json(employees.rows)
})

app.get('/api/employees/:id', async (request, response) => {
    const id = request.params.id
    const employees = await data_base.raw(`select * from company where id = ${id}`)
    employees.rows = employees.rows.map(e => {
        e.address = e.address.trimEnd();
        return e;
    })
    response.status(200).json(employees.rows)
})

app.post('/api/employees', async (request, response) => {
    const new_employee = request.body
    await data_base.raw(`INSERT INTO company (name,age,address,salary) VALUES (?, ?, ?, ?);`,
        [new_employee.name, new_employee.age, new_employee.address, new_employee.age])
    response.status(201).json({result: "new employee created"})
})

app.put('/api/employees/:id', async (request, response) => {
    // TO DO
    response.status(200).json({result: "employee updated"})
})

app.delete('/api/employees/:id', async (request, response) => {
    // TO DO
    response.status(200).json({result: "employee updated"})
})

app.delete('/api/delete-table', async (request, response) => {
    // delete table
    // TO DO
    response.status(200).json({status: "table-deleted"})
})

app.post('/api/create-table', async (request, response) => {
    // creates table
    // TO DO
    response.status(201).json({status: "table-created"})
})

app.listen(port, () => {
    console.log(`==== express server is up on port ${port}`);
})

app.post('/api/employees-creat5', async (request, response) => {
    // BRING creation of 5 employees 
    response.status(201).json({result: "5 new employees created"})
})

const data_base = knex({
    client: 'pg',
    connection: {
        host: 'localhost',
        user: 'postgres',
        password: 'admin',
        database: 'postgres'
    }
})