
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
    response.status(201).json({ result: "new employee created" })
})

app.put('/api/employees/:id', async (request, response) => {
    const id = request.params.id
    const updated_employee = request.body
    const result = await data_base.raw(`UPDATE company set name=?,age=?,address=?,salary=? where id=?`,
        [updated_employee.name, updated_employee.age, updated_employee.address ? updated_employee.address : '', updated_employee.salary, id])
    response.status(200).json({ result: result.rowCount ? "employee updated" : "employee not found" })
})

app.patch('/api/employees/:id', async (request, response) => {
    const id = request.params.id
    // const { name ,address, salary, age } = request.body
    const query = []
    for (key in request.body) {
        query.push(`${key}='${request.body[key]}'`)
    }
    // name? query.push(`name='${name}'`) : null
    // address? query.push(`address='${address}'`) : null
    // salary? query.push(`salary=${salary}`) : null
    // age? query.push(`age=${age}`) : null

    if (query.length > 0) {
        await data_base.raw(`UPDATE company set ${query.join(', ')} where id=${id}`)
        response.status(200).json({ result: "employee patched" })
        return
    }
    response.status(200).json({ result: "empty employee" })
})

app.delete('/api/employees/:id', async (request, response) => {
    const id = request.params.id
    const result = await data_base.raw(`DELETE from company where id=${id}`)
    console.log(result);
    response.status(200).json({ result: result.rowCount ? "employee deleted" : "employee not found" })
})

app.delete('/api/employees-delete-table', async (request, response) => {
    // delete table
    await data_base.raw(`DROP table company`)
    response.status(200).json({ status: "table-deleted" })
})

app.post('/api/employees-create-table', async (request, response) => {
    await data_base.raw(`CREATE TABLE company (id SERIAL PRIMARY KEY, name TEXT NOT NULL UNIQUE,` +
        `age INT NOT NULL,` +
        `address CHAR(50),` +
        `salary REAL);`);
    response.status(201).json({ status: "table-created" })
})

app.post('/api/employees-create6', async (request, response) => {
    `INSERT INTO company (name,age,address,salary)
    VALUES ('Paul', 32, 'California', 20000.00);
    INSERT INTO company (name,age,address,salary)
    VALUES ('Allen', 25, 'Texas', 15000.00);
    INSERT INTO company (name,age,address,salary)
    VALUES ('Teddy', 23, 'Norway', 20000.00);
    INSERT INTO company (name,age,address,salary)
    VALUES ('Mark', 25, 'Rich-Mond ', 65000.00);
    INSERT INTO company (name,age,address,salary)
    VALUES ('David', 27, 'Texas', 85000.00);
    INSERT INTO company (name,age,address,salary)
    VALUES ('Kim', 22, 'South-Hall', 45000.00);`
        .replaceAll('\n    ', '')
        .split(';')
        .filter(query => query)
        .forEach(async query => { await data_base.raw(query + ';') })
    response.status(201).json({ result: "6 new employees created" })
})

app.listen(port, () => {
    console.log(`==== express server is up on port ${port}`);
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