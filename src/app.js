"use strict";
const express = require('express');
const cors = require('cors');
const { mongoDb } = require('./config');
const { foods } = require('./routes');
const { graphqlHTTP } = require('express-graphql');
const { foodsSchema: schema } = require('./graphql/schema');
const { application } = require('express');

require('dotenv').config();

const app = express();



mongoDb();

app.use(express.json());
app.use(cors());

app.use('/api/v1/', foods);
app.use(
    '/graphql/v1/foods/',
    graphqlHTTP({
        graphiql: true,
        schema,
    })
);

app.use('/', (req, res) => {
    res.send({
        service: 'RESTAURANT REST API',
        server: '/api/v1/foods',
        graphql: '/graphql/v1/foods/'
    })
})



module.exports = app;