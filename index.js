const express = require('express');
const data = require('./data');
const app = express();
const PORT = 3001;

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
});

app.get('/api/notes', (request, response) => {
    response.json(data)
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
});