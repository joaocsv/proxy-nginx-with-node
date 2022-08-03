const express = require('express')
const mysql = require('mysql')
const random = require('random-name')

const app = express()
const port = 3000

var mysqlConfig = {
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
}

app.get('/', (req, res) => {
  var connection = mysql.createConnection(mysqlConfig)

  connection.connect()

  connection.query(`INSERT INTO peoples (name) VALUE ('${ random.first() }')`)

  const table = getPeoples(connection, (content) => {
    res.send('<h1>Full Cycle Rocks!</h1>' + content)
  })

  connection.end()
})

function getPeoples (connection, callback) {
  const query = connection.query('SELECT name FROM peoples', function (error, results, fields) {
    if(error) return callback('<h1>could not capture the names<h2>');

    if(results.length == 0) callback('<h1>Name list is empty<h2>');  

    callback(mountTable(results))
  })
}

function mountTable (results) {
  table = '<table border="1">'
  table += '<tr><th>names</th></tr>'
  
  for(var result of results) {
    table += `<tr><td>${result.name}</td></tr>`  
  }
  
  table += '</table>'

  return table
}

app.listen(port, () => console.log(`Server running at ${port}`))