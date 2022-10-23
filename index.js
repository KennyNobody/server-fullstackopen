const http = require('http')
const data = require('./data');

const app = http.createServer((request, response) => {
    response.writeHead(200, {'Content-Type': 'application/json'})
    response.end(JSON.stringify(data))
})

const PORT = 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)