'use strict';
const express = require('express');
const cors = require('cors');
const { foodsRouter } = require('./routes');
const { graphqlHTTP } = require('express-graphql');
const { foodsSchema: schema } = require('./graphql/schema');
const { healthMonitor } = require('@condor-labs/health-middleware');


require('./config/mongodb/connet');


const app = express();
healthMonitor(app);

app.use(express.json());
app.use(cors());

app.use('/api/v1/', foodsRouter);
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
    graphql: '/graphql/v1/foods/',
  });
});

module.exports = app;
