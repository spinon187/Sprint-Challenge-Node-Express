const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');

const projectRouter = require('./data/projectRouter');

const server = express();

server.use(express.json());
server.use(helmet());
server.use(morgan('dev'));

server.use('/api/projects', projectRouter);

function errorHandler(err, req, res, next){
    res.status(400).json({message: 'nawww'});
  }

server.get('/', (req, res) => {
    res.send('<h2>Main Screen Turn on</h2>')
});

server.use(errorHandler);

module.exports = server;