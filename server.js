const express = require('express');
const app = express();
const { serverIp, serverPort } = require('./config'); // Importa o IP e a porta do config.js
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const treinosRouter = require('./treinos');
const alunosRouter = require('./alunos');
const exerciciosRouter = require('./exercicios');
const path = require('path');

// Configuração do Swagger
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API de Treinos e Alunos',
            version: '1.0.0',
            description: 'Documentação da API de Treinos e Alunos',
        },
    },
    apis: ['./treinos.js', './alunos.js', './exercicios.js'],
};

// Definindo o diretório público para servir arquivos estáticos (HTML, CSS)
app.use(express.static(path.join(__dirname, 'public')));

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use(express.json());

// Rotas principais
app.use(alunosRouter);
app.use(exerciciosRouter);
app.use(treinosRouter);

app.listen(serverPort, serverIp, () => {
    console.log(`Servidor rodando em http://${serverIp}:${serverPort}`);
});
