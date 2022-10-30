require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
let data = require('./data');
const app = express();
const PORT = process.env.PORT;

const Item = require('./models/item');

const errorHandler = (error, request, response, next) => {
    if (error.name === 'CastError') {
        return response.status(400).send({error: 'malformatted id'})
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({error: error.message})
    }

    next(error);
}

app.use(express.static('build'));
app.use(cors());
app.use(express.json());

app.use(morgan((tokens, req, res) => {
    return [
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, 'content-length'), '-',
        tokens['response-time'](req, res), 'ms',
        JSON.stringify(req.body)
    ].join(' ')
}));

app.listen(PORT, () => {
     console.log(`Server running on port ${PORT}`)
});

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
});

app.get('/api/info', (request, response) => {
    const message = `<p>Phonebook has info for ${data.length} people</p>
                    <p>${new Date}</p>`;

    response.send(message);
});

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
});

app.get('/api/persons', (request, response) => {
    Item.find({}).then(note => {
        response.json(note);
    });
});

app.get('/api/info', (request, response) => {
    const message = `<p>Phonebook has info for ${data.length} people</p>
                    <p>${new Date}</p>`;

    response.send(message);
});

app.get('/api/persons/:id', (request, response, next) => {
    Item.findById(request.params.id)
        .then(note => {
            if (note) {
                response.json(note);
            } else {
                response.status(404).end();
            }
        })
        .catch(error => next(error));
});

app.delete('/api/persons/:id', (request, response, next) => {
    Item.findByIdAndRemove(request.params.id)
        .then(() => {
            response.status(204).end()
        })
        .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
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

    const person = new Item({
        name: body.name,
        number: body.number,
    });

    person.save()
        .then(savedPerson => {
            response.json(savedPerson)
        })
        .catch(error => next(error));
});

app.use(errorHandler);