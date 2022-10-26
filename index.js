const express = require('express');
const morgan = require('morgan');

let data = require('./data');
const app = express();
const PORT = 3005;

app.use(express.json());

// app.use(morgan(':method :url :status :res[content-length] - :response-time ms'))

app.use(morgan((tokens, req, res) => {

    const obj = req.body ? JSON.stringify(req.body) || '';

    return [
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, 'content-length'), '-',
        tokens['response-time'](req, res), 'ms',
        obj
    ].join(' ')
}));

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
});

app.get('/api/persons', (request, response) => {
    response.json(data)
});

app.get('/api/info', (request, response) => {
    const message = `<p>Phonebook has info for ${data.length} people</p>
                    <p>${new Date}</p>`;

    response.send(message);
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
});

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
});

app.get('/api/persons', (request, response) => {
    response.json(data)
});

app.get('/api/info', (request, response) => {
    const message = `<p>Phonebook has info for ${data.length} people</p>
                    <p>${new Date}</p>`;

    response.send(message);
});

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id);
    const person = data.find(item => item.id === id);

    if (person) response.json(person);
    response.status(404).end();
});

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id);
    data = data.filter(item => item.id !== id);
    response.status(204).end()
})

app.post('/api/persons', (request, response) => {
    const body = request.body;

    if (!body) {
        return response.status(400).json({
            error: 'content missing'
        })
    }

    if (!body.name || !body.number) {
        return response.status(400).json({
            error: 'name and phone number are required'
        })
    }

    if (data.findIndex(item => item.name === body.name) >= 0) {
        return response.status(400).json({
            error: 'name must be unique'
        })
    }

    const person = {
        name: body.name,
        number: body.number,
        id: generateId(),
    }

    data = data.concat(person);

    response.json(person);
});

const generateId = () => {
    const maxId = data.length > 0 ? Math.max(...data.map(item => item.id)) : 0;
    return maxId + 1;
}